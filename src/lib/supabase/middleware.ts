import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getLocaleFromPath, stripLocale } from "@/i18n/path";

const PROTECTED_PREFIXES = ["/listings/new", "/portal"];
const ADMIN_PREFIX = "/portal/admin";

export async function updateSession(
  request: NextRequest,
  response?: NextResponse,
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let supabaseResponse = response ?? NextResponse.next({ request });

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
          headers: response?.headers,
        });
        if (response) {
          response.cookies.getAll().forEach((c) => {
            supabaseResponse.cookies.set(c.name, c.value);
          });
        }
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const locale = getLocaleFromPath(pathname);
  const path = stripLocale(pathname);

  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));
  const isAdmin = path.startsWith(ADMIN_PREFIX);

  if ((isProtected || isAdmin) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}/login`;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = `/${locale}`;
      return NextResponse.redirect(homeUrl);
    }
  }

  return supabaseResponse;
}
