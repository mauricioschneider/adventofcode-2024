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
  leftArr.sort();
  rightArr.sort();

  let i = 0;
  let total = 0;
  while (i < leftArr.length) {
    total += Math.abs(leftArr[i] - rightArr[i]);
    i++;
  }
  console.log(total);
});
