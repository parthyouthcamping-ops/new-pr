import { sql } from '@/lib/neon';

// UUID v4-ish pattern used to decide whether we can safely query by `id` (uuid column).
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const VALID_STATUSES = ['pending', 'reserved', 'booked', 'cancelled', 'sent'] as const;
export type BookingStatus = (typeof VALID_STATUSES)[number];

function normalizeJsonMaybeString(v: any): any {
  if (typeof v === 'string') {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  }
  return v;
}

function mapQuotationRowToQuotePayload(row: any): any {
  const itinerary = normalizeJsonMaybeString(row.itinerary);
  const createdAt = row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at;

  return {
    ...(itinerary || {}),
    id: row.id,
    slug: row.slug,
    trip_name: row.trip_name,
    price: typeof row.price === 'string' ? Number(row.price) : row.price,
    createdAt,
  };
}

function mapQuotationRowToApiPayload(row: any): any {
  const itinerary = normalizeJsonMaybeString(row.itinerary);
  const createdAt = row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at;

  return {
    ...(itinerary || {}),
    id: row.id,
    slug: row.slug,
    createdAt,
  };
}

export async function getQuotationBySlug(slug: string): Promise<any | null> {
  const rows = await sql`
    SELECT id, slug, trip_name, price, itinerary, created_at
    FROM quotations
    WHERE slug = ${slug}
    LIMIT 1
  `;

  if (!rows?.length) return null;
  return mapQuotationRowToQuotePayload(rows[0]);
}

export async function getQuotationApiByIdOrSlug(idOrSlug: string): Promise<any | null> {
  const isUUID = UUID_REGEX.test(idOrSlug);

  // Important: querying `id = ${idOrSlug}` when `idOrSlug` is not a valid uuid will throw in Postgres.
  const rows = isUUID
    ? await sql`
        SELECT id, slug, itinerary, created_at
        FROM quotations
        WHERE id = ${idOrSlug} OR slug = ${idOrSlug}
        LIMIT 1
      `
    : await sql`
        SELECT id, slug, itinerary, created_at
        FROM quotations
        WHERE slug = ${idOrSlug}
        LIMIT 1
      `;

  if (!rows?.length) return null;
  return mapQuotationRowToApiPayload(rows[0]);
}

export async function updateQuotationStatusById(
  id: string,
  status: string
): Promise<
  | {
      id: string;
      previousStatus: string | undefined;
      newStatus: BookingStatus;
      isBooked: boolean;
      isReserved: boolean;
    }
  | null
> {
  if (!VALID_STATUSES.includes(status as BookingStatus)) return null;

  const rows = await sql`
    SELECT itinerary
    FROM quotations
    WHERE id = ${id}
    LIMIT 1
  `;

  if (!rows?.length) return null;

  const quotation = normalizeJsonMaybeString(rows[0].itinerary) as any;
  const prevStatus: string | undefined = quotation?.bookingStatus;

  quotation.bookingStatus = status;
  quotation.isBooked = status === 'booked';
  quotation.isReserved = status === 'reserved';

  await sql`
    UPDATE quotations
    SET itinerary = ${JSON.stringify(quotation)}::jsonb
    WHERE id = ${id}
  `;

  return {
    id,
    previousStatus: prevStatus,
    newStatus: status as BookingStatus,
    isBooked: quotation.isBooked,
    isReserved: quotation.isReserved,
  };
}

export const quotationValidStatuses = VALID_STATUSES as readonly BookingStatus[];

