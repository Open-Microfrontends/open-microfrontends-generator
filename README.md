
# OpenMicrofrontends Generator (OMG)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub CI](https://github.com/open-microfrontends/open-microfrontends-generator/actions/workflows/ci_build.yml/badge.svg)](https://github.com/open-microfrontends/open-microfrontends-generator/actions/workflows/ci_build.yml)

Generates type-safe Microfrontend render functions and host integrations from an [OpenMicrofrontends](https://www.open-microfrontends.org) definition.

## Usage

Basic usage:

    omg microfrontends.yaml src/_generated -t renderersPlainJS,mashroomPluginConfig -a mashroomCategory=Demo

Arguments:
 
 * *definitionFile*: The OpenMicrofrontends definition (yaml/json)
 * *outFolder*: The target folder for generated code

Options:

| Option                     | Description                                                         |
|----------------------------|---------------------------------------------------------------------|
| -t, --templates            | A comma separated list of templates to use                          |
| -a, --additionalProperties | A comma separated list of extra properties to pass to the templates |
| -v, --validationONly       | Only validate given definition file                                 |
| --help                     | Usage info                                                          |

## Templates

### renderersPlainJS

Generates a *microfrontendRenderers.ts* file that contains render functions that need to be implemented.
The generated code is plain JavaScript and does depend on any libraries.

Usage:

```ts
import {onRenderMyFirstMicrofrontend} from './_generated/microfrontendsRenderers';

onRenderMyFirstMicrofrontend(async (host, context) => {
    const {config, messageBus} = context;
    host.innerHTML = '<div>My Microfrontend 1</div>';
    return {
        onRemove: () => {
            // ...
        }
    }
});
```

> [!NOTE]
> This implementation contains a compatibility layer for *Mashroom Server* for demo purposes. 
> It will be removed as soon as *Mashroom Server* supports *OpenMicrofrontends* natively.

### hostIntegrationsBrowser

Generates a *microfrontendStarters.ts* file that contains functions to launch the Microfrontends on an arbitrary HTML page. 

Usage

```ts
import {startMyFirstMicrofrontend} from './_generated/microfrontendClients';

const hostElement = document.getElementById('root');

const {close, messages} = await startMyFirstMicrofrontend('https://my-microfrontend-server.com', hostElement, {
    // id: '1',
    // lang: 'en',
    // user,
    config: {
        welcomeMessage: 'Microfrontend Demo!',
    },
    // messageBus,
});

// Send a message to the Microfrontend
messages.publish('topic', {});
```

Supported additionalProperties:

| Property                    | Description                                                                           |
|-----------------------------|---------------------------------------------------------------------------------------|
| shadowDOM                   | Set this to true if the Microfrontend shall be started in a *Shadow DOM* (isolated)   |

> [!IMPORTANT]
> This host integration does not support:
>   * API proxies
>   * Any kind of security
>   * Server-side rendering


### hostIntegrationsMashroom

Generates a *microfrontendStarters.ts* file that contains functions to launch the Microfrontends within 
a [Mashroom Portal](https://www.mashroom-server.com) page. 
Typically, the generated started would be used within another Microfrontend to create a *Composite Microfrontend*. 

```ts
import {startMyFirstMicrofrontend} from './_generated/microfrontendClients';

const {id, close, messages} = await startMyFirstMicrofrontend('hostElementId', {
    welcomeMessage: 'Microfrontend Demo!',
});

// Send a message to the Microfrontend
messages.publish('topic', {});
```

### hostIntegrationsExpress

Generates a *microfrontendStarters.ts* file and [Express.js](https://expressjs.com) based server-side code for security, proxying and SSR.

TODO

### hostIntegrationsSpringBoot

Generates a *microfrontendStarters.ts* file and [Spring Boot](https://spring.io/projects/spring-boot) based server-side code for security, proxying and SSR.

TODO

### mashroomPluginConfig

Generates a *mashroom.json* file that can be used to register the Microfrontends in [Mashroom Portal](https://www.mashroom-server.com).

Supported additionalProperties:

| Property                    | Description                                                                           |
|-----------------------------|---------------------------------------------------------------------------------------|
| mashroomCategory            | The *category* to set in the resulting mashroom.json                                  |
| mashroomMetaInfoAnnotations | A comma separated list of *annotations* properties that shall be copied to *metaInfo* |
