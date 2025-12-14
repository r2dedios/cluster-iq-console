import { parseISO, format } from 'date-fns';

export function parseScanTimestamp(ts: string | undefined) {
  if (!ts) return 'N/A';
  return format(parseISO(ts), 'HH:mm:ss - dd/MM/yyyy');
}

export function parseNumberToCurrency(value: number | undefined) {
  if (value === undefined || value === null) return '$0.00';
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}
