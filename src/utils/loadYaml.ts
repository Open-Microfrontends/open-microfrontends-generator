import { readFileSync } from 'fs';
import { resolve, isAbsolute, extname } from 'path';
import { parse } from 'yaml';

export default (path: string) => {
  if (extname(path) !== '.yaml' && extname(path) !== '.yml') {
    throw new Error(`OMG: Invalid file extension for JSON file: ${extname(path)}`);
  }

  const fullPath = isAbsolute(path) ? path : resolve(process.cwd(), path);
  const yamlContent = readFileSync(fullPath).toString('utf-8');
  return parse(yamlContent);
};
