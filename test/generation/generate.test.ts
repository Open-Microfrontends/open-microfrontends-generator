import { readFileSync } from 'fs';
import { resolve } from 'path';
import createGeneratorModel from '../../src/generation/createGeneratorModel';
import generate from '../../src/generation/generate';
import loadYaml from '../../src/utils/loadYaml';
import saveFile from '../../src/utils/saveFile';

const demoDescriptionsLocation = resolve(import.meta.dirname, '..', '_descriptions');

describe('generate', () => {
  it('generates renderer functions', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'full.yaml'));
    const targetFile = resolve(import.meta.dirname, '..', '_expectations', 'full_microfrontendRenderers.ts');

    const model = await createGeneratorModel(def, {}, demoDescriptionsLocation);
    const result = await generate(model, 'renderers', targetFile);

    // await saveFile(targetFile, result);

    expect(result).toBe(
      readFileSync(resolve(import.meta.dirname, '..', '_expectations', 'full_microfrontendRenderers.ts'), 'utf-8')
    );
  });

  it('generates server-side renderer functions', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'full.yaml'));
    const targetFile = resolve(import.meta.dirname, '..', '_expectations', 'full_microfrontendRenderersServerSide.ts');

    const model = await createGeneratorModel(def, {}, demoDescriptionsLocation);
    const result = await generate(model, 'renderersServerSide', targetFile);

    // await saveFile(targetFile, result);

    expect(result).toBe(
      readFileSync(
        resolve(import.meta.dirname, '..', '_expectations', 'full_microfrontendRenderersServerSide.ts'),
        'utf-8'
      )
    );
  });

  it('generates browser standalone starter functions', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'full.yaml'));
    const targetFile = resolve(
      import.meta.dirname,
      '..',
      '_expectations',
      'full_microfrontendStarters_browser_standalone.ts'
    );

    const model = await createGeneratorModel(def, {}, demoDescriptionsLocation);
    const result = await generate(model, 'startersBrowserStandalone', targetFile);

    // await saveFile(targetFile, result);

    expect(result).toBe(
      readFileSync(
        resolve(import.meta.dirname, '..', '_expectations', 'full_microfrontendStarters_browser_standalone.ts'),
        'utf-8'
      )
    );
  });

  it('generates browser standalone starter functions for ESM modules', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'fullESM.yaml'));
    const targetFile = resolve(
      import.meta.dirname,
      '..',
      '_expectations',
      'fullESM_microfrontendStarters_browser_standalone.ts'
    );

    const model = await createGeneratorModel(def, {}, demoDescriptionsLocation);
    const result = await generate(model, 'startersBrowserStandalone', targetFile);

    // await saveFile(targetFile, result);

    expect(result).toBe(
      readFileSync(
        resolve(import.meta.dirname, '..', '_expectations', 'fullESM_microfrontendStarters_browser_standalone.ts'),
        'utf-8'
      )
    );
  });

  it('generates browser standalone starter functions for SystemJS modules', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'fullSystemJS.yaml'));
    const targetFile = resolve(
      import.meta.dirname,
      '..',
      '_expectations',
      'fullSystemJS_microfrontendStarters_browser_standalone.ts'
    );

    const model = await createGeneratorModel(def, {}, demoDescriptionsLocation);
    const result = await generate(model, 'startersBrowserStandalone', targetFile);

    // await saveFile(targetFile, result);

    expect(result).toBe(
      readFileSync(
        resolve(import.meta.dirname, '..', '_expectations', 'fullSystemJS_microfrontendStarters_browser_standalone.ts'),
        'utf-8'
      )
    );
  });

  it('generates browser starter functions', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'full.yaml'));
    const targetFile = resolve(import.meta.dirname, '..', '_expectations', 'full_microfrontendStarters.ts');

    const model = await createGeneratorModel(
      def,
      {
        omBasePath: '/__open_microfrontends__',
      },
      demoDescriptionsLocation
    );
    const result = await generate(model, 'starters', targetFile);

    // await saveFile(targetFile, result);

    expect(result).toBe(
      readFileSync(resolve(import.meta.dirname, '..', '_expectations', 'full_microfrontendStarters.ts'), 'utf-8')
    );
  });

  it('generates browser starter functions for ESM modules', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'fullESM.yaml'));
    const targetFile = resolve(import.meta.dirname, '..', '_expectations', 'fullESM_microfrontendStarters.ts');

    const model = await createGeneratorModel(
      def,
      {
        omBasePath: '/__open_microfrontends__',
      },
      demoDescriptionsLocation
    );
    const result = await generate(model, 'starters', targetFile);

    // await saveFile(targetFile, result);

    expect(result).toBe(
      readFileSync(resolve(import.meta.dirname, '..', '_expectations', 'fullESM_microfrontendStarters.ts'), 'utf-8')
    );
  });

  it('generates browser starter functions for SystemJS modules', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'fullSystemJS.yaml'));
    const targetFile = resolve(import.meta.dirname, '..', '_expectations', 'fullSystemJS_microfrontendStarters.ts');

    const model = await createGeneratorModel(
      def,
      {
        omBasePath: '/__open_microfrontends__',
      },
      demoDescriptionsLocation
    );
    const result = await generate(model, 'starters', targetFile);

    // await saveFile(targetFile, result);

    expect(result).toBe(
      readFileSync(
        resolve(import.meta.dirname, '..', '_expectations', 'fullSystemJS_microfrontendStarters.ts'),
        'utf-8'
      )
    );
  });

  it('Node.js host backend integrations', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'full.yaml'));
    const targetFile = resolve(import.meta.dirname, '..', '_expectations', 'full_hostBackendIntegrationsNodeJs.ts');

    const model = await createGeneratorModel(
      def,
      {
        omBasePath: '/__open_microfrontends__',
      },
      demoDescriptionsLocation
    );
    const result = await generate(model, 'hostBackendIntegrationsNodeJs', targetFile);

    // await saveFile(targetFile, result);

    expect(result).toBe(
      readFileSync(
        resolve(import.meta.dirname, '..', '_expectations', 'full_hostBackendIntegrationsNodeJs.ts'),
        'utf-8'
      )
    );
  });

  it('Java host backend integrations', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'full.yaml'));
    const targetFile = resolve(
      import.meta.dirname,
      '..',
      '_expectations',
      'full_hostBackendIntegrationsJavaServlet.java'
    );

    const model = await createGeneratorModel(
      def,
      {
        omBasePath: '/__open_microfrontends__',
        packageName: 'org.openmicrofrontends.demo',
      },
      demoDescriptionsLocation
    );
    const result = await generate(model, 'hostBackendIntegrationsJavaServlet', targetFile);

    // await saveFile(targetFile, result);

    expect(result).toBe(
      readFileSync(
        resolve(import.meta.dirname, '..', '_expectations', 'full_hostBackendIntegrationsJavaServlet.java'),
        'utf-8'
      )
    );
  });
});
