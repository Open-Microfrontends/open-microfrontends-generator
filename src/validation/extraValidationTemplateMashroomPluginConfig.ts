import colors from 'colors';
import type {TemplateExtraValidation} from '../types';

const validation: TemplateExtraValidation = (def) => {
    for (const microfrontend of def.microfrontends) {
        if (microfrontend.frontendPermissions && microfrontend.frontendPermissions.length > 0 && !microfrontend.annotations?.['MASHROOM_FRONTEND_PERMISSIONS_MAPPING']) {
            return 'frontendPermissions found in definition but no annotation MASHROOM_FRONTEND_PERMISSIONS_MAPPING!';
        }

        // Warnings
        if (microfrontend.security && Object.keys(microfrontend.security).length > 0) {
            console.warn(colors.yellow(`OMG: The Microfrontend requires security: Mashroom does not support that automatically, you have to add an appropriate proxy interceptor plugin manually.`));
        }
        if (microfrontend.apiProxies && Object.keys(microfrontend.apiProxies).length > 0) {
            if (Object.values(microfrontend.apiProxies).find((proxy) => typeof proxy === 'object' && proxy.security && Object.keys(proxy.security).length > 0)) {
                console.warn(colors.yellow(`OMG: Some APIs require security: Mashroom does not support that automatically, you have to add an appropriate proxy interceptor plugin manually.`));
            }
        }
    }

    return null;
};

export default validation;
