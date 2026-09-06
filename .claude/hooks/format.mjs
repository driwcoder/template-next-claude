// PostToolUse hook: format/organize-imports on the file Claude just wrote.
// Non-blocking — never fails an edit if Biome hiccups.
import { execFileSync } from "node:child_process";

let raw = "";
process.stdin.on("data", (chunk) => {
  raw += chunk;
});
process.stdin.on("end", () => {
  try {
    const { tool_input } = JSON.parse(raw || "{}");
    const file = tool_input?.file_path;
    if (!file || !/\.(tsx?|jsx?|jsonc?|css)$/.test(file)) process.exit(0);
    execFileSync("pnpm", ["exec", "biome", "check", "--write", "--no-errors-on-unmatched", file], {
      stdio: "ignore",
      shell: process.platform === "win32",
    });
  } catch {
    // swallow: formatting is best-effort here
  }
  process.exit(0);
});
