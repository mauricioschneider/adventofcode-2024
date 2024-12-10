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
const word = "xmas";

for (let i = 0; i < matrix.length; i++) {
  const row: string = matrix[i].toLowerCase();

  // brute force approach
  for (let j = 0; j < row.length; j++) {
    if (row[j].toLowerCase() === "x") {
      // check to the right;
      let found: boolean = [...Array(4)].every((_, l) => {
        return row[j + l] === word[l];
      });

      if (found) xmas++;

      // check to the left
      found = [...Array(4)].every((_, l) => {
        return row[j - l] === word[l];
      });

      if (found) xmas++;

      // check up

      found = [...Array(4)].every((_, l) => {
        const row = matrix[i - l];
        if (!row) return false;

        return row[j]?.toLowerCase() === word[l];
      });

      if (found) xmas++;

      // check down

      found = [...Array(4)].every((_, l) => {
        const row = matrix[i + l];
        if (!row) return false;

        return row[j]?.toLowerCase() === word[l];
      });

      if (found) xmas++;

      // diagonal up right

      found = [...Array(4)].every((_, l) => {
        const row = matrix[i - l];
        if (!row) return false;

        return row[j + l]?.toLowerCase() === word[l];
      });

      if (found) xmas++;

      // diagonal up left

      found = [...Array(4)].every((_, l) => {
        const row = matrix[i - l];
        if (!row) return false;

        return row[j - l]?.toLowerCase() === word[l];
      });

      if (found) xmas++;

      // diagonal down right

      found = [...Array(4)].every((_, l) => {
        const row = matrix[i + l];
        if (!row) return false;

        return row[j + l]?.toLowerCase() === word[l];
      });

      if (found) xmas++;

      // diagonal down left

      found = [...Array(4)].every((_, l) => {
        const row = matrix[i + l];
        if (!row) return false;

        return row[j - l]?.toLowerCase() === word[l];
      });

      if (found) xmas++;
    }
  }
}

console.log(xmas);
