import extraValidationTemplateStartersBrowserStandalone from './validation/extraValidationTemplateStartersBrowserStandalone';
import type { TemplateConfig } from './types';

const config: Record<string, TemplateConfig> = {
  renderersPlainJS: {
    templateFileToTargetFiles: {
      'renderer.ejs': 'microfrontendRenderers.ts'
    }
  },
  startersBrowserStandalone: {
    extraValidation: extraValidationTemplateStartersBrowserStandalone,
    templateFileToTargetFiles: {
      'startersBrowserStandalone.ejs': 'microfrontendStarters.ts'
    }
  },
  startersBrowserFull: {
    templateFileToTargetFiles: {
      // TODO
    }
  },
  hostIntegrationsNodeJs: {
    templateFileToTargetFiles: {
      // TODO
    }
  },
  hostIntegrationsJava: {
    templateFileToTargetFiles: {
      // TODO
    }
  }
};

export default config;
