import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Cliente Supabase Singleton.
 * Se as variáveis de ambiente não estiverem configuradas, o cliente é instanciado
 * de forma segura sem quebrar a execução do frontend.
 */
export const supabase = createClient(
  supabaseUrl || "https://placeholder-condominia.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith("https://") &&
  supabaseAnonKey &&
  supabaseAnonKey !== "placeholder-anon-key"
);

/**
 * Upload de comprovante de despesa para o Supabase Storage (Bucket: receipts)
 */
export async function uploadReceiptToSupabase(
  condoId: string,
  file: File
): Promise<{ publicUrl: string | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return {
      publicUrl: URL.createObjectURL(file),
      error: null,
    };
  }

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${condoId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("receipts").getPublicUrl(fileName);
    return { publicUrl: data.publicUrl, error: null };
  } catch (err: any) {
    console.error("Erro no upload do comprovante para o Supabase Storage:", err);
    return { publicUrl: null, error: err };
  }
}
