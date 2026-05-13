import { notFound } from "next/navigation";
import { TicketDetail } from "@/components/ticket-detail";
import { requireUser } from "@/lib/auth";
import type { Comment, StatusHistory, Ticket, TicketFile } from "@/lib/types";

export default async function TicketPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, profile } = await requireUser();
  const isAdmin = profile?.role === "admin";

  const [{ data: ticket }, { data: comments }, { data: files }, { data: history }] =
    await Promise.all([
      supabase.from("tickets").select("*").eq("id", id).single<Ticket>(),
      supabase
        .from("comments")
        .select("*, profiles(name, email, role)")
        .eq("ticket_id", id)
        .order("created_at", { ascending: true })
        .returns<Comment[]>(),
      supabase
        .from("files")
        .select("*")
        .eq("ticket_id", id)
        .order("created_at", { ascending: false })
        .returns<TicketFile[]>(),
      supabase
        .from("status_history")
        .select("*")
        .eq("ticket_id", id)
        .order("created_at", { ascending: false })
        .returns<StatusHistory[]>()
    ]);

  if (!ticket) notFound();

  return (
    <TicketDetail
      ticket={ticket}
      comments={comments ?? []}
      files={files ?? []}
      history={history ?? []}
      isAdmin={isAdmin}
    />
  );
}
