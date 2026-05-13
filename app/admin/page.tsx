import { AdminTicketList } from "@/components/admin-ticket-list";
import { PageHeader } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import type { Ticket } from "@/lib/types";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .order("updated_at", { ascending: false })
    .returns<Ticket[]>();

  const open = tickets?.filter((ticket) => !["Klart", "Avslutat"].includes(ticket.status)).length ?? 0;
  const urgent = tickets?.filter((ticket) => ticket.priority === "akut").length ?? 0;
  const waiting = tickets?.filter((ticket) => ticket.status === "Behöver mer information").length ?? 0;

  return (
    <>
      <PageHeader
        title="Admin-dashboard"
        description="Hantera inflöde, prioritera ärenden, sätt ETA och följ status."
      />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Öppna ärenden</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{open}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Akuta</p>
          <p className="mt-2 text-3xl font-semibold text-red-700">{urgent}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Väntar på info</p>
          <p className="mt-2 text-3xl font-semibold text-amber-700">{waiting}</p>
        </div>
      </div>
      <AdminTicketList tickets={tickets ?? []} />
    </>
  );
}
