import {readFile} from 'fs/promises';
import {resolve} from 'path';
import ejs from 'ejs';
import type {KNOWN_TEMPLATES} from './constants';
import type {GeneratorModel} from './types';

export default async (model: GeneratorModel, template: keyof typeof KNOWN_TEMPLATES): Promise<string> => {
    if (!template.endsWith('.ejs')) {
        template += '.ejs';
    }
    const templateContent = await readFile(resolve(__dirname, '..', 'templates', template), 'utf-8');
    return ejs.render(templateContent, model, {
        includer: (path) => ({
          filename: resolve(__dirname, '..', 'templates', `${path  }.ejs`),
        }),
    });
};
