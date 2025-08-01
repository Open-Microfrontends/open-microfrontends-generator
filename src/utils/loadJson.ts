import { resolve, isAbsolute, extname } from 'path';

export default (path: string) => {
  if (extname(path) !== '.json') {
    throw new Error(`OMG: Invalid file extension for JSON file: ${extname(path)}`);
  }

  const fullPath = isAbsolute(path) ? path : resolve(process.cwd(), path);
  return require(fullPath);
};
