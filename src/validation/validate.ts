import { isAbsolute, resolve } from 'path';
import { readFile } from 'fs/promises';
import AJV from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import type { SecurityRequirement } from '@open-microfrontends/types/OpenMicrofrontendDescription';
import type { OpenMicroFrontendsDef } from '../types';

const loadExternalSchema = async (uri: string, defLocation: string): Promise<any> => {
  if (uri.startsWith('https://json-schema.org/')) {
    return {};
  }
  let schema;
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    const response = await fetch(uri);
    schema = response.json();
  } else {
    if (uri.startsWith('file:')) {
      uri = uri.replace('file://', '');
    }
    if (!isAbsolute(uri)) {
      uri = resolve(defLocation, uri);
    }
    const jsonContent = await readFile(uri, 'utf-8');
    schema = JSON.parse(jsonContent);
  }
  // We only can validate against https://json-schema.org/draft/2020-12/schema at the moment,
  // so, we remove the $schema property if it exists
  delete schema.$schema;
  return schema;
};

const validateSubSchema = async (schema: any, defLocation: string): Promise<string | null> => {
  const ajv = new AJV({
    loadSchema: async (uri: string) => loadExternalSchema(uri, defLocation)
  });
  addFormats(ajv);
  try {
    await ajv.compileAsync(schema);
  } catch (e) {
    return e.message;
  }
  return null;
};

const validateSchemaCompliance = async (schema: any, data: any, defLocation: string): Promise<string | null> => {
  const ajv = new AJV({
    strictTypes: false,
    loadSchema: async (uri: string) => loadExternalSchema(uri, defLocation)
  });
  addFormats(ajv);
  console.info('!!!!', schema);

  const compiledSchema = await ajv.compileAsync(schema);
  const valid = compiledSchema(data);
  if (!valid) {
    return `Schema validation failed: ${compiledSchema.errors.map((e) => `${e.instancePath} ${e.message}`).join(', ')}`;
  }
  return null;
};

const validateSecurityRequirements = (
  microfrontendName: string,
  knownSchemes: Array<string>,
  securityRequirements: Array<SecurityRequirement>
): string | null => {
  for (const securityRequirement of securityRequirements) {
    for (const schemaName in securityRequirement) {
      if (!knownSchemes.includes(schemaName)) {
        return `Security requirement of Microfrontend ${microfrontendName} is not valid: Unknown schema: ${schemaName}!`;
      }
    }
  }
};

export default async (def: OpenMicroFrontendsDef, defLocation: string): Promise<string | null> => {
  if (!def.openMicrofrontends.startsWith('1.0.')) {
    return `This Generator version only supports OpenMicrofrontends version 1.0.x`;
  }

  const schemaPath = import.meta.resolve('@open-microfrontends/schemas/open-microfrontends.json');
  const schema = await loadExternalSchema(schemaPath, defLocation);

  // Basic schema compliance
  const schemaErrors = await validateSchemaCompliance(schema, def, defLocation);
  if (schemaErrors) {
    return schemaErrors;
  }

  const knownSecuritySchemes = Object.keys(def.securitySchemes ?? {});

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
    const defaultConfigErrors = await validateSchemaCompliance(
      microfrontend.config.schema,
      microfrontend.config.default,
      defLocation
    );
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

    // Check security schema references
    if (microfrontend.apiProxies) {
      for (const apiProxyName in microfrontend.apiProxies) {
        const apiProxy = microfrontend.apiProxies[apiProxyName];
        if (typeof apiProxy === 'object' && apiProxy.security) {
          const result = validateSecurityRequirements(microfrontend.name, knownSecuritySchemes, apiProxy.security);
          if (result) {
            return result;
          }
        }
      }
    }
  }

  return null;
};
