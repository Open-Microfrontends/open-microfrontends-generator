import extraValidationTemplateMashroomPluginConfig from '../../src/validation/extraValidationTemplateMashroomPluginConfig';
import type { OpenMicroFrontendsDef } from '../../src/types';

describe('extraValidationTemplateMashroomPluginConfig', () => {
  it('fails if the spec contains frontendPermissions but no role mapping is present', async () => {
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
          frontendPermissions: ['perm1', 'perm2']
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
          ],
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
          frontendPermissions: ['perm1', 'perm2'],
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
