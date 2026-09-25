import assert from "node:assert";
import { balance } from "../entry.js";
import { replay } from "../replay.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

const entries = [{ id: "e0", account: "cash", amount: 10, side: "debit" }];

check("balance returns totals", () => {
  assert.strictEqual(typeof balance(entries).totals, "object");
});

check("balance reports balanced flag", () => {
  assert.strictEqual(typeof balance(entries).balanced, "boolean");
});

check("replay reports posted", () => {
  assert.ok(Array.isArray(replay(entries, [], {}).posted));
});

check("replay reports diff_at", () => {
  assert.strictEqual(typeof replay(entries, [], {}).diffAt, "number");
});

check("render exposes idempotent flag", () => {
  assert.strictEqual(typeof render({ entries: entries, booked: [], expected: {} }).idempotent, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
