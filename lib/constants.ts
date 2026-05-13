export const categories = [
  "Grafisk produktion",
  "Sociala medier",
  "Trycksak",
  "Webb",
  "Kod/utveckling",
  "Foto/video",
  "Text/copy",
  "Annat"
] as const;

export const priorities = ["låg", "normal", "hög", "akut"] as const;

export const statuses = [
  "Inskickat",
  "Mottaget",
  "Behöver mer information",
  "Planerat",
  "Pågår",
  "Korrektur",
  "Väntar på godkännande",
  "Klart",
  "Avslutat"
] as const;

export const adminFilters = [
  "Alla",
  "Nya",
  "Pågående",
  "Väntar på info",
  "Korrektur",
  "Klara",
  "Akuta"
] as const;

export type Category = (typeof categories)[number];
export type Priority = (typeof priorities)[number];
export type TicketStatus = (typeof statuses)[number];
