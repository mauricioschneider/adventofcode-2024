import { createReadStream } from "fs";
import { createInterface } from "readline";

const leftArr: number[] = [];
const rightArr: number[] = [];

const stream = createReadStream("./01-historian-hysteria-input.csv");
const readLine = createInterface({
  input: stream,
  crlfDelay: Infinity,
});

readLine.on("line", (line: string) => {
  const lineItems = line.split(",");
  leftArr.push(lineItems[0] as unknown as number);
  rightArr.push(lineItems[1] as unknown as number);
});

readLine.on("close", () => {
  let total: number = 0;

  for (let i = 0; i < leftArr.length; i++) {
    const found = rightArr.filter((num: number) => num === leftArr[i]);

    total += leftArr[i] * found.length;
  }

  console.log(total);
});
