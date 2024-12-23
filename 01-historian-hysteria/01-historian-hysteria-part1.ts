import { createReadStream } from "fs";
import { dirname, resolve } from "path";
import { createInterface } from "readline";
import { fileURLToPath } from "url";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

const leftArr: number[] = [];
const rightArr: number[] = [];

const stream = createReadStream(
  resolve(__dirname, "./01-historian-hysteria-input.csv")
);
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
