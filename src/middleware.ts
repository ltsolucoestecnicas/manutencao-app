import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Área -> perfis que podem entrar. A checagem de verdade também está no banco (RLS).
const AREAS: Record<string, string[]> = {
  "/cliente": ["client"],
  "/profissional": ["professional"],
  "/admin": ["admin"],
};
const HOME: Record<string, string> = {
  client: "/cliente",
  professional: "/profissional",
  admin: "/admin",
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // getUser() valida o token no servidor do Supabase (mais seguro que getSession)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const area = Object.keys(AREAS).find((a) => path === a || path.startsWith(a + "/"));
  if (!area) return response;

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.search = `?next=${encodeURIComponent(path)}`;
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.status !== "active" || !AREAS[area].includes(profile.role)) {
    const url = request.nextUrl.clone();
    url.pathname = profile && profile.status === "active" ? HOME[profile.role] ?? "/" : "/entrar";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|icons/|offline.html).*)"],
};
