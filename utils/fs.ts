import { createReadStream } from "fs";
import { resolve, dirname } from "path";
import { createInterface, Interface } from "readline";

export const resolveFilePath = (caller: string, file: string): string => {
  const __dirname = dirname(caller);
  return resolve(__dirname, file);
};

export const createStreamInterface = (filePath: string): Interface => {
  const stream = createReadStream(filePath);
  return createInterface({
    input: stream,
    crlfDelay: Infinity,
  });
};

export const processStream = (
  stream: Interface,
  onLine: (line: string) => void,
  onClose: (result: object) => void
): void => {
  stream.on("line", onLine);
  stream.on("close", onClose);
};
