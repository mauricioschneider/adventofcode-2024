import { readFileSync } from "fs";
import { resolveFilePath } from "../utils/fs";
import { fileURLToPath } from "url";

const __filename: string = fileURLToPath(import.meta.url);

const INPUT_FILE = "input.txt";
//const INPUT_FILE = "test.txt";

const [rulesRaw, updatesRaw]: [string, string] = readFileSync(
  resolveFilePath(__filename, INPUT_FILE),
  {
    encoding: "utf-8",
  }
).split(/\n\n/) as [string, string];

type RuleMap = Map<number, number[]>;
type Update = number[];

const rules: RuleMap = new Map();

rulesRaw.split(/\n/).forEach((rule) => {
  const [key, val] = rule.split("|").map(Number);

  if (rules.has(key)) {
    rules.get(key)?.push(val);
  } else {
    rules.set(key, [val]);
  }
});

const updates: Update[] = updatesRaw.split(/\n/).map((val) => {
  return val.split(",").map(Number);
});

const ordered: Update[] = [];

updates.forEach((update) => {
  const rulesMet: boolean = update.every((page: number, i: number) => {
    // Set containing all pages of the update prior to the current page
    const updateSubset: Set<number> = new Set(update.slice(0, i));
    const ruleBroken: boolean =
      rules.get(page)?.some((num) => updateSubset.has(num)) ?? false;
    return !ruleBroken;
  });

  if (rulesMet) ordered.push(update);
});

const sum: number = ordered
  .map((rule) => rule[Math.floor(rule.length / 2)])
  .reduce((total: number, el: number) => total + el, 0);

console.log(sum);
