import {resolve} from 'path';
import loadYaml from '../src/loadYaml';
import loadJson from '../src/loadJson';
import createGeneratorModel from '../src/createGeneratorModel';

const demoSchemaLocation = resolve(__dirname, '_schemas');

describe('createGeneratorModel', () => {

    it('creates a valid model', async () => {
        const def = loadYaml(resolve(demoSchemaLocation, 'full1.yaml'));
        const model = await createGeneratorModel(def, {}, demoSchemaLocation);

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
        const def = loadJson(resolve(demoSchemaLocation, 'withExternalRefs.json'));
        const model = await createGeneratorModel(def, {}, demoSchemaLocation);

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
