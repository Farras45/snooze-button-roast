import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Snooze Button Roast — one line roasting the alarm clock itself:
// it goes off at 6 AM on a Saturday like a smoke detector at a
// barbecue, loud and useless and dead certain the house is on fire.
const ENTRY =
  "Saturday, 6 AM: my alarm clock goes off like a smoke detector at a barbecue — loud, useless, and absolutely certain the house is on fire.";

const GATE = { minChars: 1, maxChars: 200 } as const;

function validateEntry(text: string): void {
  if (text.length < GATE.minChars || text.length > GATE.maxChars) {
    throw new Error(
      `entry is ${text.length} chars, gate allows ${GATE.minChars}-${GATE.maxChars}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be exactly one line");
  }
  // The em dash is a single UTF-8 char; the gate counts characters,
  // so confirm the byte length is sane rather than equal to the count.
  if (Buffer.byteLength(text, "utf8") < text.length) {
    throw new Error("entry is not valid UTF-8 text");
  }
}

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv !== undefined && fromEnv !== "" ? fromEnv : "/output";
}

function main(): void {
  validateEntry(ENTRY);
  const dir = resolveOutputDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  // No trailing newline: the file's character count is exactly the
  // line's character count, as the gate measures it.
  writeFileSync(target, ENTRY, "utf8");
  console.log(`wrote ${ENTRY.length} chars to ${target}`);
}

main();
