import { PageHeader } from "@/components/ui";
import { TicketForm } from "@/components/ticket-form";
import { requireUser } from "@/lib/auth";

export default async function NewTicketPage() {
  const { user, profile } = await requireUser();

  return (
    <>
      <PageHeader
        title="Skapa nytt uppdrag"
        description="Fyll i briefen så får marknadsavdelningen rätt underlag från start."
      />
      <TicketForm profile={profile} email={user.email ?? ""} />
    </>
  );
}
