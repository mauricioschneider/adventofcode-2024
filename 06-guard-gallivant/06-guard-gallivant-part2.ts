import { readFileSync } from "fs";
import { resolveFilePath } from "../utils/fs";
import { fileURLToPath } from "url";

const __filename: string = fileURLToPath(import.meta.url);

const INPUT_FILE = "input.txt";
//const INPUT_FILE = "test.txt";

const matrix = readFileSync(resolveFilePath(__filename, INPUT_FILE), {
  encoding: "utf-8",
})
  .split("\n")
  .map((s) => Array.from(s));

const GUARD_SYMBOL = "^";

// I had to optimize data structures and functions
// So that this script doesn't take forever to run on a big array
// compared to part 1

// Use a more efficient direction representation
const DIRECTIONS = [
  [-1, 0], // UP
  [0, 1], // RIGHT
  [1, 0], // DOWN
  [0, -1], // LEFT
] as const;

// Use a more compact position representation
type Pos = [number, number];
type State = [number, number, number]; // row, col, direction

// Cache matrix dimensions
const ROWS = matrix.length;
const COLS = matrix[0].length;

// Optimize position validation
const isValid = (row: number, col: number): boolean =>
  row >= 0 && row < ROWS && col >= 0 && col < COLS;

// Optimize state comparison using string key
const getStateKey = (state: State): string =>
  `${state[0]},${state[1]},${state[2]}`;

// Find starting position more efficiently
const getStart = (): Pos => {
  for (let i = 0; i < ROWS; i++) {
    const col = matrix[i].indexOf(GUARD_SYMBOL);
    if (col !== -1) return [i, col];
  }
  throw new Error("Start position not found");
};

// Optimize loop detection
const isLoop = (matrix: string[][], [startRow, startCol]: Pos): boolean => {
  let state: State = [startRow, startCol, 0];
  const visited = new Set<string>();

  while (true) {
    const stateKey = getStateKey(state);
    if (visited.has(stateKey)) return true;
    visited.add(stateKey);

    const [row, col, dir] = state;
    const [dRow, dCol] = DIRECTIONS[dir];
    const newRow = row + dRow;
    const newCol = col + dCol;

    if (!isValid(newRow, newCol)) return false;

    if (matrix[newRow][newCol] === "#") {
      state = [row, col, (dir + 1) % 4];
    } else {
      state = [newRow, newCol, dir];
    }
  }
};

// Optimize total loop calculation
const getTotalPossibleLoops = (matrix: string[][], start: Pos): number => {
  let loops = 0;
  const matrixCopy = matrix.map((row) => [...row]);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (matrix[row][col] === ".") {
        matrixCopy[row][col] = "#";
        if (isLoop(matrixCopy, start)) loops++;
        matrixCopy[row][col] = ".";
      }
    }
  }
  return loops;
};

// 1753
const start = getStart();
console.log(getTotalPossibleLoops(matrix, start));
