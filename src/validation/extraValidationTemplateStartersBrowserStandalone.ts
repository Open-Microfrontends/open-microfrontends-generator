import colors from 'colors';
import type { TemplateExtraValidation } from '../types';

const validation: TemplateExtraValidation = (def) => {
  for (const microfrontend of def.microfrontends) {
    if (microfrontend.assets.js.moduleSystem === 'ESM') {
      if (microfrontend.assets.js.importMap) {
        return 'ImportMaps for moduleSystem ESM found the declaration, which is not supported. See: https://open-microfrontends.org/implementation-hints/microfrontends';
      }
      console.warn(
        colors.yellow(
          `OMG: Microfrontend '${microfrontend.name}' uses ES modules (ESM). If you use code splitting, make sure your index module only contains the renderer function and nothing more, because importing the index module from other modules will not be possible. See: https://open-microfrontends.org/implementation-hints/microfrontends`
        )
      );
    }

    if (microfrontend.apiProxies && Object.keys(microfrontend.apiProxies).length > 0) {
      return 'apiProxies found in the declaration, which are not supported!';
    }
    if (microfrontend.ssr?.path) {
      return 'SSR route (ssr.path) found the declaration, which is not supported!';
    }

    if (microfrontend.assets.js.moduleSystem === 'SystemJS') {
      console.warn(
        colors.yellow(
          `OMG: Microfrontend '${microfrontend.name}' uses SystemJS, make sure the Application Host provides the SystemJS loader!`
        )
      );
    }
  }

  return null;
};

export default validation;
