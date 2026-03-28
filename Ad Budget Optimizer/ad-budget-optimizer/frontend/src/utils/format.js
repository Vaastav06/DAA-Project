/** Format K-units (1 unit = ₹1,000) → ₹50K / ₹1.5L / ₹10Cr */
export function fmtINR(k) {
  if (!k && k !== 0) return '₹0';
  const r = k * 1000;
  if (r >= 10_000_000) return `₹${(r / 10_000_000).toFixed(1)}Cr`;
  if (r >= 100_000)    return `₹${r % 100_000 === 0 ? r / 100_000 : (r / 100_000).toFixed(1)}L`;
  return `₹${r % 1_000 === 0 ? r / 1_000 : (r / 1_000).toFixed(0)}K`;
}

/** Format engagement numbers: 12500 → 12.5K */
export function fmtEng(n) {
  if (n >= 100_000) return `${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000)   return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
