export function formatINR(value) {
  return "₹" + value.toLocaleString("en-IN");
}

export function formatCompact(value) {
  if (value >= 100000) return (value / 100000).toFixed(1) + " Lakh";
  return (value / 1000).toFixed(0) + "K";
}