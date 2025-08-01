import extraValidationTemplateStartersBrowserStandalone from './validation/extraValidationTemplateStartersBrowserStandalone';
import extraValidationTemplateMashroomPluginConfig from './validation/extraValidationTemplateMashroomPluginConfig';
import type { TemplateConfig } from './types';

const config: Record<string, TemplateConfig> = {
  renderersPlainJS: {
    templateFileToTargetFiles: {
      'renderersPlainJS.ejs': 'microfrontendRenderers.ts'
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
  hostIntegrationsExpress: {
    templateFileToTargetFiles: {
      // TODO
    }
  },
  hostIntegrationsSpringBoot: {
    templateFileToTargetFiles: {
      // TODO
    }
  },
  startersMashroom: {
    templateFileToTargetFiles: {
      'startersMashroom.ejs': 'microfrontendStarters.ts'
    }
  },
  mashroomPluginConfig: {
    extraValidation: extraValidationTemplateMashroomPluginConfig,
    templateFileToTargetFiles: {
      'mashroomPluginConfig.ejs': 'mashroom.json'
    }
  }
};

export default config;
