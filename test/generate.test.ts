import {readFileSync} from 'fs';
import {resolve} from 'path';
import loadYaml from '../src/loadYaml';
import createGeneratorModel from '../src/createGeneratorModel';
import generate from '../src/generate';

const demoSchemaLocation = resolve(__dirname, '_schemas');

describe('generate', () => {

    it('generates plain render functions', async () => {
        const def = loadYaml(resolve(demoSchemaLocation, 'full1.yaml'));
        const model = await createGeneratorModel(def, {}, demoSchemaLocation);
        const result = await generate(model, 'renderersPlainJS');

        // await saveFile(resolve(__dirname, '_expectations', 'full1_microfrontendRenderers.ts'), result);

        expect(result).toBe(readFileSync(resolve(__dirname, '_expectations', 'full1_microfrontendRenderers.ts'), 'utf-8'));
    });

    it('generates plain start functions', async () => {
        const def = loadYaml(resolve(demoSchemaLocation, 'full1.yaml'));
        const model = await createGeneratorModel(def, {
            shadowDOM: 'true',
        }, demoSchemaLocation);
        const result = await generate(model, 'hostIntegrationBrowser');

        // await saveFile(resolve(__dirname, '_expectations', 'full1_microfrontendClients.ts'), result);

        expect(result).toBe(readFileSync(resolve(__dirname, '_expectations', 'full1_microfrontendClients.ts'), 'utf-8'));
    });

    it('generates mashroom start functions', async () => {
        const def = loadYaml(resolve(demoSchemaLocation, 'full1.yaml'));
        const model = await createGeneratorModel(def, {
            shadowDOM: 'true',
        }, demoSchemaLocation);
        const result = await generate(model, 'hostIntegrationMashroom');

        // await saveFile(resolve(__dirname, '_expectations', 'full1_microfrontendClients_mashroom.ts'), result);

        expect(result).toBe(readFileSync(resolve(__dirname, '_expectations', 'full1_microfrontendClients_mashroom.ts'), 'utf-8'));
    });

    it('generates a mashroomPluginConfig', async () => {
        const def = loadYaml(resolve(demoSchemaLocation, 'full1.yaml'));
        const model = await createGeneratorModel(def, {
            mashroomCategory: 'OpenMicroFrontendsDemo',
            mashroomMetaInfoAnnotations: 'MY_COCKPIT_CAPABILITIES_META',
        }, demoSchemaLocation);
        const result = await generate(model, 'mashroomPluginConfig');

        // await saveFile(resolve(__dirname, '_expectations', 'full1_mashroomPluginConfig.json'), result);

        expect(result).toBe(readFileSync(resolve(__dirname, '_expectations', 'full1_mashroomPluginConfig.json'), 'utf-8'));
    });

});
