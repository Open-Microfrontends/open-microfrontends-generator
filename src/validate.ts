import {isAbsolute, resolve} from 'path';
import AJV from 'ajv/dist/2020';
import type {OpenMicroFrontendsDef} from './types';

const schema = require('../schemas/open-microfrontends.json');

const loadExternalSchema = async (uri: string, defLocation: string): Promise<any> => {
    if (uri.startsWith('https://json-schema.org/')) {
        return {};
    }
    let schema;
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
        const response = await fetch(uri);
        schema = response.json();
    } else {
        if (isAbsolute(uri)) {
            schema = require(uri);
        } else {
            schema = require(resolve(defLocation, uri));
        }
    }
    // We only can validate against https://json-schema.org/draft/2020-12/schema at the moment,
    // so, we remove the $schema property if it exists
    delete schema.$schema;
    return schema;
};

const validateSubSchema = async (schema: any, defLocation: string): Promise<string | null> => {
    const ajv = new AJV({
        loadSchema: async (uri: string) => loadExternalSchema(uri, defLocation),
    });
    try {
        await ajv.compileAsync(schema);
    } catch (e) {
        return e.message;
    }
    return null;
};

const validateSchemaCompliance = async (schema: any, data: any, defLocation: string): Promise<string | null> => {
    const ajv = new AJV({
        loadSchema: async (uri: string) => loadExternalSchema(uri, defLocation),
    });
    const compiledSchema = await ajv.compileAsync(schema);
    const valid = compiledSchema(data);
    if (!valid) {
        return `Schema validation failed: ${compiledSchema.errors.map((e) => `${e.instancePath  } ${  e.message}`).join(', ')}`;
    }
    return null;
};

export default async (def: OpenMicroFrontendsDef, defLocation: string): Promise<string | null> => {
    if (!def.openMicrofrontends.startsWith('1.0.')) {
        return `This Generator version only supports OpenMicrofrontends version 1.0.x`;
    }

    // Basic schema compliance
    const schemaErrors = await validateSchemaCompliance(schema, def, defLocation);
    if (schemaErrors) {
        return schemaErrors;
    }

    for (const microfrontend of def.microfrontends) {
        // Check sub-schemas
        const configSchemaErrors = await validateSubSchema(microfrontend.config.schema, defLocation);
        if (configSchemaErrors) {
            return `Config Schema of Microfrontend ${microfrontend.name} is not valid: ${configSchemaErrors}`;
        }
        if (microfrontend.messages) {
            for (const topic in microfrontend.messages) {
                const topicDef = microfrontend.messages[topic];
                const messageSchemaError = await validateSubSchema(topicDef.schema, defLocation);
                if (messageSchemaError) {
                    return `Message Schema of Microfrontend ${microfrontend.name} Topic '${topic}' is not valid: ${messageSchemaError}`;
                }
            }
        }

        // Check default config
        if (microfrontend.config.schema.type && microfrontend.config.schema.type !== 'object') {
            return `Config Schema of Microfrontend ${microfrontend.name} is not valid: Must be of type object!`;
        }
        const defaultConfigErrors = await validateSchemaCompliance(microfrontend.config.schema, microfrontend.config.default, defLocation);
        if (defaultConfigErrors) {
            return `Default config of Microfrontend ${microfrontend.name} is not valid: ${defaultConfigErrors}`;
        }

        // Check messages publish/subscribe
        if (microfrontend.messages) {
            for (const topic in microfrontend.messages) {
                const topicDef = microfrontend.messages[topic];
                if (!topicDef.publish || !topicDef.subscribe) {
                    return `Message definition Microfrontend ${microfrontend.name} Topic '${topic}' is not valid: One of 'publish' or 'subscribe' must be defined (or both)!`;
                }
            }
        }
    }

    return null;
};
