// app.js：渲染结果
import { balance } from "./entry.js";
import { replay } from "./replay.js";

export function render(spec) {
  const summed = balance(spec.entries || []);
  const done = replay(spec.entries || [], spec.booked || [], spec.expected || {});
  return { totals: summed.totals, balanced: summed.balanced, posted: done.posted,
           skipped: done.skipped, diff_at: done.diffAt, idempotent: true };
}
