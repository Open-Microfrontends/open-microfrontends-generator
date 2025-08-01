import { resolve } from 'path';
import loadJson from '../../src/utils/loadJson';
import loadYaml from '../../src/utils/loadYaml';
import validate from '../../src/validation/validate';

const demoSchemaLocation = resolve(__dirname, '..', '_schemas');

describe('validate', () => {
  it('succeeds with a valid yaml definition file', async () => {
    const def = loadYaml(resolve(demoSchemaLocation, 'full1.yaml'));

    const errors = await validate(def, demoSchemaLocation);

    expect(errors).toBeFalsy();
  });

  it('succeeds with a valid json definition file with external schema references', async () => {
    const def = loadJson(resolve(demoSchemaLocation, 'withExternalRefs.json'));

    const errors = await validate(def, demoSchemaLocation);

    expect(errors).toBeFalsy();
  });

  it('fails if the definition file is not schema compliant', async () => {
    const def = loadJson(resolve(demoSchemaLocation, 'invalid.json'));

    const errors = await validate(def, demoSchemaLocation);

    expect(errors).toBe(
      'Schema validation failed: /microfrontends/0 must have required property \'globalLaunchFunction\''
    );
  });

  it('fails with invalid external schema references', async () => {
    const def = loadJson(resolve(demoSchemaLocation, 'invalidExternalRefs.json'));

    const errors = await validate(def, demoSchemaLocation);

    expect(
      errors.startsWith('Message Schema of Microfrontend My First Microfrontend Topic \'ping\' is not valid:')
    ).toBeTruthy();
  });

  it('fails with an invalid config schema', async () => {
    const def = loadJson(resolve(demoSchemaLocation, 'invalidConfigSchema1.json'));

    const errors = await validate(def, demoSchemaLocation);

    expect(errors).toBe(
      'Config Schema of Microfrontend My First Microfrontend is not valid: strict mode: unknown keyword: "typex"'
    );
  });

  it('fails with an invalid config type', async () => {
    const def = loadJson(resolve(demoSchemaLocation, 'invalidConfigSchema2.json'));

    const errors = await validate(def, demoSchemaLocation);

    expect(errors).toBe('Config Schema of Microfrontend My First Microfrontend is not valid: Must be of type object!');
  });

  it('fails with an invalid default config', async () => {
    const def = loadJson(resolve(demoSchemaLocation, 'invalidDefaultConfig.json'));

    const errors = await validate(def, demoSchemaLocation);

    expect(errors).toBe(
      'Default config of Microfrontend My First Microfrontend is not valid: Schema validation failed:  must have required property \'customerId\''
    );
  });

  it('fails with an invalid security schema reference', async () => {
    const def = loadJson(resolve(demoSchemaLocation, 'invalidSecuritySchemaReference.json'));

    const errors = await validate(def, demoSchemaLocation);

    expect(errors).toBe(
      'Security requirement of Microfrontend My First Microfrontend is not valid: Unknown schema: UnknownSecuritySchema!'
    );
  });
});
