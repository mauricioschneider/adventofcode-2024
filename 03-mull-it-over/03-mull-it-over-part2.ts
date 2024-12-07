import { readFileSync } from "fs";
import { resolveFilePath } from "../utils/fs";
import { fileURLToPath } from "url";

const __filename: string = fileURLToPath(import.meta.url);

const program = readFileSync(resolveFilePath(__filename, "input.txt"), {
  encoding: "utf-8",
});

const instructionsRegex = /(?:mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\))/g;

type Instruction =
  | { type: "mul"; result: number }
  | { type: "do" }
  | { type: "don't" };

function findInstructions(input: string): Instruction[] | undefined {
  const matches = input.match(instructionsRegex);

  return matches?.map((match) => {
    if (match === "do()") {
      return { type: "do" };
    } else if (match === "don't()") {
      return { type: "don't" };
    } else {
      const [x, y] = match.match(/\d+/g)!.map(Number);
      return { type: "mul", result: x * y };
    }
  });
}

const instructions: Instruction[] | undefined = findInstructions(program);

let total: number = 0;
let instructionEnabled = true;

instructions?.forEach((instruction) => {
  switch (instruction.type) {
    case "do":
      instructionEnabled = true;
      break;
    case "don't":
      instructionEnabled = false;
      break;
    case "mul":
      if (instructionEnabled) total += instruction.result;
      break;
  }
});

console.log(total);
