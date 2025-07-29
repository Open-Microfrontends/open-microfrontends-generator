import type {HttpsOpenMicrofrontendsSchemas100} from './generated/open-microfrontends';

export type OpenMicroFrontendsDef = HttpsOpenMicrofrontendsSchemas100;

export type GeneratorModelTsTypeRef = {
    readonly ifName: string;
    readonly ifType: string;
}

export type GeneratorModel = {
    readonly def: OpenMicroFrontendsDef;
    readonly safeMicrofrontendNames: Array<string>;
    readonly configSchemaTypes: Array<GeneratorModelTsTypeRef>;
    readonly messageSchemaTypes: Array<Record<string, GeneratorModelTsTypeRef>>;
    readonly additionalProperties: Record<string, string>;
}
