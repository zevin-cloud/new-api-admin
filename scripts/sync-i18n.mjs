import fs from "node:fs/promises";
import path from "node:path";
import { keys } from "./scan-i18n.mjs";
const locales = ["en", "zh", "zh-TW", "fr", "ja", "ru", "vi"];
const base = path.resolve("packages/admin-ui/src/i18n/locales");
const ignored = new Set([
  "",
  "0",
  "0.3",
  "0.5",
  "0.75",
  "1.0",
  "404",
  "readonly",
  "size-8 rounded-lg sm:size-9 [&>svg]:size-4",
  "Français",
  "Tiếng Việt",
  "Русский",
  "日本語",
  "简体中文",
  "繁體中文",
]);
for (const key of ignored) keys.delete(key);
const resources = await Promise.all(
  locales.map(async (locale) => [
    locale,
    JSON.parse(await fs.readFile(path.join(base, locale + ".json"), "utf8")).translation,
  ]),
);
const missing = [];
for (const [locale, resource] of resources) {
  for (const key of keys) if (!resource[key]) missing.push(`${locale}: ${key}`);
}
if (missing.length) {
  console.error(missing.join("\n"));
  process.exit(1);
}
for (const [locale, resource] of resources) {
  const translation = Object.fromEntries(
    [...keys].sort((a, b) => a.localeCompare(b)).map((key) => [key, resource[key]]),
  );
  await fs.writeFile(
    path.join(base, locale + ".json"),
    JSON.stringify({ translation }, null, 2) + "\n",
  );
}
console.log(`Verified and synchronized ${keys.size} keys across ${locales.length} languages.`);
