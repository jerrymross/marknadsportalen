insert into public.tickets (
  ticket_number,
  title,
  requester_name,
  requester_email,
  department,
  category,
  description,
  goal,
  target_audience,
  usage_channel,
  deadline,
  priority,
  status,
  eta
) values
(
  'MKT-2026-001',
  'Kampanjbild för öppet hus',
  'Anna Beställare',
  'anna@example.com',
  'Gymnasieskolan',
  'Grafisk produktion',
  'Behöver en huvudbild och enklare grafiskt material för öppet hus.',
  'Öka anmälningar till öppet hus.',
  'Vårdnadshavare och blivande elever',
  'Webb, sociala medier och skärmar',
  '2026-06-05',
  'hög',
  'Pågår',
  '2026-05-27'
),
(
  'MKT-2026-002',
  'Landningssida för utbildningspaket',
  'Erik Beställare',
  'erik@example.com',
  'Vuxenutbildningen',
  'Webb',
  'Skapa en enkel landningssida för nytt utbildningspaket.',
  'Driva intresseanmälningar.',
  'Yrkesbytare',
  'Webb',
  '2026-06-12',
  'normal',
  'Mottaget',
  null
)
on conflict (ticket_number) do nothing;

insert into public.comments (ticket_id, user_id, body, is_internal)
select id, null, 'Exempelkommentar: underlaget är mottaget och marknad återkommer med första korrektur.', false
from public.tickets
where ticket_number = 'MKT-2026-001'
on conflict do nothing;

select setval('ticket_number_seq', greatest((select count(*) from public.tickets), 1), true);
