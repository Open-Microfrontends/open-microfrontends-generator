import extraValidationTemplateStartersBrowserStandalone from '../../src/validation/extraValidationTemplateStartersBrowserStandalone';
import type { OpenMicroFrontendsDef } from '../../src/types';

describe('extraValidationTemplateStartersBrowserStandalone', () => {
  it('fails if the spec contains API proxies', async () => {
    const def: OpenMicroFrontendsDef = {
      openMicrofrontends: '1.0.0',
      microfrontends: [
        {
          name: 'Microfrontend 1',
          assets: {
            basePath: '/',
            js: {
              initial: ['index.js']
            },
          },
          rendererFunctionName: 'startMicrofrontend1',
          apiProxies: {
            foo: 'https://bar.com/x'
          }
        }
      ]
    };

    const errors = extraValidationTemplateStartersBrowserStandalone(def);

    expect(errors).toBe('apiProxies found in spec, which are not supported!');
  });

  it('fails if the definition contains SSR routes', async () => {
    const def: OpenMicroFrontendsDef = {
      openMicrofrontends: '1.0.0',
      microfrontends: [
        {
          name: 'Microfrontend 1',
          assets: {
            basePath: '/',
            js: {
              initial: ['index.js']
            },
          },
          rendererFunctionName: 'startMicrofrontend1',
          ssr: {
            initialHtmlPath: '/ssr'
          }
        }
      ]
    };

    const errors = extraValidationTemplateStartersBrowserStandalone(def);

    expect(errors).toBe('SSR route (paths.ssrHtml) found in spec, which is not supported!');
  });

  it('succeeds with a spec without security, API proxies or SSR routes', async () => {
    const def: OpenMicroFrontendsDef = {
      openMicrofrontends: '1.0.0',
      microfrontends: [
        {
          name: 'Microfrontend 1',
          assets: {
            basePath: '/',
            js: {
              initial: ['index.js']
            },
          },
          rendererFunctionName: 'startMicrofrontend1'
        }
      ]
    };

    const errors = extraValidationTemplateStartersBrowserStandalone(def);

    expect(errors).toBeFalsy();
  });
});
