import { mkdir, cp, readdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
const root = path.resolve(import.meta.dirname, "..");
const pkg = path.join(root, "packages/admin-ui");
await mkdir(path.join(pkg, "dist/files"), { recursive: true });
const proc = spawnSync(
  "bun",
  [
    "x",
    "--no-install",
    "@tailwindcss/cli",
    "-i",
    path.join(pkg, "src/styles/index.css"),
    "-o",
    path.join(pkg, "dist/styles.css"),
    "--minify",
  ],
  { cwd: root, stdio: "inherit" },
);
if (proc.status) process.exit(proc.status);
for (const family of ["public-sans", "lora"]) {
  const files = path.join(root, "node_modules/@fontsource-variable", family, "files");
  for (const name of await readdir(files))
    await cp(path.join(files, name), path.join(pkg, "dist/files", name));
}
