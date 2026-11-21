export const metadata = { title: "Área do profissional" };

export default function Profissional() {
  return (
    <div className="stack">
      <h1 style={{ fontSize: "var(--fs-xl)", margin: 0 }}>Seus pedidos</h1>
      <div className="card">
        <strong>Sem pedidos novos.</strong>
        <p className="hint">Avisaremos quando chegar um. A fila completa vem nas próximas partes.</p>
      </div>
    </div>
  );
}
