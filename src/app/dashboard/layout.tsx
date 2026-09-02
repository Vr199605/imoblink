'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { KIWIFY_CHECKOUT_URL } from '@/lib/kiwify';
import { Loader2, Lock } from 'lucide-react';

type GuardState = 'checking' | 'allowed' | 'blocked';

// Protege TODAS as rotas dentro de /dashboard/**: exige login E um pagamento
// aprovado no Kiwify para o e-mail da conta. Se o pagamento for reembolsado
// ou estornado, o webhook do Kiwify já marcou a compra como inválida em
// public.purchases — na próxima vez que a pessoa abrir o painel, ela é
// deslogada automaticamente aqui.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<GuardState>(isSupabaseConfigured ? 'checking' : 'allowed');

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Modo local/demonstração (sem Supabase configurado): sem cobrança real,
      // não faz sentido bloquear o painel.
      setState('allowed');
      return;
    }

    let active = true;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.email) {
        if (active) router.replace('/login');
        return;
      }

      const { data: hasPurchase, error } = await supabase.rpc('has_active_purchase', {
        check_email: user.email,
      });

      if (!active) return;

      if (error) {
        // Falha ao checar pagamento (ex.: instabilidade momentânea): por
        // segurança não libera o painel, mas também não desloga a pessoa —
        // ela pode simplesmente recarregar a página em seguida.
        console.error('Erro ao verificar pagamento:', error);
        setState('blocked');
        return;
      }

      if (!hasPurchase) {
        await supabase.auth.signOut();
        if (active) setState('blocked');
        return;
      }

      setState('allowed');
    })();

    return () => {
      active = false;
    };
  }, [router]);

  if (state === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Verificando seu acesso...</span>
        </div>
      </div>
    );
  }

  if (state === 'blocked') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900">Acesso não está ativo</h1>
          <p className="text-sm text-slate-500">
            Não encontramos um pagamento aprovado e ativo para esta conta. Se você já pagou,
            aguarde alguns instantes e tente novamente — a confirmação pode levar um instante para
            chegar. Se o problema continuar, confira se está usando o mesmo e-mail da compra.
          </p>
          <a
            href={KIWIFY_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all"
          >
            Ver plano e assinar
          </a>
          <a href="/login" className="block text-xs font-bold text-slate-500 hover:text-slate-700">
            Voltar para o login
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
