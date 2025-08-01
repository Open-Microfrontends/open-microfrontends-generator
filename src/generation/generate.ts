import {readFile} from 'fs/promises';
import {resolve} from 'path';
import ejs from 'ejs';
import type {GeneratorModel} from '../types';

export default async (model: GeneratorModel, ejsTemplate: string): Promise<string> => {
    if (!ejsTemplate.endsWith('.ejs')) {
        ejsTemplate += '.ejs';
    }
    const templateContent = await readFile(resolve(__dirname, '..', '..', 'templates', ejsTemplate), 'utf-8');
    return ejs.render(templateContent, model, {
        includer: (path) => ({
          filename: resolve(__dirname, '..', '..', 'templates', `${path  }.ejs`),
        }),
    });
};
