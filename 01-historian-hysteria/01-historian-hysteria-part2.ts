import { createReadStream } from "fs";
import { resolve, dirname } from "path";
import { createInterface } from "readline";
import { fileURLToPath } from "url";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

type ColumnDict = Record<number, number>;
type RepeatDict = Record<
  number,
  {
    repeatLeft: number;
    repeatRight: number;
  }
>;

const leftArr: ColumnDict = {};
const rightArr: ColumnDict = {};
const numbersInCommon: RepeatDict = {};
let total: number = 0;

const inputFile = "./01-historian-hysteria-input.csv";
//const inputFile = "./test.csv";

// Why not readFileSync you ask?
// Because that wouldn't be as cool, would it?
const stream = createReadStream(resolve(__dirname, inputFile));
const readLine = createInterface({
  input: stream,
  crlfDelay: Infinity,
});

const getNumTotal = (num: number, list: RepeatDict): number => {
  const entry = list[num];
  if (!entry) return 0;
  return num * (entry.repeatLeft ?? 1) * (entry.repeatRight ?? 1);
};

/**
 * On each line, check if left and right column numbers are present in the opposite
 * list of numbers read from the stream so far.
 *
 * If they are present:
 * 1. calculate pre-update entry total, deduct it from total
 * 2. add or update the entry in the numbersInCommon dictionary.
 * 3. calculate post-update entry total, add it to total
 *
 * In this way, we avoid iterating twice, one per event.
 * Keeping the total on the fly also helps avoiding nested iteration on close to find,
 * either explicitly with a for loop, or using Array.filter
 *
 * Time complexity is O(n)
 */
readLine.on("line", (line: string) => {
  const lineItems = line.split(",");

  const leftNumber = lineItems[0] as unknown as number;
  const rightNumber = lineItems[1] as unknown as number;

  rightArr[rightNumber] = (rightArr[rightNumber] ?? 0) + 1;
  leftArr[leftNumber] = (leftArr[leftNumber] ?? 0) + 1;

  const updateNumbersInCommon = (num: number) => {
    total = total - getNumTotal(num, numbersInCommon);
    numbersInCommon[num] = {
      repeatLeft: leftArr[num],
      repeatRight: rightArr[num],
    };
    total = total + getNumTotal(num, numbersInCommon);
  };

  if (rightArr[leftNumber]) {
    updateNumbersInCommon(leftNumber);
  }

  if (leftArr[rightNumber]) {
    updateNumbersInCommon(rightNumber);
  }
});

readLine.on("close", () => {
  console.log(total);
});
