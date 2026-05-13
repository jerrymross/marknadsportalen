import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return { supabase, user, profile };
}

export async function requireUser() {
  const session = await getCurrentUser();
  if (!session.user) redirect("/login");
  return session as Awaited<ReturnType<typeof getCurrentUser>> & {
    user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>["user"]>;
  };
}

export async function requireAdmin() {
  const session = await requireUser();
  if (session.profile?.role !== "admin") redirect("/tickets");
  return session;
}
