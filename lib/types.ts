import type { Category, Priority, TicketStatus } from "@/lib/constants";

export type Role = "beställare" | "admin";

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  department: string | null;
  role: Role;
};

export type Ticket = {
  id: string;
  ticket_number: string;
  title: string;
  requester_id: string | null;
  requester_name: string;
  requester_email: string;
  department: string;
  category: Category;
  description: string;
  goal: string | null;
  target_audience: string | null;
  usage_channel: string | null;
  deadline: string | null;
  priority: Priority;
  status: TicketStatus;
  eta: string | null;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  ticket_id: string;
  user_id: string | null;
  body: string;
  is_internal: boolean;
  created_at: string;
  profiles?: Pick<Profile, "name" | "email" | "role"> | null;
};

export type TicketFile = {
  id: string;
  ticket_id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  uploaded_by: string | null;
  created_at: string;
};

export type StatusHistory = {
  id: string;
  ticket_id: string;
  old_status: TicketStatus | null;
  new_status: TicketStatus;
  changed_by: string | null;
  created_at: string;
};
