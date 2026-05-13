import { ButtonLink, EmptyState, PageHeader } from "@/components/ui";
import { TicketCard } from "@/components/ticket-card";
import { requireUser } from "@/lib/auth";
import type { Ticket } from "@/lib/types";

type TicketWithComments = Ticket & {
  comments?: { body: string; created_at: string; is_internal: boolean }[];
};

export default async function MyTicketsPage() {
  const { supabase, user } = await requireUser();
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*, comments(body, created_at, is_internal)")
    .eq("requester_id", user.id)
    .order("updated_at", { ascending: false })
    .returns<TicketWithComments[]>();

  return (
    <>
      <PageHeader
        title="Mina uppdrag"
        description="Här ser du status, ETA, deadline och senaste öppna kommentar för dina uppdrag."
        actions={<ButtonLink href="/new">Skapa nytt uppdrag</ButtonLink>}
      />
      {tickets?.length ? (
        <div className="grid gap-4">
          {tickets.map((ticket) => {
            const latestComment = ticket.comments
              ?.filter((comment) => !comment.is_internal)
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )[0]?.body;

            return (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                latestComment={latestComment}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Du har inga uppdrag ännu"
          text="Skapa ditt första uppdrag så kan du följa hela vägen från inskickat till klart."
          action={<ButtonLink href="/new">Skapa nytt uppdrag</ButtonLink>}
        />
      )}
    </>
  );
}
