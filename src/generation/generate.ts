import { readFile } from 'fs/promises';
import { resolve } from 'path';
import ejs from 'ejs';
import prettify from './prettify';
import type { GeneratorModel } from '../types';

export default async (model: GeneratorModel, ejsTemplate: string, targetDir: string): Promise<string> => {
  if (!ejsTemplate.endsWith('.ejs')) {
    ejsTemplate += '.ejs';
  }
  const templateContent = await readFile(resolve(import.meta.dirname, '..', '..', 'templates', ejsTemplate), 'utf-8');
  const sourceCode = ejs.render(templateContent, model, {
    includer: (path) => ({
      filename: resolve(import.meta.dirname, '..', '..', 'templates', `${path}.ejs`)
    })
  });

  return prettify(sourceCode, targetDir);
};
