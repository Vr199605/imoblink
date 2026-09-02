# Integração com Kiwify — acesso liberado só após pagamento

## O que foi implementado

1. **`public.purchases`** (tabela nova no Supabase, já criada no projeto `imoblink`) — guarda cada pedido recebido do Kiwify (aprovado, reembolsado, chargeback), com o payload bruto para auditoria.
2. **`public.has_active_purchase(email)`** (função no banco) — diz se um e-mail tem compra aprovada e válida, sem expor nenhum dado da compra (só `true`/`false`).
3. **`/api/webhooks/kiwify`** (`src/app/api/webhooks/kiwify/route.ts`) — recebe as notificações do Kiwify e grava/atualiza a compra. Reembolso ou chargeback sobrescreve o mesmo pedido para `refunded`, revogando o acesso.
4. **Cadastro (`/cadastro`)** — só cria a conta se o e-mail digitado tiver uma compra aprovada. Caso contrário, mostra a mensagem pedindo para usar o e-mail da compra ou pagar primeiro (com link pro checkout).
5. **Painel (`/dashboard/**`)** — todas as páginas do painel (imóveis, perfil etc.) passaram a exigir login **e** compra aprovada. Se o pagamento for reembolsado/estornado, na próxima vez que a pessoa abrir o painel ela é deslogada e vê uma tela explicando que o acesso não está ativo, com botão para pagar.
6. **Catálogo público (`/c/[corretor]/...`)** — não foi tocado, continua 100% livre, sem login nem pagamento — é a parte que os clientes finais dos corretores acessam.

Já testei a função do banco diretamente (compra aprovada libera, reembolso do mesmo pedido bloqueia, comparação de e-mail funciona maiúsculo/minúsculo) e testei a rota do webhook localmente (rejeita sem token, rejeita token errado, aceita token certo). O que falta para funcionar em produção são só as configurações abaixo — nenhuma delas eu consigo fazer sozinho porque envolvem segredos que não devem passar por aqui.

## ⚠️ Passos que você precisa fazer (obrigatórios)

### 1. Variáveis de ambiente na Vercel

No projeto da Vercel → **Settings → Environment Variables**, adicione (em Production, e Preview se usar):

| Nome | Valor | Onde pegar |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | (chave secreta) | Supabase → seu projeto `imoblink` (`https://ftepujgjsfzjuzsgnunh.supabase.co`) → **Settings → API** → campo **service_role** (secreto, nunca comece com `NEXT_PUBLIC_`) |
| `KIWIFY_WEBHOOK_TOKEN` | `05cce63a229980086b7dc1418b489b1f9474f48a58073953` (sugestão pronta) ou outro valor forte que você escolher | Você mesmo define; só precisa ser **exatamente o mesmo** valor configurado no Kiwify (passo 2) |
| `NEXT_PUBLIC_KIWIFY_CHECKOUT_URL` | `https://pay.kiwify.com.br/mlnL2Me` | Opcional — se não configurar, o app já usa esse link como padrão |

Depois de adicionar, faça um redeploy (qualquer novo commit/push já dispara, ou use "Redeploy" no painel da Vercel).

### 2. Webhook no Kiwify

No painel do Kiwify → **Apps/Integrações → Webhooks → Criar webhook**:

- **URL do webhook:**
  `https://SEU-DOMINIO-NA-VERCEL/api/webhooks/kiwify?signature=05cce63a229980086b7dc1418b489b1f9474f48a58073953`
  (troque `SEU-DOMINIO-NA-VERCEL` pelo domínio real do site depois do deploy, e o token pelo mesmo valor que você colocou em `KIWIFY_WEBHOOK_TOKEN`)
- **Produto:** selecione o produto vendido nesse link (`https://pay.kiwify.com.br/mlnL2Me`)
- **Eventos/gatilhos:** marque pelo menos **compra aprovada**, **compra reembolsada** e **chargeback**

### 3. Confirmar que está tudo certo

- No Kiwify, use o botão de **enviar teste** do webhook (ou faça uma compra real de teste).
- No Supabase → **Table Editor → purchases**, confira se a linha chegou com `status = approved` e o `raw_payload` preenchido.
- Tente criar uma conta em `/cadastro` com esse e-mail de teste — deve funcionar.
- Tente com um e-mail sem compra — deve ser bloqueado com a mensagem de pagamento pendente.

> Se o payload do Kiwify chegar com um formato diferente do que o código espera, a linha ainda é salva em `purchases` com o `raw_payload` completo (nada se perde) — é só me mostrar uma linha de teste que eu ajusto a extração dos campos.

## Observação separada (não relacionada ao Kiwify)

Notei que hoje, depois de um cadastro real (via Supabase), o painel carrega o perfil "de demonstração" salvo no navegador em vez do perfil recém-criado — um problema que já existia antes dessa mudança, na forma como o dashboard lê os dados do corretor. Não mexi nisso agora para não aumentar o risco desta entrega, mas posso corrigir em seguida se você quiser.
