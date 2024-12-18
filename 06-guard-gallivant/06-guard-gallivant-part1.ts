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

// These need to be clockwise, so that turnRight works as intended
enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

type Position = {
  row: number;
  col: number;
};

type State = {
  position: Position;
  direction: Direction;
};

type DirectionVector = {
  row: number;
  col: number;
};

const DIRECTION_VECTORS: Record<Direction, DirectionVector> = {
  [Direction.UP]: { row: -1, col: 0 },
  [Direction.RIGHT]: { row: 0, col: 1 },
  [Direction.DOWN]: { row: 1, col: 0 },
  [Direction.LEFT]: { row: 0, col: -1 },
};

function turnRight(direction: Direction): Direction {
  return (direction + 1) % 4;
}

function isValidPosition(position: Position, matrix: string[][]): boolean {
  return (
    position.row >= 0 &&
    position.row < matrix.length &&
    position.col >= 0 &&
    position.col < matrix[0].length
  );
}

function getNextPosition(current: Position, direction: Direction): Position {
  const vector = DIRECTION_VECTORS[direction];
  return {
    row: current.row + vector.row,
    col: current.col + vector.col,
  };
}

function getStartingPosition(matrix: string[][], char: string): Position {
  const row = matrix.findIndex((row) => row.includes(char));
  const col = matrix[row].findIndex((col) => col === char);
  return { row, col };
}

function getVisitedPositions(
  matrix: string[][],
  startPosition: Position
): Set<string> {
  const currentState: State = {
    position: startPosition,
    direction: Direction.UP,
  };
  const visitedPositions = new Set<string>();

  while (isValidPosition(currentState.position, matrix)) {
    visitedPositions.add(
      `row: ${currentState.position.row} - col: ${currentState.position.col}`
    );

    const nextPosition = getNextPosition(
      currentState.position,
      currentState.direction
    );

    if (!isValidPosition(nextPosition, matrix)) {
      break;
    }

    if (matrix[nextPosition.row][nextPosition.col] === "#") {
      currentState.direction = turnRight(currentState.direction);
    } else {
      currentState.position = nextPosition;
    }
  }

  return visitedPositions;
}

const startPosition = getStartingPosition(matrix, GUARD_SYMBOL);

console.log(getVisitedPositions(matrix, startPosition).size);
