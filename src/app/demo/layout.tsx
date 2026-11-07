import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CondominIA | Sistema de Gestão e Rateio para Pequenos Condomínios • R$ 49,90/mês",
  description:
    "O software de gestão feito para prédios de até 30 apartamentos. Calcule o rateio em 3 minutos, acabe com as brigas com o Livro Caixa transparente e receba direto via Pix sem taxas de boleto.",
  keywords: [
    "sistema para pequenos condomínios",
    "software gestão condomínio",
    "rateio de água e luz condomínio",
    "livro caixa condomínio com foto",
    "síndico morador aplicativo",
    "gestão de condomínio sem administradora",
    "software para síndico iniciante",
    "pix para condomínio",
    "app de condomínio barato",
  ],
  authors: [{ name: "DGTECH Soluções Tecnológicas" }],
  creator: "DGTECH Soluções Tecnológicas",
  publisher: "CondominIA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "CondominIA • Gestão Sem Burocracia para Pequenos Condomínios",
    description:
      "Economize até R$ 12.000/ano no seu prédio. Rateio em 3 minutos, prestação de contas com fotos de notas fiscais e recebimento via Pix.",
    url: "https://condominia.com.br/demo",
    siteName: "CondominIA",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CondominIA • Software para Pequenos Condomínios",
    description:
      "Chega de planilhas e brigas em assembleia. Conheça a demonstração interativa em 1 clique!",
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Schema.org Structured Data (SoftwareApplication + FAQPage) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": "CondominIA",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web, Android, iOS, Windows, macOS",
                "description":
                  "Plataforma de gestão simplificada, rateio de água e luz e livro caixa transparente para pequenos condomínios.",
                "offers": {
                  "@type": "Offer",
                  "price": "49.90",
                  "priceCurrency": "BRL",
                  "billingIncrement": "Monthly",
                  "description": "Plano Essencial para pequenos condomínios",
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "ratingCount": "128",
                },
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Nosso condomínio não possui CNPJ. Podemos usar o CondominIA?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Sim! O CondominIA foi feito exatamente para pequenos prédios e vilas residenciais. O recebimento via Pix pode ser configurado com chave do condomínio, conta conjunta ou chave do síndico responsável.",
                    },
                  },
                  {
                    "@type": "Question",
                    "name": "Preciso emitir boletos bancários?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Não! Você economiza até R$ 5,00 por boleto cobrado pelos bancos tradicionais. Os moradores pagam via Pix direto para a conta do condomínio, sem taxas de intermediação.",
                    },
                  },
                  {
                    "@type": "Question",
                    "name": "E se algum morador for idoso ou não tiver facilidade com tecnologia?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "O acesso é imediato via link no WhatsApp. Não exige senhas complexas nem instalação pesada da Play Store. O morador clica no link e já visualiza a cota e a chave Pix em tela limpa e de fácil leitura.",
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
