import extraValidationTemplateStartersBrowserStandalone from './validation/extraValidationTemplateStartersBrowserStandalone';
import type { TemplateConfig } from './types';

const config: Record<string, TemplateConfig> = {
  renderers: {
    templateFileToTargetFiles: {
      'renderers.ejs': 'microfrontendRenderers.ts'
    }
  },
  startersBrowserStandalone: {
    extraValidation: extraValidationTemplateStartersBrowserStandalone,
    templateFileToTargetFiles: {
      'startersBrowserStandalone.ejs': 'microfrontendStarters.ts'
    }
  },
  startersBrowser: {
    templateFileToTargetFiles: {
      // TODO
    }
  },
  hostBackendIntegrationsNodeJs: {
    templateFileToTargetFiles: {
      // TODO
    }
  },
  hostBackendIntegrationsJava: {
    templateFileToTargetFiles: {
      // TODO
    }
  }
};

export default config;
