import { resolve } from 'path';

export const getTemplateFolder = () => {
  if (import.meta.filename.endsWith('/omg.js')) {
    return resolve(import.meta.dirname, '..', 'templates');
  }
  return resolve(import.meta.dirname, '..', '..', 'templates');
};
