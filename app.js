// app.js：渲染结果
import { balance } from "./entry.js";
import { replay } from "./replay.js";

export function render(spec) {
  const entries = spec.entries || [];
  const booked = spec.booked || [];
  const expected = spec.expected || {};
  const summed = balance(entries);
  const done = replay(entries, booked, expected);
  const again = replay(entries, booked.concat(done.posted), expected);
  return { totals: summed.totals, balanced: summed.balanced, posted: done.posted,
           skipped: done.skipped, diff_at: done.diffAt, idempotent: again.posted.length === 0 };
}
