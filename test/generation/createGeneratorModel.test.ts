import { resolve } from 'path';
import loadYaml from '../../src/utils/loadYaml';
import loadJson from '../../src/utils/loadJson';
import createGeneratorModel from '../../src/generation/createGeneratorModel';

const demoDescriptionsLocation = resolve(import.meta.dirname, '..', '_descriptions');

describe('createGeneratorModel', () => {
  it('creates a valid model', async () => {
    const spec = loadYaml(resolve(demoDescriptionsLocation, 'full1.yaml'));
    const model = await createGeneratorModel(spec, {}, demoDescriptionsLocation);

    expect(model.safeMicrofrontendNames).toEqual(['MyFirstMicrofrontend']);
    expect(model.configSchemaTypes[0].ifName).toBe('Microfrontend1Config');
    expect(model.configSchemaTypes[0].ifType).toBe(`export interface Microfrontend1Config {
  customerId: string;
}
`);
    expect(model.messageSchemaTypes[0].ping.ifName).toBe('Microfrontend1TopicPing');
    expect(model.messageSchemaTypes[0].ping.ifType).toBe(`export interface Microfrontend1TopicPing {
  ping: true;
  [k: string]: unknown;
}
`);
  });

  it('creates a valid model for external schema references', async () => {
    const spec = loadJson(resolve(demoDescriptionsLocation, 'withExternalRefs.json'));
    const model = await createGeneratorModel(spec, {}, demoDescriptionsLocation);

    expect(model.safeMicrofrontendNames).toEqual(['MyFirstMicrofrontend']);
    expect(model.configSchemaTypes[0].ifName).toBe('Microfrontend1Config');
    expect(model.configSchemaTypes[0].ifType).toBe(`export interface Microfrontend1Config {
  customerId: string;
}
`);
    expect(model.messageSchemaTypes[0].ping.ifName).toBe('Microfrontend1TopicPing');
    expect(model.messageSchemaTypes[0].ping.ifType).toBe(`export interface Microfrontend1TopicPing {
  ping: true;
}
`);
  });
});
