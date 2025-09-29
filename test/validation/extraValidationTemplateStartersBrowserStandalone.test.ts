import extraValidationTemplateStartersBrowserStandalone from '../../src/validation/extraValidationTemplateStartersBrowserStandalone';
import type { OpenMicroFrontendsDef } from '../../src/types';

describe('extraValidationTemplateStartersBrowserStandalone', () => {
  it('fails if the declaration contains API proxies', async () => {
    const def: OpenMicroFrontendsDef = {
      openMicrofrontends: '1.0.0',
      microfrontends: [
        {
          name: 'Microfrontend 1',
          assets: {
            basePath: '/',
            js: {
              initial: ['index.js']
            }
          },
          rendererFunctionName: 'startMicrofrontend1',
          apiProxies: {
            foo: 'https://bar.com/x'
          }
        }
      ]
    };

    const errors = extraValidationTemplateStartersBrowserStandalone(def);

    expect(errors).toBe('apiProxies found in the declaration, which are not supported!');
  });

  it('fails if the declaration contains SSR routes', async () => {
    const def: OpenMicroFrontendsDef = {
      openMicrofrontends: '1.0.0',
      microfrontends: [
        {
          name: 'Microfrontend 1',
          assets: {
            basePath: '/',
            js: {
              initial: ['index.js']
            }
          },
          rendererFunctionName: 'startMicrofrontend1',
          ssr: {
            initialHtmlPath: '/ssr'
          }
        }
      ]
    };

    const errors = extraValidationTemplateStartersBrowserStandalone(def);

    expect(errors).toBe('SSR route (paths.ssrHtml) found the declaration, which is not supported!');
  });

  it('fails if the importMaps are declared for module type ESM', async () => {
    const def: OpenMicroFrontendsDef = {
      openMicrofrontends: '1.0.0',
      microfrontends: [
        {
          name: 'Microfrontend 1',
          assets: {
            basePath: '/',
            js: {
              initial: ['index.js'],
              moduleSystem: 'ESM',
              importMap: {
                imports: {
                  foo: 'https://cdn.com/foo.js'
                }
              }
            }
          },
          rendererFunctionName: 'startMicrofrontend1'
        }
      ]
    };

    const errors = extraValidationTemplateStartersBrowserStandalone(def);

    expect(errors).toBe('ImportMaps for moduleSystem ESM found the declaration, which is not supported!');
  });

  it('succeeds with a declaration without security, API proxies or SSR routes', async () => {
    const def: OpenMicroFrontendsDef = {
      openMicrofrontends: '1.0.0',
      microfrontends: [
        {
          name: 'Microfrontend 1',
          assets: {
            basePath: '/',
            js: {
              initial: ['index.js']
            }
          },
          rendererFunctionName: 'startMicrofrontend1'
        }
      ]
    };

    const errors = extraValidationTemplateStartersBrowserStandalone(def);

    expect(errors).toBeFalsy();
  });
});
