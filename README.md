
# OpenMicrofrontends Generator (OMG)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub CI](https://github.com/open-microfrontends/open-microfrontends-generator/actions/workflows/ci_build.yml/badge.svg)](https://github.com/open-microfrontends/open-microfrontends-generator/actions/workflows/ci_build.yml)

Generates type-safe Microfrontend render functions and host integrations from an [OpenMicrofrontends](https://www.open-microfrontends.org) spec.

## Usage

Basic usage:

    omg microfrontends.yaml src/_generated -t renderersPlainJS,mashroomPluginConfig -a mashroomCategory=Demo

Arguments:
 
 * *specFile*: The OpenMicrofrontends spec (yaml/json)
 * *outFolder*: The target folder for generated code

Options:

| Option                     | Description                                                         |
|----------------------------|---------------------------------------------------------------------|
| -t, --templates            | A comma separated list of templates to use                          |
| -a, --additionalProperties | A comma separated list of extra properties to pass to the templates |
| -v, --validationOnly       | Only validate given spec file and exit                              |
| --help                     | Usage info                                                          |

## Templates

| Template                                                  | Description                                                          |
|-----------------------------------------------------------|----------------------------------------------------------------------|
| [renderersPlainJS](#renderersPlainJS)                     | Renderer functions for the Microfrontends server                     |
| [startersBrowserStandalone](#startersBrowserStandalone)   | Starters for a plain HTML host                                       |
| [startersBrowserFull](#startersBrowserFull)               | Full starters on a host with a backend (security, proxying)          |
| [hostIntegrationsExpress](#hostIntegrationsExpress)       | Server-side integration code for a Express.js backend                |
| [hostIntegrationsSpringBoot](#hostIntegrationsSpringBoot) | Server-side integration code for a Spring Boot backend               |
| [startersMashroom](#startersMashroom)                     | Starters to be used on a Mashroom Portal page                        |
| [mashroomPluginConfig](#mashroomPluginConfig)             | Converts the *OpenMicrofrontends* spec into a Mashroom plugin config |

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
> This template generates a compatibility layer for *Mashroom Server*.
> It will be removed as soon as *Mashroom Server* supports *OpenMicrofrontends* natively (with 3.0).

### startersBrowserStandalone

Generates a *microfrontendStarters.ts* file that contains functions to launch the Microfrontends on an arbitrary HTML page. 

> [!IMPORTANT]
> This template does not fully support the OpenMicrofrontends spec, so you should only use it for demo/test purposes.
> In particular it does not support security, API proxy declarations or SSR.
> Also, the generated starters do not do any cache busting if the version of the Microfrontend changes.

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


### startersBrowserFull

Generates a *microfrontendStarters.ts* file that contains functions to launch the Microfrontends in the frontend code
of the host server. 
This template requires the backend code from one of the *hostIntegrationsXXX* templates to function properly.

TODO

### hostIntegrationsExpress

Generates integration files for an [Express.js](https://expressjs.com) host, including server-side code for security, proxying and SSR.

TODO

### hostIntegrationsSpringBoot

Generates integration files for an [Spring Boot](https://spring.io/projects/spring-boot) host, including server-side code for security, proxying and SSR.

TODO

### startersMashroom

Generates a *microfrontendStarters.ts* file that contains functions to launch the Microfrontends within
a [Mashroom Portal](https://www.mashroom-server.com) page.

> [!NOTE]
> Mashroom Server can launch any OpenMicrofrontends compliant Microfrontend out-of-the-box.
> These launchers are only intended to be used within *Composite Microfrontends"
> to start other (embedded) Microfrontends in a type-safe manner.

```ts
import {startMyFirstMicrofrontend} from './_generated/microfrontendClients';

const {id, close, messages} = await startMyFirstMicrofrontend('hostElementId', {
    welcomeMessage: 'Microfrontend Demo!',
});

// Send a message to the Microfrontend
messages.publish('topic', {});
```

### mashroomPluginConfig

Generates a *mashroom.json* file that can be used to register the Microfrontends in [Mashroom Portal](https://www.mashroom-server.com).

The generated mashroom.json file and the package.json file of your Microfrontend need to be exposed under /, so 
*Mashroom* can automatically load it.

> [!NOTE]
> *Mashroom Server* > 3.0 can directly process an exposed *microfrontends.yaml* file, 
> so, generating a plugin config will no longer be necessary.

Supported *annotations* in the *OpenMicrofrontends* spec:

| Annotation                            | Description                                                                                                                                   |
|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| MASHROOM_CATEGORY                     | The *category* where the Microfrontend should appear                                                                                          |
| MASHROOM_FRONTEND_PERMISSIONS_MAPPING | A mapping of *frontendPermissions* to Mashroom roles. This is **required** if *frontendPermissions* are declared in the Microfrontend spec.   |
| MASHROOM_VIEW_ROLES                   | An optional list of roles which are permitted to see the Microfrontend in the Mashroom Portal                                                 |
| MASHROOM_PROXY_ACCESS_ROLES           | An optional mapping of the proxy ID to roles which are allowed to access it. This is typically not necessary if the API is protected somehow. |

Supported additionalProperties:

| Property                    | Description                                                                           |
|-----------------------------|---------------------------------------------------------------------------------------|
| mashroomCategory            | The *category* to set in the resulting mashroom.json                                  |
| mashroomMetaInfoAnnotations | A comma separated list of *annotations* properties that shall be copied to *metaInfo* |
