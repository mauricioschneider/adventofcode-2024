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

function isValidUpdate(update: Update, rules: RuleMap): boolean {
  const rulesMet: boolean = update.every((page: number, i: number) => {
    // Set containing all pages of the update prior to the current page
    const updateSubset: Set<number> = new Set(update.slice(0, i));
    const ruleBroken: boolean =
      rules.get(page)?.some((num) => updateSubset.has(num)) ?? false;
    return !ruleBroken;
  });

  return rulesMet;
}

function findValidUpdate(update: Update, rules: RuleMap): Update {
  const validUpdate = [...update];
  // Perform dependency resolution based on how many rules apply to each element of the update array
  // Elements with more dependencies are sorted later in the resulting array
  validUpdate.sort(
    (a, b) =>
      [...(rules.get(b) ?? [])].filter((ruleNum) => update.includes(ruleNum))
        .length -
      [...(rules.get(a) ?? [])].filter((ruleNum) => update.includes(ruleNum))
        .length
  );

  return validUpdate;
}

const invalidUpdates = updates.filter(
  (update: Update) => !isValidUpdate(update, rules)
);
const fixedUpdates = invalidUpdates.map((update: Update) =>
  findValidUpdate(update, rules)
);

const sum: number = fixedUpdates
  .map((rule) => (rule ? rule[Math.floor(rule.length / 2)] : 0))
  .reduce((total: number, el: number) => total + el, 0);

console.log(sum);
