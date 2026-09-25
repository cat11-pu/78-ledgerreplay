// replay.js：重放与对账（已入账的跳过并计数，按账户对期望值找第一个差异位置）
export function replay(entries, booked, expected) {
  const done = new Set(booked);
  const posted = [];
  let skipped = 0;
  const totals = {};
  for (const entry of entries) {
    const signed = entry.side === "credit" ? -entry.amount : entry.amount;
    totals[entry.account] = (totals[entry.account] || 0) + signed;
    if (done.has(entry.id)) { skipped += 1; continue; }
    posted.push(entry.id);
  }
  let diffAt = -1;
  const checked = new Set();
  for (let index = 0; index < entries.length; index += 1) {
    const account = entries[index].account;
    if (checked.has(account)) continue;
    checked.add(account);
    const want = Object.prototype.hasOwnProperty.call(expected, account) ? expected[account] : 0;
    if (totals[account] !== want) { diffAt = index; break; }
  }
  if (diffAt === -1) {
    for (const account of Object.keys(expected)) {
      if (!checked.has(account) && expected[account] !== 0) { diffAt = entries.length; break; }
    }
  }
  return { posted: posted, skipped: skipped, diffAt: diffAt, diff_at: diffAt };
}
