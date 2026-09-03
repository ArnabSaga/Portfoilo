export function formatProjectDate(value: string) {
  if (/^\d{4}$/.test(value)) return value;

  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value);
  if (!match) return value;

  const [, year, month] = match;
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${year}-${month}-01T00:00:00Z`));
}
