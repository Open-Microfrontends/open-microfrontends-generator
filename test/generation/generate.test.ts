import { readFileSync } from 'fs';
import { resolve } from 'path';
import createGeneratorModel from '../../src/generation/createGeneratorModel';
import generate from '../../src/generation/generate';
import loadYaml from '../../src/utils/loadYaml';
import saveFile from '../../src/utils/saveFile';

const demoDescriptionsLocation = resolve(import.meta.dirname, '..', '_descriptions');

describe('generate', () => {
  it('generates plain JS render functions', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'full1.yaml'));
    const model = await createGeneratorModel(def, {}, demoDescriptionsLocation);
    const result = await generate(model, 'renderers', import.meta.dirname);

    // await saveFile(resolve(import.meta.dirname, '..', '_expectations', 'full1_microfrontendRenderers.ts'), result);

    expect(result).toBe(
      readFileSync(resolve(import.meta.dirname, '..', '_expectations', 'full1_microfrontendRenderers.ts'), 'utf-8')
    );
  });

  it('generates browser standalone starter functions', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'full1.yaml'));
    const model = await createGeneratorModel(
      def,
      {
        shadowDOM: 'true'
      },
      demoDescriptionsLocation
    );
    const result = await generate(model, 'startersBrowserStandalone', import.meta.dirname);

    // await saveFile(
    //   resolve(import.meta.dirname, '..', '_expectations', 'full1_microfrontendStarters_browser_standalone.ts'),
    //   result
    // );

    expect(result).toBe(
      readFileSync(
        resolve(import.meta.dirname, '..', '_expectations', 'full1_microfrontendStarters_browser_standalone.ts'),
        'utf-8'
      )
    );
  });

  it('generates browser standalone starter functions for ESM modules', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'full1_ESM.yaml'));
    const model = await createGeneratorModel(def, {}, demoDescriptionsLocation);
    const result = await generate(model, 'startersBrowserStandalone', import.meta.dirname);

    // await saveFile(
    //   resolve(import.meta.dirname, '..', '_expectations', 'full1_microfrontendStarters_browser_standalone_ESM.ts'),
    //   result
    // );

    expect(result).toBe(
      readFileSync(
        resolve(import.meta.dirname, '..', '_expectations', 'full1_microfrontendStarters_browser_standalone_ESM.ts'),
        'utf-8'
      )
    );
  });

  it('generates browser standalone starter functions for SystemJS modules', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'full1_SystemJS.yaml'));
    const model = await createGeneratorModel(def, {}, demoDescriptionsLocation);
    const result = await generate(model, 'startersBrowserStandalone', import.meta.dirname);

    // await saveFile(
    //   resolve(import.meta.dirname, '..', '_expectations', 'full1_microfrontendStarters_browser_standalone_SystemJS.ts'),
    //   result
    // );

    expect(result).toBe(
      readFileSync(
        resolve(
          import.meta.dirname,
          '..',
          '_expectations',
          'full1_microfrontendStarters_browser_standalone_SystemJS.ts'
        ),
        'utf-8'
      )
    );
  });
});
