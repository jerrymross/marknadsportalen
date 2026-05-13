import { ButtonLink, EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <EmptyState
      title="Sidan hittades inte"
      text="Ärendet eller sidan finns inte, eller så saknar du behörighet."
      action={<ButtonLink href="/tickets">Till mina uppdrag</ButtonLink>}
    />
  );
}
