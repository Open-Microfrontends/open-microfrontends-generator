import {readFileSync} from 'fs';
import {resolve} from 'path';
import createGeneratorModel from '../../src/generation/createGeneratorModel';
import generate from '../../src/generation/generate';
import loadYaml from '../../src/utils/loadYaml';
import saveFile from '../../src/utils/saveFile';

const demoSchemaLocation = resolve(__dirname, '..', '_schemas');

describe('generate', () => {

    it('generates plain JS render functions', async () => {
        const def = loadYaml(resolve(demoSchemaLocation, 'full1.yaml'));
        const model = await createGeneratorModel(def, {}, demoSchemaLocation);
        const result = await generate(model, 'renderersPlainJS');

        // await saveFile(resolve(__dirname, '_expectations', '..', 'full1_microfrontendRenderers.ts'), result);

        expect(result).toBe(readFileSync(resolve(__dirname, '..', '_expectations', 'full1_microfrontendRenderers.ts'), 'utf-8'));
    });

    it('generates browser standalone starter functions', async () => {
        const def = loadYaml(resolve(demoSchemaLocation, 'full1.yaml'));
        const model = await createGeneratorModel(def, {
            shadowDOM: 'true',
        }, demoSchemaLocation);
        const result = await generate(model, 'startersBrowserStandalone');

        // await saveFile(resolve(__dirname, '_expectations', '..', 'full1_microfrontendStarters_browser_standalone.ts'), result);

        expect(result).toBe(readFileSync(resolve(__dirname, '..', '_expectations', 'full1_microfrontendStarters_browser_standalone.ts'), 'utf-8'));
    });

    it('generates Mashroom starter functions', async () => {
        const def = loadYaml(resolve(demoSchemaLocation, 'full1.yaml'));
        const model = await createGeneratorModel(def, {
            shadowDOM: 'true',
        }, demoSchemaLocation);
        const result = await generate(model, 'startersMashroom');

        // await saveFile(resolve(__dirname, '_expectations', '..', 'full1_microfrontendStarters_mashroom.ts'), result);

        expect(result).toBe(readFileSync(resolve(__dirname, '..', '_expectations', 'full1_microfrontendStarters_mashroom.ts'), 'utf-8'));
    });

    it('generates a mashroomPluginConfig', async () => {
        const def = loadYaml(resolve(demoSchemaLocation, 'full1.yaml'));
        const model = await createGeneratorModel(def, {
            mashroomCategory: 'OpenMicroFrontendsDemo',
            mashroomMetaInfoAnnotations: 'MY_COCKPIT_CAPABILITIES_META',
        }, demoSchemaLocation);
        const result = await generate(model, 'mashroomPluginConfig');

        // await saveFile(resolve(__dirname, '..', '_expectations', 'full1_mashroomPluginConfig.json'), result);

        expect(result).toBe(readFileSync(resolve(__dirname, '..', '_expectations', 'full1_mashroomPluginConfig.json'), 'utf-8'));
    });

});
