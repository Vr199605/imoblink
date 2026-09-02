// Link de checkout do Kiwify usado sempre que o app precisa mandar alguém
// pagar (bloqueio de cadastro, bloqueio de dashboard após reembolso, etc.).
// Pode ser sobrescrito por variável de ambiente sem precisar mexer no código.
export const KIWIFY_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_URL || 'https://pay.kiwify.com.br/mlnL2Me';
