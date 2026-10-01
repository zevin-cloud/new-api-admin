import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
const base = path.resolve("packages/admin-ui/src/i18n/locales");
const en = JSON.parse(fs.readFileSync(path.join(base, "en.json"), "utf8")).translation;
export const keys = new Set();
const sourceRoots = ["packages/admin-ui/src", "apps/admin/src"];
function collectStrings(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) keys.add(node.text);
  else ts.forEachChild(node, collectStrings);
}
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (!["__tests__", "locales"].includes(item.name)) walk(file);
    } else if (/\.tsx?$/.test(file)) {
      const text = fs.readFileSync(file, "utf8");
      const ast = ts.createSourceFile(
        file,
        text,
        ts.ScriptTarget.Latest,
        true,
        file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
      );
      function visit(node) {
        if (ts.isCallExpression(node) && node.expression.getText(ast) === "t" && node.arguments[0])
          collectStrings(node.arguments[0]);
        if (ts.isStringLiteral(node) && Object.hasOwn(en, node.text)) keys.add(node.text);
        if (
          ts.isJsxAttribute(node) &&
          ["title", "description"].includes(node.name.getText(ast)) &&
          node.initializer &&
          ts.isStringLiteral(node.initializer)
        )
          keys.add(node.initializer.text);
        if (
          ts.isPropertyAssignment(node) &&
          ["label", "title", "message", "description", "entityName"].includes(
            node.name.getText(ast),
          ) &&
          ts.isStringLiteral(node.initializer)
        )
          keys.add(node.initializer.text);
        ts.forEachChild(node, visit);
      }
      visit(ast);
    }
  }
}
for (const root of sourceRoots) walk(root);
for (const key of [
  "Active",
  "Draft",
  "Archived",
  "Low",
  "Medium",
  "High",
  "Created",
  "Updated",
  "Pending",
  "Completed",
  "Workspace",
  "Page examples",
  "Library",
  "Examples",
  "Required",
  "Invalid email address",
  "Enter a JSON object",
  "Must be at least 1",
  "Must be at most 1000",
  "Maximum 80 characters",
  "Maximum 1000 characters",
  "Record not found",
  "Save failed. Your changes are preserved.",
  "This name is already in use",
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
  "sm",
  "lg",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
])
  keys.add(key);
if (process.argv[1].endsWith("scan-i18n.mjs")) {
  const missing = [...keys].filter((key) => !Object.hasOwn(en, key)).sort();
  console.log(JSON.stringify(missing, null, 2));
  console.log("Total used", keys.size, "missing", missing.length);
}
