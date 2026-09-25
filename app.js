// app.js：渲染结果
import { balance } from "./entry.js";
import { replay } from "./replay.js";

export function render(spec) {
  const summed = balance(spec.entries || []);
  const done = replay(spec.entries || [], spec.booked || [], spec.expected || {});
  const again = replay(spec.entries || [], done.posted, spec.expected || {});
  const postedSet = new Set(done.posted);
  return { totals: summed.totals, balanced: summed.balanced, posted: done.posted,
           skipped: done.skipped, diff_at: done.diffAt,
           idempotent: again.posted.every((id) => !postedSet.has(id)) };
}
