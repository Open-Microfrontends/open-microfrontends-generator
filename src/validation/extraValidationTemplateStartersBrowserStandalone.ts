import type { TemplateExtraValidation } from '../types';

const validation: TemplateExtraValidation = (def) => {
  for (const microfrontend of def.microfrontends) {
    if (microfrontend.apiProxies && Object.keys(microfrontend.apiProxies).length > 0) {
      return 'apiProxies found in spec, which are not supported!';
    }
    if (microfrontend.security && Object.keys(microfrontend.security).length > 0) {
      return 'security found in spec, which are not supported!';
    }
    if (microfrontend.paths.ssrHtml) {
      return 'SSR route (paths.ssrHtml) found in spec, which is not supported!';
    }
  }

  return null;
};

export default validation;
