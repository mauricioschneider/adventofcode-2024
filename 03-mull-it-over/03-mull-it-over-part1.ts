import { readFileSync } from "fs";
import { resolveFilePath } from "../utils/fs";
import { fileURLToPath } from "url";

const __filename: string = fileURLToPath(import.meta.url);

const program = readFileSync(resolveFilePath(__filename, "input.txt"), {
  encoding: "utf-8",
});

const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;

type Multiplication = {
  x: number;
  y: number;
  result: number;
};

function findMultiplications(input: string): Multiplication[] {
  const matches = Array.from(input.matchAll(mulRegex));
  return matches.map((match) => ({
    x: parseInt(match[1]),
    y: parseInt(match[2]),
    result: parseInt(match[1]) * parseInt(match[2]),
  }));
}

const multiplications: Multiplication[] = findMultiplications(program);
const total = multiplications.reduce((total, current) => {
  return (total += current.result);
}, 0);

console.log(total);
