import { Interface } from "readline";
import {
  resolveFilePath,
  createStreamInterface,
  processStream,
} from "../utils/fs";
import { fileURLToPath } from "url";

const __filename: string = fileURLToPath(import.meta.url);
const filePath: string = resolveFilePath(__filename, "input.txt");
//const filePath: string = resolveFilePath(__filename, "test-input.txt");

type Direction = "none" | "increasing" | "decreasing";
let safeReports: number = 0;

const onLine = (line: string) => {
  const levels: string[] = line.split(" ");
  let direction: Direction = "none";

  for (let index = 1; index < levels.length; index++) {
    const val: number = Number(levels[index]);
    const prev: number = Number(levels[index - 1]);
    const diff: number = Math.abs(val - prev);

    if (diff < 1 || diff > 3) break;

    if (direction === "none") {
      direction = val > prev ? "increasing" : "decreasing";
      continue;
    }

    if (direction === "decreasing" && val > prev) break;
    if (direction === "increasing" && val < prev) break;

    if (index === levels.length - 1) {
      // reached the end, mark level as safe
      //console.log(`Adding ${levels} to safe`);
      safeReports++;
    }
  }
};

const onClose = () => {
  console.log(safeReports);
};

const stream: Interface = createStreamInterface(filePath);
processStream(stream, onLine, onClose);
