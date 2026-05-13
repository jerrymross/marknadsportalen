import Link from "next/link";
import { Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
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
