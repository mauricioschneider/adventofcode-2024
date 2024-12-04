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

const inputFile = "./01-historian-hysteria-input.csv";
//const inputFile = "./test.csv";

const stream = createReadStream(resolve(__dirname, inputFile));
const readLine = createInterface({
  input: stream,
  crlfDelay: Infinity,
});

/**
 * Instead of parsing the columns and later doing lengthy iteration on close,
 * the iteraion is only done on the numbers that repeat.
 *
 * First, it keeps two dictionaries, one per column. Each entry contains a number
 * from the respective column as key, and the times it repeats in said colum as value.
 *
 * When a new line is read, it first updates each dictionary with the corresponding numbers,
 * and updates the repeat counter for them.
 *
 * Then, it checks if the number from the left column is in the dictionary for the right colum.
 * If it is, it adds or updates the entry for that number in the numbersInCommon dictionary
 * with the latest repeat counters for that number in each column dictionary.
 *
 * Subsequently, it does the same for the number from the right column. If the number on the right
 * exists on the left, we want to make sure the entry for that number in numbersInCommon
 * contains the latest repeat counters, since we don't know in advance the total number of repeats.
 *
 * On close, it calculates the similarity score multiplying the number by the times of repeats per column.
 */
readLine.on("line", (line: string) => {
  const lineItems = line.split(",");

  const leftNumber = lineItems[0] as unknown as number;
  const rightNumber = lineItems[1] as unknown as number;

  rightArr[rightNumber] = (rightArr[rightNumber] ?? 0) + 1;
  leftArr[leftNumber] = (leftArr[leftNumber] ?? 0) + 1;

  if (rightArr[leftNumber]) {
    numbersInCommon[leftNumber] = {
      repeatLeft: leftArr[leftNumber],
      repeatRight: rightArr[leftNumber],
    };
  }

  if (leftArr[rightNumber]) {
    numbersInCommon[rightNumber] = {
      repeatLeft: leftArr[rightNumber],
      repeatRight: rightArr[rightNumber],
    };
  }
});

readLine.on("close", () => {
  let total: number = 0;

  for (const el in numbersInCommon) {
    total +=
      Number(el) *
      (numbersInCommon[el].repeatLeft ?? 1) *
      (numbersInCommon[el].repeatRight ?? 1);
  }

  console.log(total);
});
