#!/usr/bin/env node

import { program } from 'commander';
import main from './main';
import { DEFAULT_OUT_FOLDER, DEFAULT_TEMPLATE } from './constants';
import TemplateConfig from './templateConfig';

program
  .description('OMG - OpenMicrofrontends Generator')
  .argument('<descriptionFile>', 'OpenMicrofrontends description (yaml,json)')
  .argument('[outFolder]', 'The output folder for the generated code', DEFAULT_OUT_FOLDER)
  .option(
    '-t, --templates <templates>',
    `A comma separated list of templates to use. Known templates: ${Object.keys(TemplateConfig).join(', ')}`,
    DEFAULT_TEMPLATE
  )
  .option(
    '-a, --additionalProperties <additionalProperties>',
    'A comma separated list of extra properties to pass to the templates (e.g., a=1,b=2)'
  )
  .option('-v, --validationOnly', 'Only validate the given spec file and exit');

program.parse();

const [descriptionFile, outFolder] = program.args;
const { templates, additionalProperties, validationOnly } = program.opts();

main(descriptionFile, outFolder, templates, additionalProperties, validationOnly);
