import extraValidationTemplateStartersBrowserStandalone from '../../src/validation/extraValidationTemplateStartersBrowserStandalone';
import type { OpenMicroFrontendsDef } from '../../src/types';

describe('extraValidationTemplateStartersBrowserStandalone', () => {
  it('fails if the definition contains security', async () => {
    const def: OpenMicroFrontendsDef = {
      openMicrofrontends: '1.0.0',
      microfrontends: [
        {
          name: 'Microfrontend 1',
          paths: {
            resourcesBase: '/'
          },
          resources: {
            js: ['index.js']
          },
          globalLaunchFunction: 'start',
          security: [
            {
              basic: []
            }
          ]
        }
      ]
    };

    const errors = extraValidationTemplateStartersBrowserStandalone(def);

    expect(errors).toBe('security found in definition, which are not supported!');
  });

  it('fails if the definition contains API proxies', async () => {
    const def: OpenMicroFrontendsDef = {
      openMicrofrontends: '1.0.0',
      microfrontends: [
        {
          name: 'Microfrontend 1',
          paths: {
            resourcesBase: '/'
          },
          resources: {
            js: ['index.js']
          },
          globalLaunchFunction: 'start',
          apiProxies: {
            foo: 'https://bar.com/x'
          }
        }
      ]
    };

    const errors = extraValidationTemplateStartersBrowserStandalone(def);

    expect(errors).toBe('apiProxies found in definition, which are not supported!');
  });

  it('succeeds with a definition without security or API proxies', async () => {
    const def: OpenMicroFrontendsDef = {
      openMicrofrontends: '1.0.0',
      microfrontends: [
        {
          name: 'Microfrontend 1',
          paths: {
            resourcesBase: '/'
          },
          resources: {
            js: ['index.js']
          },
          globalLaunchFunction: 'start'
        }
      ]
    };

    const errors = extraValidationTemplateStartersBrowserStandalone(def);

    expect(errors).toBeFalsy();
  });
});
