import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Kiwify Webhook] Event received:', JSON.stringify(body, null, 2));

    const orderId = body.order_id || body.id || 'test_' + Date.now();
    const orderStatus = body.order_status || 'paid';
    const customer = body.Customer || body.customer || {};
    const customerEmail = customer.email || 'sem-email@kiwify.com';
    const customerName = customer.full_name || customer.name || 'Cliente Kiwify';
    const customerPhone = customer.mobile || customer.phone || '';
    const product = body.Product || body.product || {};
    const productName = product.product_name || product.name || 'ImobLink Pro';
    const paymentMethod = body.payment_method || 'pix';

    if (isSupabaseConfigured && supabase) {
      // 1. Salvar o pedido/teste na tabela public.orders
      const { error: orderError } = await supabase.from('orders').insert([
        {
          order_id: String(orderId),
          order_status: String(orderStatus),
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          product_name: productName,
          payment_method: paymentMethod
        }
      ]);

      if (orderError) {
        console.error('[Kiwify Webhook] Error inserting into orders table:', orderError);
      } else {
        console.log('[Kiwify Webhook] Order saved to Supabase orders table successfully!');
      }

      // 2. Se for pedido aprovado ('paid'), atualizar perfil existente se já estiver cadastrado
      if (orderStatus === 'paid') {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', customerEmail)
          .single();

        if (existingProfile) {
          await supabase
            .from('profiles')
            .update({
              bio: existingProfile.bio || 'Corretor com acesso Pro liberado via Kiwify.'
            })
            .eq('id', existingProfile.id);
        }
      }
    }

    return NextResponse.json({
      received: true,
      order_id: orderId,
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
    service: 'ImobLink Kiwify Integration',
    orders_table_support: true
  });
}
