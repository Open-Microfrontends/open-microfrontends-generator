
# OpenMicrofrontends Generator (OMG)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub CI](https://github.com/open-microfrontends/open-microfrontends-generator/actions/workflows/ci_build.yml/badge.svg)](https://github.com/open-microfrontends/open-microfrontends-generator/actions/workflows/ci_build.yml)

Generates type-safe Microfrontend render functions and host integrations from an [OpenMicrofrontends](https://www.open-microfrontends.org) description.

> [!NOTE]
> This generator does currently not support *importMaps* for ES modules, since the Browser support is incomplete (see https://bugzilla.mozilla.org/show_bug.cgi?id=1916277).
> For the moment we recommend using *SystemJS* in conjunction with *importMaps*.

## Usage

Basic usage:

    omg microfrontends.yaml src/_generated -t renderers

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

| Template                                                           | Description                                                  |
|--------------------------------------------------------------------|--------------------------------------------------------------|
| [renderers](#renderers)                                            | Client-side renderer functions for the Microfrontends server |
| [renderersServerSide](#renderersServerSide)                        | Server-side renderer functions for the Microfrontends server |
| [startersBrowserStandalone](#startersBrowserStandalone)            | Starters for a plain HTML host                               |
| [startersBrowser](#startersBrowser)                                | Full starters on a host with a backend (security, proxying)  |
| [hostBackendIntegrationsNodeJs](#hostBackendIntegrationsNodeJs)    | Server-side integration code for a Express.js backend        |
| [hostBackendIntegrationsJava](#hostBackendIntegrationsJava)        | Server-side integration code for a Spring Boot backend       |

### renderers

Generates a *microfrontendRenderers.ts* file that contains the client-side render functions that need to be implemented.
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

### renderersServerSide

Generates a *microfrontendRenderersServerSide.ts* file that contains the server-side render functions that need to be implemented.

TODO

### startersBrowserStandalone

Generates a *microfrontendStarters.ts* file that contains functions to launch the Microfrontends on an arbitrary HTML page. 

> [!IMPORTANT]
> This template does not fully support the OpenMicrofrontends spec, in particular it does not support security, API proxies or SSR.
> So, it is only suitable for Microfrontends that need one of these features.

> [!NOTE]
> This template uses a very basic cache busting mechanism by just appending the timestamp to every JS and CSS entry.
> It sets the last digit of the timestamp seconds to 0, so the browser will cache the files for 10 seconds at max.e

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

### startersBrowser

Generates a *microfrontendStarters.ts* file that contains functions to launch the Microfrontends in the frontend of the host server. 
This template requires the backend code from one of the *hostBackendIntegrationsXXX* templates to function properly.

TODO

### hostBackendIntegrationsNodeJs

Generates integration files for Node.js-based Host Application, including server-side code for security, proxying and SSR.

TODO

### hostBackendIntegrationsJava

Generates integration files for Java-based Host Application, including server-side code for security, proxying and SSR.

TODO

## Contributing

Any contribution is highly welcome!

You can contribute by

* [Requesting](https://github.com/Open-Microfrontends/open-microfrontends-generator/issues) new features
* [Creating](https://github.com/Open-Microfrontends/open-microfrontends-generator/issues) issues
* Submitting pull requests

