import { readFileSync } from "fs";
import { resolveFilePath } from "../utils/fs";
import { fileURLToPath } from "url";

const __filename: string = fileURLToPath(import.meta.url);

const INPUT_FILE = "input.txt";
//const INPUT_FILE = "test.txt";

const matrix = readFileSync(resolveFilePath(__filename, INPUT_FILE), {
  encoding: "utf-8",
}).split(/\n/);

let xmas: number = 0;

for (let i = 1; i < matrix.length - 1; i++) {
  const row: string = matrix[i].toLowerCase();

  // brute force approach
  for (let j = 1; j < row.length - 1; j++) {
    if (row[j].toLowerCase() === "a") {
      const firstDiag: string =
        matrix[i - 1][j - 1].toLowerCase() + matrix[i + 1][j + 1].toLowerCase();
      const secondDiag: string =
        matrix[i + 1][j - 1].toLowerCase() + matrix[i - 1][j + 1].toLowerCase();

      if (/ms|sm/.test(firstDiag) && /ms|sm/.test(secondDiag)) xmas++;
    }
  }
}

console.log(xmas);
