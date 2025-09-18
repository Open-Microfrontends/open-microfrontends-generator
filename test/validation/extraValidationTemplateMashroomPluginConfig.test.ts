import extraValidationTemplateMashroomPluginConfig from '../../src/validation/extraValidationTemplateMashroomPluginConfig';
import type { OpenMicroFrontendsDef } from '../../src/types';

describe('extraValidationTemplateMashroomPluginConfig', () => {
  it('fails if the spec contains frontendPermissions but no role mapping is present', async () => {
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
          frontendPermissions: [
            {
              name: 'perm1'
            },
            {
              name: 'perm2'
            }
          ]
        }
      ]
    };

    const errors = extraValidationTemplateMashroomPluginConfig(def);

    expect(errors).toBe('frontendPermissions found in spec but no annotation MASHROOM_FRONTEND_PERMISSIONS_MAPPING!');
  });

  it('succeeds if the spec contains frontendPermissions abd a role mapping is present', async () => {
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
            test: {
              url: 'http://foo.bar/x',
              security: [
                {
                  apiKey: []
                }
              ]
            }
          },
          frontendPermissions: [
            {
              name: 'perm1'
            },
            {
              name: 'perm2'
            }
          ],
          annotations: {
            MASHROOM_FRONTEND_PERMISSIONS_MAPPING: {
              perm1: ['role1'],
              perm2: ['Administrator']
            }
          }
        }
      ]
    };

    const errors = extraValidationTemplateMashroomPluginConfig(def);

    expect(errors).toBeFalsy();
  });
});
