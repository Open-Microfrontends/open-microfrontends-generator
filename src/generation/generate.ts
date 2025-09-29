import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import ejs from 'ejs';
import prettify from './prettify';
import { getTemplateFolder } from './getTemplateFolder';
import type { GeneratorModel } from '../types';

export default async (model: GeneratorModel, ejsTemplate: string, targetFile: string): Promise<string> => {
  if (!ejsTemplate.endsWith('.ejs')) {
    ejsTemplate += '.ejs';
  }

  const templateFolder = getTemplateFolder();
  const templateContent = await readFile(resolve(templateFolder, ejsTemplate), 'utf-8');
  const sourceCode = ejs.render(templateContent, model, {
    includer: (path) => ({
      filename: resolve(templateFolder, `${path}.ejs`)
    })
  });

  if (!targetFile.endsWith('.js') && !targetFile.endsWith('.ts')) {
    return sourceCode;
  }

  return prettify(sourceCode, dirname(targetFile));
};
