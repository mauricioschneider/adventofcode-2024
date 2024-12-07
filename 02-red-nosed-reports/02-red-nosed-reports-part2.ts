import { Interface } from "readline";
import {
  resolveFilePath,
  createStreamInterface,
  processStream,
} from "../utils/fs";
import { fileURLToPath } from "url";

const __filename: string = fileURLToPath(import.meta.url);
const filePath: string = resolveFilePath(__filename, "input.txt");
//const filePath: string = resolveFilePath(__filename, "test-input2.txt");

type Direction = "none" | "increasing" | "decreasing";
let safeReports: number = 0;

function checkIfValid(levels: string[]): boolean {
  let direction: Direction = "none";

  if (levels.length === 1) return true;

  for (let index = 1; index < levels.length; index++) {
    const val: number = Number(levels[index]);
    const prev: number = Number(levels[index - 1]);
    const diff: number = Math.abs(val - prev);

    if (diff < 1 || diff > 3) {
      //console.log(`number diff not within range: ${levels}`);
      return false;
    }

    if (direction === "none") {
      direction = val > prev ? "increasing" : "decreasing";
      continue;
    }

    if (direction === "decreasing" && val > prev) {
      //console.log(`wrong direction: ${direction} - ${levels}`);
      return false;
    }
    if (direction === "increasing" && val < prev) {
      //console.log(`wrong direction: ${direction} - ${levels}`);
      return false;
    }
  }

  return true;
}

const onLine = (line: string) => {
  const levels: string[] = line.split(" ");

  if (checkIfValid(levels)) {
    safeReports++;
  } else {
    // try all combinations one at a time, and see if it meets requirements
    for (let i = 0; i < levels.length; i++) {
      const combination: string[] = [
        ...levels.slice(0, i),
        ...levels.slice(i + 1),
      ];

      if (checkIfValid(combination)) {
        safeReports++;
        break;
      }
    }
  }
};

const onClose = () => {
  console.log(safeReports);
};

const stream: Interface = createStreamInterface(filePath);
processStream(stream, onLine, onClose);
