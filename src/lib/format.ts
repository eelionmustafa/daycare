const dateFmt = new Intl.DateTimeFormat("sq-AL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFmt = new Intl.DateTimeFormat("sq-AL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const weekdayFmt = new Intl.DateTimeFormat("sq-AL", { weekday: "long" });

export function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return dateFmt.format(new Date(d));
}

export function formatShortDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return shortDateFmt.format(new Date(d));
}

export function formatWeekday(d: Date | string) {
  const s = weekdayFmt.format(new Date(d));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatMoney(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("sq-AL", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function ageFromBirthday(birthday: Date | string | null | undefined) {
  if (!birthday) return null;
  const b = new Date(birthday);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

/** Date-only value pinned to UTC midnight so SQLite comparisons stay stable. */
export function dateOnly(d: Date | string) {
  const x = new Date(d);
  return new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate()));
}

export function todayUTC() {
  return dateOnly(new Date());
}

/** Days between a past date and now (fractional). Used for staleness checks. */
export function daysSince(d: Date | string) {
  return (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24);
}
