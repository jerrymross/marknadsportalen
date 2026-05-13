import Link from "next/link";
import { Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export async function Header() {
  const hasConfig = hasSupabaseConfig();
  const supabase = hasConfig ? await createClient() : null;
  const {
    data: { user }
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  let role: string | null = null;
  if (supabase && user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = data?.role ?? null;
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-950">
          <span className="flex size-9 items-center justify-center rounded-md bg-brand-600 text-white">
            <Megaphone size={19} />
          </span>
          Marknadsportalen
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link className="hover:text-slate-950" href="/new">
            Nytt uppdrag
          </Link>
          <Link className="hover:text-slate-950" href="/tickets">
            Mina uppdrag
          </Link>
          {role === "admin" ? (
            <Link className="hover:text-slate-950" href="/admin">
              Admin
            </Link>
          ) : null}
          {user ? (
            <form action={signOut}>
              <button className="rounded-md border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50">
                Logga ut
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-slate-950 px-3 py-2 text-white hover:bg-slate-800"
            >
              Logga in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
