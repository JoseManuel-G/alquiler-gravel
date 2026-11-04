export type TravelSelection = { slug: string; from: string; to: string };
export const EMPTY_SELECTION: TravelSelection = { slug: "", from: "", to: "" };
export const DESTINATIONS = ["baqueira-beret", "formigal-panticosa", "sierra-nevada"];
export function validDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export function normalizeSelection(value: unknown): TravelSelection {
  if (!value || typeof value !== "object") return EMPTY_SELECTION;
  const v = value as Partial<TravelSelection>;
  const from = validDate(v.from) ? v.from : validDate(v.to) ? v.to : "";
  const to = validDate(v.to) && (!from || v.to >= from) ? v.to : from;
  return { slug: typeof v.slug === "string" && /^[a-z0-9-]{1,80}$/.test(v.slug) ? v.slug : "", from, to };
}
export function overlaps(start: string, end: string, from: string, to: string) {
  return (!from || end >= from) && (!to || start <= to);
}
export function selectionLabel(selection: TravelSelection) {
  const date = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  return selection.from ? `${date(selection.from)}${selection.to && selection.to !== selection.from ? ` – ${date(selection.to)}` : ""}` : "Cualquier fecha";
}

/** Inclusive calendar-day bounds in Spain, including summer time transitions. */
export function madridDayBoundary(day: string, end = false) {
  if (!validDate(day)) return "";
  let target = Date.parse(day + "T00:00:00Z");
  if (end) target += 86400000;
  const format = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  let instant = target;
  for (let i = 0; i < 3; i++) {
    const values = Object.fromEntries(format.formatToParts(new Date(instant)).map(p => [p.type, p.value]));
    const represented = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute), Number(values.second));
    instant = target - (represented - instant);
  }
  return new Date(instant - (end ? 1 : 0)).toISOString();
}
