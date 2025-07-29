import {existsSync} from 'fs';
import {dirname, extname, isAbsolute, resolve} from 'path';
import colors from 'colors';
import {DEFAULT_OUT_FOLDER, DEFAULT_TEMPLATE, KNOWN_TEMPLATES} from './constants';
import validate from './validate';
import loadJson from './loadJson';
import loadYaml from './loadYaml';
import createGeneratorModel from './createGeneratorModel';
import generate from './generate';
import saveFile from './saveFile';

export default async (definitionFile: string, outFolder = DEFAULT_OUT_FOLDER, templates = DEFAULT_TEMPLATE, additionalProperties?: string | undefined, validationOnly = false) => {
    const microfrontendDefinitionPath = isAbsolute(definitionFile) ? definitionFile : resolve(process.cwd(), definitionFile);
    const microfrontendDefinitionLocation = dirname(microfrontendDefinitionPath);
    let microfrontendDefinition;
    const absoluteOutFolder = isAbsolute(outFolder) ? outFolder : resolve(process.cwd(), outFolder);
    const templateNames = templates.split(',');
    const additionalPropertiesMap = additionalProperties ? additionalProperties.split(',').reduce((map, keyValue) => {
        const [key, value] = keyValue.split('=');
        map[key] = value;
        return map;
    }, {}) : {};

    console.info('=== OMG - OpenMicrofrontends Generator ===');

    // Validation

    if (!existsSync(microfrontendDefinitionPath)) {
        console.error(colors.red(`OMG: Definition file not found: ${microfrontendDefinitionPath}`));
        process.exit(1);
    }
    if (!['.json', '.yaml', '.yml'].find((ext) => microfrontendDefinitionPath.endsWith(ext))) {
        console.error(colors.red(`OMG: Unsupported definition file type: ${extname(microfrontendDefinitionPath)}`));
        process.exit(1);
    }

    if (microfrontendDefinitionPath.endsWith('.json')) {
        microfrontendDefinition = loadJson(microfrontendDefinitionPath);
    } else {
        microfrontendDefinition = loadYaml(microfrontendDefinitionPath);
    }

    const validationErrors = await validate(microfrontendDefinition, microfrontendDefinitionLocation);
    if (validationErrors) {
        console.error(colors.red(`OMG: Invalid definition file: ${validationErrors}`));
        process.exit(1);
    }
    console.info(colors.green(`OMG: Definition file valid: ${microfrontendDefinitionPath}`));

    if (validationOnly) {
        process.exit(0);
    }

    // Generation

    for (const templateName of templateNames) {
        if (!KNOWN_TEMPLATES[templateName]) {
            console.error(colors.red(`OMG: Unknown template: ${templateName}`));
            process.exit(1);
        }
        if (!existsSync(resolve(__dirname, '..', 'templates', `${templateName  }.ejs`))) {
            console.error(colors.red(`OMG: Error loading template: ${templateName}`));
            process.exit(1);
        }
    }

    let model;
    try {
        model = await createGeneratorModel(microfrontendDefinition, additionalPropertiesMap, microfrontendDefinitionLocation);
    } catch (e) {
        console.error(colors.red(`OMG: Creation of the template model failed!`), e);
    }

    for (const templateName of templateNames) {
        console.info('OMG: Generating template:', templateName);
        try {
            const result = await generate(model, templateName as any);
            const targetFile = resolve(absoluteOutFolder, KNOWN_TEMPLATES[templateName]);
            await saveFile(targetFile, result);
            console.info(colors.green(`OMG: Saved: ${targetFile}`));
        } catch (e) {
            console.error(colors.red(`OMG: Generation of template ${templateName} failed!`), e);
        }
    }
};
