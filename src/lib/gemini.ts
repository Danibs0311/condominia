"use client";

// Integração com Google Gemini AI para o CondominIA
// Funções: OCR de notas fiscais, auditoria de consumo e redator de avisos no mural.

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export interface ReceiptAnalysisResult {
  description: string;
  amount: number;
  category: "water" | "electricity" | "maintenance" | "cleaning" | "administrative" | "other";
  date: string;
  vendorName?: string;
  rawConfidence: string;
}

/**
 * OCR Inteligente de Comprovantes e Notas Fiscais via Google Gemini
 */
export async function analyzeReceiptWithGemini(
  base64Data: string,
  mimeType: string = "image/jpeg"
): Promise<ReceiptAnalysisResult | null> {
  const apiKey = GEMINI_API_KEY || (typeof window !== "undefined" ? localStorage.getItem("condominia_gemini_key") : null);

  if (!apiKey) {
    console.warn("Chave do Google Gemini não configurada. Configure GEMINI_API_KEY para OCR automático.");
    return null;
  }

  try {
    const prompt = `Você é um auditor contábil especialista em condomínios. Analise esta imagem de comprovante/recibo/nota fiscal e extraia os seguintes dados em formato JSON estrito:
{
  "description": "Descrição clara e sucinta do serviço ou produto",
  "amount": 0.00,
  "category": "water" | "electricity" | "maintenance" | "cleaning" | "administrative" | "other",
  "date": "DD/MM/AAAA",
  "vendorName": "Nome da empresa ou prestador de serviço",
  "rawConfidence": "alta" | "media" | "baixa"
}
Retorne APENAS o JSON puro sem markdown ao redor.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro na API Gemini: ${response.statusText}`);
    }

    const json = await response.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleanJson = candidateText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Erro ao analisar comprovante com Gemini:", error);
    return null;
  }
}

/**
 * Redator Inteligente de Comunicados para o Mural de Avisos do Síndico
 */
export async function generateNoticeDraftWithGemini(
  topic: string,
  keyDetails: string
): Promise<{ title: string; content: string } | null> {
  const apiKey = GEMINI_API_KEY || (typeof window !== "undefined" ? localStorage.getItem("condominia_gemini_key") : null);

  if (!apiKey) return null;

  try {
    const prompt = `Você é o síndico de um condomínio residencial cordial e profissional. 
Escreva um comunicado para o mural de avisos sobre o seguinte tema: "${topic}".
Detalhes adicionais: "${keyDetails}".
O tom deve ser equilibrado, respeitoso, objetivo e focado na boa convivência e no bem comum.
Retorne no formato JSON:
{
  "title": "Título chamativo e claro em até 60 caracteres",
  "content": "Texto do comunicado bem formatado em parágrafos claros"
}
Retorne APENAS o JSON.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    console.error("Erro ao gerar comunicado com Gemini:", e);
    return null;
  }
}
