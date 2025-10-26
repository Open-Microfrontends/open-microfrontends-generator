import extraValidationTemplateStartersBrowserStandalone from './validation/extraValidationTemplateStartersBrowserStandalone';
import extraValidationTemplateStarters from './validation/extraValidationTemplateStarters';
import extraValidationTemplateHostBackendIntegrationsJavaServlet from './validation/extraValidationTemplateHostBackendIntegrationsJavaServlet';
import type { TemplateConfig } from './types';

const config: Record<string, TemplateConfig> = {
  renderers: {
    templateFileToTargetFiles: {
      'renderers.ejs': 'microfrontendRenderers.ts',
    },
  },
  renderersServerSide: {
    templateFileToTargetFiles: {
      'renderersServerSide.ejs': 'microfrontendRenderersServerSide.ts',
    },
  },
  startersBrowserStandalone: {
    extraValidation: extraValidationTemplateStartersBrowserStandalone,
    templateFileToTargetFiles: {
      'startersBrowserStandalone.ejs': 'microfrontendStarters.ts',
    },
  },
  starters: {
    extraValidation: extraValidationTemplateStarters,
    templateFileToTargetFiles: {
      'starters.ejs': 'microfrontendStarters.ts',
    },
  },
  hostBackendIntegrationsNodeJs: {
    templateFileToTargetFiles: {
      'hostBackendIntegrationsNodeJs.ejs': 'microfrontendHostIntegrations.ts',
    },
  },
  hostBackendIntegrationsJavaServlet: {
    extraValidation: extraValidationTemplateHostBackendIntegrationsJavaServlet,
    templateFileToTargetFiles: {
      'hostBackendIntegrationsJavaServlet.ejs': 'OpenMicrofrontendHostIntegrations.java',
    },
  },
};

export default config;
