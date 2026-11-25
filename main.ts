// Worst Fix Ever: Funniest Commit Message
// Writes a single original commit-message line to /output/entry.txt.
//
// Revision 2: the write is now split into explicit steps — build the entry,
// validate it against the gate (UTF-8, 1-100 chars, not only whitespace),
// then write it. Validation runs before any file is touched, so a bad
// entry can never produce a stale or invalid output file.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function buildEntry(): string {
  return "fix: replaced the bug with a faster bug that now ships to customers first";
}

function validateEntry(entry: string): void {
  if (entry.length < 1 || entry.length > 100) {
    throw new Error(`entry must be 1-100 characters, got ${entry.length}`);
  }
  if (entry.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  // Round-trip through UTF-8 to prove the text is valid UTF-8.
  const roundTripped = Buffer.from(entry, "utf8").toString("utf8");
  if (roundTripped !== entry) {
    throw new Error("entry is not valid UTF-8 text");
  }
}

function writeEntry(entry: string): void {
  validateEntry(entry);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, entry, "utf8");
}

writeEntry(buildEntry());
