import { createBrowserClient } from "@supabase/ssr";

// Só usa chaves públicas. A service_role nunca entra no navegador.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
