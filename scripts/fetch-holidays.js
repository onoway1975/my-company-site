/**
 * 内閣府の祝日CSVを取得し、holidays.json として保存するスクリプト
 * Usage: node scripts/fetch-holidays.js
 */

const https = require("https");
const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");

const CSV_URL =
  "https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv";
const OUTPUT_PATH = path.resolve(
  __dirname,
  "../app/schedule/holidays.json"
);

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function main() {
  console.log("Fetching holidays CSV from Cabinet Office...");
  const buf = await fetch(CSV_URL);

  // CSV is Shift-JIS encoded
  const text = iconv.decode(buf, "Shift_JIS");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());

  // Skip header: "国民の祝日・休日月日,国民の祝日・休日名称"
  const holidays = [];
  for (let i = 1; i < lines.length; i++) {
    const [dateStr, name] = lines[i].split(",");
    if (!dateStr || !name) continue;

    // dateStr is like "2024/1/1" → convert to "2024-01-01"
    const parts = dateStr.trim().split("/");
    if (parts.length !== 3) continue;
    const yyyy = parts[0];
    const mm = parts[1].padStart(2, "0");
    const dd = parts[2].padStart(2, "0");
    holidays.push({ date: `${yyyy}-${mm}-${dd}`, name: name.trim() });
  }

  const output = { holidays };
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");
  console.log(`Wrote ${holidays.length} holidays to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Failed to fetch holidays:", err);
  process.exit(1);
});
