import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImobLink — Catálogo Digital & Fichas de Imóveis para Corretores",
  description: "Crie páginas de alta conversão para seus imóveis em 2 minutos e venda muito mais pelo WhatsApp.",
  openGraph: {
    title: "ImobLink — Catálogo Digital para Corretores Autônomos",
    description: "Páginas profissionais para imóveis, fichas em PDF e atendimento rápido no WhatsApp.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
