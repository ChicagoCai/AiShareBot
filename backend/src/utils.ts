export function dateOnly(d: Date) {
  const s = d.toISOString().slice(0,10);
  return new Date(s);
}