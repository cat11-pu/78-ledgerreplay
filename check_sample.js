import fs from "node:fs";
import { balance } from "./entry.js";
import { replay } from "./replay.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/ledger.json", "utf8"));
const summed = balance(spec.entries || []);
const done = replay(spec.entries || [], spec.booked || [], spec.expected || {});
const view = render(spec);

emit("各账户余额 =", JSON.stringify(summed.totals));
emit("借贷是否平衡 =", summed.balanced);
emit("入账的分录 =", JSON.stringify(done.posted));
emit("重复跳过的分录 =", done.skipped);
emit("差异位置 =", done.diff_at);
emit("账期 =", spec.period);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  const bad = balance([{ id: "e0", account: "cash", amount: 10, side: "debit" },
                       { id: "e1", account: "bank", amount: 4, side: "credit" }]);
  emit("借贷不平的错误码", bad.balanced ? "no-error" : (bad.code || "E_UNBALANCED"));
} catch (error) {
  emit("借贷不平的错误码", error.code || error.message);
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "各账户余额": {
    "bank": -6,
    "cash": 10,
    "fee": -4
  },
  "借贷是否平衡": true,
  "入账的分录": [
    "e0",
    "e2"
  ],
  "重复跳过的分录": 1,
  "差异位置": -1,
  "账期": "2026-09"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
