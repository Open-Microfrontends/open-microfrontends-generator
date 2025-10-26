import { compile as jsonToTs } from 'json-schema-to-typescript';
import { capitalize, uncapitalize, getSafeMicrofrontendName } from './utils';
import type { GeneratorModel, GeneratorModelTsTypeRef, OpenMicroFrontendsDef } from '../types';

const schemaToTs = async (schema: any, ifName: string, defLocation: string): Promise<string> => {
  let firstSchemaProcessed = false;
  return jsonToTs(schema, ifName, {
    bannerComment: '',
    customName: (targetSchema, keyNameFromDefinition) => {
      if (firstSchemaProcessed) {
        return keyNameFromDefinition;
      }
      firstSchemaProcessed = true;
      return ifName;
    },
    cwd: defLocation,
  });
};

export default async (
  spec: OpenMicroFrontendsDef,
  additionalProperties: Record<string, string>,
  defLocation: string
): Promise<GeneratorModel> => {
  const safeMicrofrontendNames: Array<string> = [];
  const configSchemaTypes: Array<GeneratorModelTsTypeRef> = [];
  const messageSchemaTypes: Array<Record<string, GeneratorModelTsTypeRef>> = [];

  for (let i = 0; i < spec.microfrontends.length; i++) {
    const microfrontend = spec.microfrontends[i];
    const safeName = getSafeMicrofrontendName(microfrontend.name);
    safeMicrofrontendNames.push(safeName);
    const configIfName = `Microfrontend${i + 1}Config`;
    configSchemaTypes.push({
      ifName: configIfName,
      ifType: await schemaToTs(microfrontend.config.schema, configIfName, defLocation),
    });
    const mst: Record<string, GeneratorModelTsTypeRef> = {};
    if (microfrontend.messages) {
      for (const topic in microfrontend.messages) {
        const topicDef = microfrontend.messages[topic];
        const messageIfName = `Microfrontend${i + 1}Topic${capitalize(topic)}`;
        mst[topic] = {
          ifName: messageIfName,
          ifType: await schemaToTs(topicDef.schema, messageIfName, defLocation),
        };
      }
    }
    messageSchemaTypes.push(mst);
  }

  return {
    spec,
    safeMicrofrontendNames,
    configSchemaTypes,
    messageSchemaTypes,
    additionalProperties,
    helpers: {
      capitalize,
      uncapitalize,
    },
  };
};
