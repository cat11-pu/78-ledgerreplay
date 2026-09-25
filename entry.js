// entry.js：分录与余额（借方加、贷方减；借贷之和不为零则报 E_UNBALANCED）
export function balance(entries) {
  const totals = {};
  let sum = 0;
  for (const entry of entries) {
    const signed = entry.side === "credit" ? -entry.amount : entry.amount;
    totals[entry.account] = (totals[entry.account] || 0) + signed;
    sum += signed;
  }
  const sorted = {};
  for (const account of Object.keys(totals).sort()) sorted[account] = totals[account];
  if (sum !== 0) return { totals: sorted, balanced: false, code: "E_UNBALANCED" };
  return { totals: sorted, balanced: true };
}
