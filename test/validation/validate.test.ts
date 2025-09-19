import { resolve } from 'path';
import loadJson from '../../src/utils/loadJson';
import loadYaml from '../../src/utils/loadYaml';
import validate from '../../src/validation/validate';

const demoDescriptionsLocation = resolve(import.meta.dirname, '..', '_descriptions');

describe('validate', () => {
  it('succeeds with a valid yaml declaration file', async () => {
    const def = loadYaml(resolve(demoDescriptionsLocation, 'full1.yaml'));

    const errors = await validate(def, demoDescriptionsLocation);

    expect(errors).toBeFalsy();
  });

  it('succeeds with a valid json declaration file with external schema references', async () => {
    const def = loadJson(resolve(demoDescriptionsLocation, 'withExternalRefs.json'));

    const errors = await validate(def, demoDescriptionsLocation);

    expect(errors).toBeFalsy();
  });

  it('fails if the declaration file is not schema compliant', async () => {
    const def = loadJson(resolve(demoDescriptionsLocation, 'invalid.json'));

    const errors = await validate(def, demoDescriptionsLocation);

    expect(errors).toBe(
      `Schema validation failed: /microfrontends/0 must have required property 'rendererFunctionName'`
    );
  });

  it('fails with invalid external schema references', async () => {
    const def = loadJson(resolve(demoDescriptionsLocation, 'invalidExternalRefs.json'));

    const errors = await validate(def, demoDescriptionsLocation);

    expect(
      errors.startsWith(`Message Schema of Microfrontend My First Microfrontend Topic 'ping' is not valid:`)
    ).toBeTruthy();
  });

  it('fails with an invalid config schema', async () => {
    const def = loadJson(resolve(demoDescriptionsLocation, 'invalidConfigSchema1.json'));

    const errors = await validate(def, demoDescriptionsLocation);

    expect(errors).toBe(
      'Config Schema of Microfrontend My First Microfrontend is not valid: strict mode: unknown keyword: "typex"'
    );
  });

  it('fails with an invalid config type', async () => {
    const def = loadJson(resolve(demoDescriptionsLocation, 'invalidConfigSchema2.json'));

    const errors = await validate(def, demoDescriptionsLocation);

    expect(errors).toBe('Config Schema of Microfrontend My First Microfrontend is not valid: Must be of type object!');
  });

  it('fails with an invalid default config', async () => {
    const def = loadJson(resolve(demoDescriptionsLocation, 'invalidDefaultConfig.json'));

    const errors = await validate(def, demoDescriptionsLocation);

    expect(errors).toBe(
      `Default config of Microfrontend My First Microfrontend is not valid: Schema validation failed:  must have required property 'customerId'`
    );
  });

  it('fails with an invalid security schema reference', async () => {
    const def = loadJson(resolve(demoDescriptionsLocation, 'invalidSecuritySchemaReference.json'));

    const errors = await validate(def, demoDescriptionsLocation);

    expect(errors).toBe(
      'Security requirement of Microfrontend My First Microfrontend is not valid: Unknown schema: UnknownSecuritySchema!'
    );
  });
});
