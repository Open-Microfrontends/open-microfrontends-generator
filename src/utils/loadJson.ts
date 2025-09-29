import { resolve, isAbsolute, extname } from 'path';
import { readFileSync } from 'fs';

export default (path: string) => {
  if (extname(path) !== '.json') {
    throw new Error(`OMG: Invalid file extension for JSON file: ${extname(path)}`);
  }

  const fullPath = isAbsolute(path) ? path : resolve(process.cwd(), path);
  const jsonContent = readFileSync(fullPath).toString('utf-8');
  return JSON.parse(jsonContent);
};
