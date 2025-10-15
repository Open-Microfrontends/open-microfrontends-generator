import type { TemplateExtraValidation } from '../types';

const validation: TemplateExtraValidation = (def) => {
  for (const microfrontend of def.microfrontends) {
    if (microfrontend.assets.js.moduleSystem === 'ESM' && microfrontend.assets.js.importMap) {
      return 'ImportMaps for moduleSystem ESM found the declaration, which is not supported!';
    }
  }

  return null;
};

export default validation;
