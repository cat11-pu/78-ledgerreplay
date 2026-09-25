// entry.js：分录与余额（基线：只累加借方、不检查平衡）
export function balance(entries) {
  const totals = {};
  for (const entry of entries) totals[entry.account] = (totals[entry.account] || 0) + entry.amount;
  return { totals: totals, balanced: true };
}
