// entry.js：分录与余额（借方加、贷方减；全部借贷之和不为零时报 E_UNBALANCED；totals 按键名排序输出）
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
  if (sum !== 0) {
    return { totals: sorted, balanced: false, code: "E_UNBALANCED" };
  }
  return { totals: sorted, balanced: true };
}
