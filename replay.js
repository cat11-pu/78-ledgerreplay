// replay.js：重放与对账（已在 booked 的分录跳过并计数；按账户对期望，返回第一个不符账户的位置）
export function replay(entries, booked, expected) {
  const done = new Set(booked);
  const posted = [];
  let skipped = 0;
  const totals = {};
  const firstSeen = {};
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    if (!(entry.account in firstSeen)) firstSeen[entry.account] = index;
    const signed = entry.side === "credit" ? -entry.amount : entry.amount;
    totals[entry.account] = (totals[entry.account] || 0) + signed;
    if (done.has(entry.id)) { skipped += 1; continue; }
    done.add(entry.id);
    posted.push(entry.id);
  }
  let diffAt = -1;
  const accounts = Object.keys(firstSeen).concat(
    Object.keys(expected).filter((account) => !(account in firstSeen)));
  for (const account of accounts) {
    const actual = totals[account] || 0;
    const want = account in expected ? expected[account] : 0;
    if (actual !== want) {
      diffAt = account in firstSeen ? firstSeen[account] : entries.length;
      break;
    }
  }
  return { posted: posted, skipped: skipped, diffAt: diffAt, diff_at: diffAt };
}
