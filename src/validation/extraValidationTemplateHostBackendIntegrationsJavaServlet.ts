import colors from 'colors';
import type { TemplateExtraValidation } from '../types';

const validation: TemplateExtraValidation = (def) => {
  for (const microfrontend of def.microfrontends) {
    if (microfrontend.ssr) {
      colors.yellow(
        `OMG: Microfrontend '${microfrontend.name}' has an SSR route defined: This is not yet supported by this template!`
      );
    }
  }

  return null;
};

export default validation;
