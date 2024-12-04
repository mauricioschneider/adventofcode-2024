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
