import Link from "next/link";
import { getFlags } from "@/lib/features";

export default async function Home() {
  const flags = await getFlags();
  return (
    <div className="stack">
      <h1 style={{ fontSize: "var(--fs-2xl)", margin: 0 }}>
        Manutenção sem dor de cabeça, com orçamento em poucas horas
      </h1>
      <p className="hint" style={{ fontSize: "var(--fs-lg)" }}>
        Conte o que precisa. Enviamos um profissional avaliado e o orçamento chega aqui.
      </p>
      {flags.formulario && (
        <Link className="btn btn--primary" href="/ir">Solicitar orçamento</Link>
      )}
      <div className="card">
        <strong>Em construção.</strong>
        <p className="hint">Os serviços, a galeria e o formulário chegam nas próximas partes.</p>
      </div>
    </div>
  );
}
