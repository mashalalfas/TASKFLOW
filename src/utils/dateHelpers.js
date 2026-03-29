export function checkStale(lastDate, days = 5) {
  const last = new Date(lastDate);
  const now = new Date();
  const diffMs = now - last;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= days;
}
