export const idr = (n: number) => 'Rp' + Math.round(n).toLocaleString('id-ID');
export const pct = (n: number, digits = 2) => n.toFixed(digits).replace('.', ',') + '%';
export const num = (n: number, digits = 0) =>
  n.toLocaleString('id-ID', { minimumFractionDigits: digits, maximumFractionDigits: digits });
