// replay.js：重放与对账（基线：全部重放、不判重复）
export function replay(entries, booked, expected) {
  return { posted: entries.map((entry) => entry.id), skipped: 0, diffAt: -1 };
}
