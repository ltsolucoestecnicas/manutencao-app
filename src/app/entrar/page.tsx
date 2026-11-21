import { getFlags } from "@/lib/features";
import LoginForm from "./LoginForm";

export const metadata = { title: "Entrar" };

export default async function Entrar({ searchParams }: { searchParams: { next?: string } }) {
  const flags = await getFlags();
  return (
    <div style={{ maxWidth: "26rem", margin: "0 auto" }} className="stack">
      <h1 style={{ fontSize: "var(--fs-xl)", margin: 0 }}>Entrar ou criar conta</h1>
      <LoginForm googleEnabled={Boolean(flags.login_google)} next={searchParams.next ?? ""} />
    </div>
  );
}
