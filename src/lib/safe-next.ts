// Evita "open redirect": só aceita caminhos internos.
export function safeNext(value: string | null | undefined, fallback = "/ir"): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
