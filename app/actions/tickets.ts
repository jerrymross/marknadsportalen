"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { statuses } from "@/lib/constants";
import { requireUser } from "@/lib/auth";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  if (raw === null) return null;
  const text = String(raw).trim();
  return text.length ? text : null;
}

async function uploadFiles(ticketId: string, formData: FormData, field: string) {
  const { supabase, user } = await requireUser();
  const files = formData
    .getAll(field)
    .filter((file): file is File => file instanceof File && file.size > 0);

  for (const file of files) {
    const extension = file.name.split(".").pop();
    const path = `${ticketId}/${randomUUID()}${extension ? `.${extension}` : ""}`;
    const { error: uploadError } = await supabase.storage
      .from("ticket-files")
      .upload(path, file, { upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from("ticket-files").getPublicUrl(path);
    await supabase.from("files").insert({
      ticket_id: ticketId,
      file_name: file.name,
      file_url: data.publicUrl,
      file_type: file.type || null,
      uploaded_by: user.id
    });
  }
}

export async function createTicket(formData: FormData) {
  const { supabase, user, profile } = await requireUser();
  const requesterName =
    value(formData, "requester_name") ?? profile?.name ?? user.email ?? "Okänd";
  const requesterEmail = value(formData, "requester_email") ?? user.email ?? "";

  const { data, error } = await supabase
    .from("tickets")
    .insert({
      title: value(formData, "title"),
      requester_id: user.id,
      requester_name: requesterName,
      requester_email: requesterEmail,
      department: value(formData, "department"),
      category: value(formData, "category"),
      description: value(formData, "description"),
      goal: value(formData, "goal"),
      target_audience: value(formData, "target_audience"),
      usage_channel: value(formData, "usage_channel"),
      deadline: value(formData, "deadline"),
      priority: value(formData, "priority") ?? "normal",
      status: "Inskickat"
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Kunde inte skapa ärende.");

  await uploadFiles(data.id, formData, "files");

  const extraComment = value(formData, "extra_comments");
  if (extraComment) {
    await supabase.from("comments").insert({
      ticket_id: data.id,
      user_id: user.id,
      body: extraComment,
      is_internal: false
    });
  }

  revalidatePath("/tickets");
  redirect(`/tickets/${data.id}`);
}

export async function addComment(ticketId: string, formData: FormData) {
  const { supabase, user, profile } = await requireUser();
  const body = value(formData, "body");
  const isInternal =
    profile?.role === "admin" && String(formData.get("is_internal") ?? "") === "on";

  if (body) {
    await supabase.from("comments").insert({
      ticket_id: ticketId,
      user_id: user.id,
      body,
      is_internal: isInternal
    });
  }

  await uploadFiles(ticketId, formData, "files");

  revalidatePath(`/tickets/${ticketId}`);
}

export async function updateTicketAdmin(ticketId: string, formData: FormData) {
  const { supabase, user, profile } = await requireUser();
  if (profile?.role !== "admin") throw new Error("Du saknar behörighet.");

  const newStatus = value(formData, "status");
  const eta = value(formData, "eta");
  const internalNote = value(formData, "internal_note");
  const customerComment = value(formData, "customer_comment");

  if (newStatus && statuses.includes(newStatus as (typeof statuses)[number])) {
    await supabase
      .from("tickets")
      .update({ status: newStatus, eta })
      .eq("id", ticketId);
  } else {
    await supabase.from("tickets").update({ eta }).eq("id", ticketId);
  }

  if (internalNote) {
    await supabase.from("comments").insert({
      ticket_id: ticketId,
      user_id: user.id,
      body: internalNote,
      is_internal: true
    });
  }

  if (customerComment) {
    await supabase.from("comments").insert({
      ticket_id: ticketId,
      user_id: user.id,
      body: customerComment,
      is_internal: false
    });
  }

  await uploadFiles(ticketId, formData, "files");

  revalidatePath("/admin");
  revalidatePath(`/tickets/${ticketId}`);
}

export async function approveDelivery(ticketId: string) {
  const { supabase } = await requireUser();
  await supabase.from("tickets").update({ status: "Avslutat" }).eq("id", ticketId);
  revalidatePath(`/tickets/${ticketId}`);
}
