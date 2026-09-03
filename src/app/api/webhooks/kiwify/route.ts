import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Kiwify Webhook] Event received:', JSON.stringify(body, null, 2));

    const orderStatus = body.order_status; // 'paid', 'refunded', 'chargedback', 'waiting_payment'
    const customer = body.Customer || {};
    const customerEmail = customer.email;

    if (!customerEmail) {
      return NextResponse.json({ message: 'No customer email provided' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      if (orderStatus === 'paid') {
        console.log('[Kiwify Webhook] Payment APPROVED for: ' + customerEmail);

        // 1. Verificar se o perfil do corretor já existe pelo email
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', customerEmail)
          .single();

        if (existingProfile) {
          // Atualizar perfil existente como ativo
          await supabase
            .from('profiles')
            .update({
              bio: existingProfile.bio || 'Corretor com acesso Pro liberado.'
            })
            .eq('id', existingProfile.id);
        } else {
          console.log('[Kiwify Webhook] User ' + customerEmail + ' paid and will register on /cadastro');
        }
      } else if (orderStatus === 'refunded' || orderStatus === 'chargedback') {
        console.log('[Kiwify Webhook] Payment REVOKED (' + orderStatus + ') for: ' + customerEmail);
      }
    }

    // A Kiwify exige retorno HTTP 200 para confirmar recebimento
    return NextResponse.json({
      received: true,
      status: orderStatus,
      email: customerEmail
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Kiwify Webhook] Error processing webhook:', error);
    return NextResponse.json({
      error: error.message || 'Internal error'
    }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Webhook endpoint active',
    service: 'ImobLink Kiwify Integration'
  });
}
