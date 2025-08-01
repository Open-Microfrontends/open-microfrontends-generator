import { compile as jsonToTs } from 'json-schema-to-typescript';
import type { GeneratorModel, GeneratorModelTsTypeRef, OpenMicroFrontendsDef } from '../types';

export const schemaToTs = async (schema: any, ifName: string, defLocation: string): Promise<string> => {
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
    cwd: defLocation
  });
};

export default async (
  def: OpenMicroFrontendsDef,
  additionalProperties: Record<string, string>,
  defLocation: string
): Promise<GeneratorModel> => {
  const safeMicrofrontendNames: Array<string> = [];
  const configSchemaTypes: Array<GeneratorModelTsTypeRef> = [];
  const messageSchemaTypes: Array<Record<string, GeneratorModelTsTypeRef>> = [];

  for (let i = 0; i < def.microfrontends.length; i++) {
    const microfrontend = def.microfrontends[i];
    const safeName = microfrontend.name
      .split(' ')
      .map((s) => s.replace(/[^a-zA-Z0-9]/g, '_'))
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
    safeMicrofrontendNames.push(safeName);
    const configIfName = `Microfrontend${i + 1}Config`;
    configSchemaTypes.push({
      ifName: configIfName,
      ifType: await schemaToTs(microfrontend.config.schema, configIfName, defLocation)
    });
    const mst: Record<string, GeneratorModelTsTypeRef> = {};
    if (microfrontend.messages) {
      for (const topic in microfrontend.messages) {
        const topicDef = microfrontend.messages[topic];
        const topicCamelCase = String(topic).charAt(0).toUpperCase() + String(topic).slice(1);
        const messageIfName = `Microfrontend${i + 1}Topic${topicCamelCase}`;
        mst[topic] = {
          ifName: messageIfName,
          ifType: await schemaToTs(topicDef.schema, messageIfName, defLocation)
        };
      }
    }
    messageSchemaTypes.push(mst);
  }

  return {
    def,
    safeMicrofrontendNames,
    configSchemaTypes,
    messageSchemaTypes,
    additionalProperties
  };
};
