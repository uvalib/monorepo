const friendlyDateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short'
});

export function formatFriendlyTimestamp(timestamp) {
  if (!timestamp) return '—';
  const normalized = typeof timestamp === 'string' ? timestamp.replace(' ', 'T') : timestamp;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }
  return friendlyDateFormatter.format(date);
}

export function formatNumber(value) {
  return typeof value === 'number' ? value.toLocaleString('en-US') : value;
}
