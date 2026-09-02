import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';

// Rota que recebe as notificações de pagamento do Kiwify (compra aprovada,
// reembolso, chargeback) e mantém a tabela public.purchases atualizada.
// Configure no Kiwify: URL do webhook = https://SEU_DOMINIO/api/webhooks/kiwify?signature=SEU_TOKEN
// (o mesmo token cadastrado na env var KIWIFY_WEBHOOK_TOKEN).

export const runtime = 'nodejs';

// Status do Kiwify que liberam acesso.
const APPROVED_STATUSES = new Set(['approved', 'paid']);
// Status do Kiwify que devem revogar o acesso imediatamente.
const REVOKED_STATUSES = new Set(['refunded', 'chargedback', 'chargeback']);

function getRequestToken(req: NextRequest): string | null {
  const { searchParams } = new URL(req.url);
  return (
    searchParams.get('signature') ||
    searchParams.get('token') ||
    req.headers.get('x-kiwify-signature') ||
    req.headers.get('x-webhook-token')
  );
}

// Payloads de webhook variam entre provedores e até entre versões do mesmo
// provedor — em vez de depender de um único caminho de campo, tentamos
// vários formatos plausíveis nesta ordem.
function pickString(...values: unknown[]): string | undefined {
  for (const v of values) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  const expectedToken = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!expectedToken) {
    console.error('[kiwify-webhook] KIWIFY_WEBHOOK_TOKEN não configurado no ambiente.');
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  const token = getRequestToken(req);
  if (!token || token !== expectedToken) {
    console.warn('[kiwify-webhook] chamada recusada: token ausente ou inválido.');
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    console.error('[kiwify-webhook] SUPABASE_SERVICE_ROLE_KEY não configurado no ambiente.');
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const orderStatus = pickString(
    payload?.order_status,
    payload?.Order?.status,
    payload?.status
  )?.toLowerCase();

  const email = pickString(
    payload?.Customer?.email,
    payload?.customer?.email,
    payload?.buyer?.email,
    payload?.email
  )?.toLowerCase();

  const orderId = pickString(
    payload?.order_id,
    payload?.Order?.id,
    payload?.order?.id,
    payload?.id
  );

  const customerName = pickString(
    payload?.Customer?.full_name,
    payload?.Customer?.fullname,
    payload?.customer?.full_name
  );

  const productId = pickString(
    payload?.Product?.product_id,
    payload?.product?.product_id,
    payload?.product_id
  );

  const productName = pickString(
    payload?.Product?.product_name,
    payload?.product?.product_name,
    payload?.product_name
  );

  // Sem e-mail ou sem id do pedido não há como vincular a compra a uma conta
  // nem manter o registro idempotente — guardamos o payload bruto para
  // investigar manualmente, mas não tentamos processar como venda.
  if (!email || !orderId) {
    console.warn('[kiwify-webhook] payload sem e-mail ou order_id reconhecível.', {
      orderStatus,
      hasEmail: Boolean(email),
      hasOrderId: Boolean(orderId),
    });
    await supabaseAdmin.from('purchases').insert({
      email: email || 'desconhecido@sem-email.kiwify',
      status: 'unrecognized_payload',
      order_id: orderId || `sem-id-${Date.now()}`,
      raw_payload: payload,
    });
    return NextResponse.json({ received: true, warning: 'payload_not_recognized' });
  }

  let status: string = orderStatus || 'unknown';
  if (orderStatus && APPROVED_STATUSES.has(orderStatus)) status = 'approved';
  else if (orderStatus && REVOKED_STATUSES.has(orderStatus)) status = 'refunded';

  const { error } = await supabaseAdmin.from('purchases').upsert(
    {
      email,
      order_id: orderId,
      status,
      product_id: productId,
      product_name: productName,
      customer_name: customerName,
      raw_payload: payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'order_id' }
  );

  if (error) {
    console.error('[kiwify-webhook] erro ao gravar compra:', error);
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }

  return NextResponse.json({ received: true, status });
}

// Facilita testar se a rota está no ar batendo a URL no navegador.
export async function GET() {
  return NextResponse.json({ ok: true, message: 'Endpoint de webhook do Kiwify ativo.' });
}
