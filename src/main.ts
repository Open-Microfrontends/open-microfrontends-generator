import { existsSync } from 'fs';
import { dirname, extname, isAbsolute, resolve } from 'path';
import colors from 'colors';
import { DEFAULT_OUT_FOLDER, DEFAULT_TEMPLATE } from './constants';
import TemplateConfig from './templateConfig';
import validate from './validation/validate';
import createGeneratorModel from './generation/createGeneratorModel';
import generate from './generation/generate';
import saveFile from './utils/saveFile';
import loadJson from './utils/loadJson';
import loadYaml from './utils/loadYaml';

export default async (
  specFile: string,
  outFolder = DEFAULT_OUT_FOLDER,
  templates = DEFAULT_TEMPLATE,
  additionalProperties?: string | undefined,
  validationOnly = false
) => {
  const microfrontendSpecPath = isAbsolute(specFile) ? specFile : resolve(process.cwd(), specFile);
  const microfrontendSpecLocation = dirname(microfrontendSpecPath);
  let microfrontendSpec;
  const absoluteOutFolder = isAbsolute(outFolder) ? outFolder : resolve(process.cwd(), outFolder);
  const templateNames = templates.split(',');
  const additionalPropertiesMap = additionalProperties
    ? additionalProperties.split(',').reduce((map, keyValue) => {
        const [key, value] = keyValue.split('=');
        map[key] = value;
        return map;
      }, {})
    : {};

  console.info('=== OMG - OpenMicrofrontends Generator ===');

  // Validation

  if (!existsSync(microfrontendSpecPath)) {
    console.error(colors.red(`OMG: Spec file not found: ${microfrontendSpecPath}`));
    process.exit(1);
  }
  if (!['.json', '.yaml', '.yml'].find((ext) => microfrontendSpecPath.endsWith(ext))) {
    console.error(colors.red(`OMG: Unsupported spec file type: ${extname(microfrontendSpecPath)}`));
    process.exit(1);
  }

  if (microfrontendSpecPath.endsWith('.json')) {
    microfrontendSpec = loadJson(microfrontendSpecPath);
  } else {
    microfrontendSpec = loadYaml(microfrontendSpecPath);
  }

  const validationErrors = await validate(microfrontendSpec, microfrontendSpecLocation);
  if (validationErrors) {
    console.error(colors.red(`OMG: Invalid spec file: ${validationErrors}`));
    process.exit(1);
  }
  console.info(colors.green(`OMG: Spec file valid: ${microfrontendSpecPath}`));

  if (validationOnly) {
    process.exit(0);
  }

  // Generation

  for (const templateName of templateNames) {
    if (!TemplateConfig[templateName]) {
      console.error(colors.red(`OMG: Unknown template: ${templateName}`));
      process.exit(1);
    }
    if (!existsSync(resolve(__dirname, '..', 'templates', `${templateName}.ejs`))) {
      console.error(colors.red(`OMG: Error loading template: ${templateName}`));
      process.exit(1);
    }
  }

  let model;
  try {
    model = await createGeneratorModel(microfrontendSpec, additionalPropertiesMap, microfrontendSpecLocation);
  } catch (e) {
    console.error(colors.red(`OMG: Creation of the template model failed!`), e);
  }

  for (const templateName of templateNames) {
    console.info('OMG: Generating template:', templateName);
    const templateConfig = TemplateConfig[templateName];

    if (templateConfig.extraValidation) {
      const validationErrors = templateConfig.extraValidation(microfrontendSpec);
      if (validationErrors) {
        console.error(colors.red(`OMG: Generation of template ${templateName} failed: ${validationErrors}`));
        process.exit(1);
      }
    }

    try {
      for (const ejsTemplate of Object.keys(templateConfig.templateFileToTargetFiles)) {
        const targetFileName = templateConfig.templateFileToTargetFiles[ejsTemplate];
        const targetFile = resolve(absoluteOutFolder, targetFileName);
        const result = await generate(model, ejsTemplate, absoluteOutFolder);
        await saveFile(targetFile, result);
        console.info(colors.green(`OMG: Saved: ${targetFile}`));
      }
    } catch (e) {
      console.error(colors.red(`OMG: Generation of template ${templateName} failed!`), e);
    }
  }
};
