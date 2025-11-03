
# OpenMicrofrontends Generator (OMG)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub CI](https://github.com/open-microfrontends/open-microfrontends-generator/actions/workflows/ci_build.yml/badge.svg)](https://github.com/open-microfrontends/open-microfrontends-generator/actions/workflows/ci_build.yml)

Generates type-safe Microfrontend render functions and host integrations from an [OpenMicrofrontends](https://www.open-microfrontends.org) description.

> [!NOTE]
> This generator does currently not support *importMaps* for ES modules, since the Browser support is incomplete (see https://bugzilla.mozilla.org/show_bug.cgi?id=1916277).
> For the moment we recommend using *SystemJS* in conjunction with *importMaps*.

## Requirements

### CLI

 * Node.js >= 20 

### Generated TypeScript code

 * Node.js >= 20
 * devDependencies
   * @open-microfrontends/types
 * Some Templates might require additional dependencies, see below

### Generated Java code

 * Java >= 17
 * Some Templates might require additional runtime dependencies, see below

## Usage

Add to your *package.json*:

```json
{
  "devDependencies": {
    "@open-microfrontends/types": "^1.0.0",
    "@open-microfrontends/open-microfrontends-generator": "^1.0.0"
  }
}
```

To generate code base on some template run:

    omg microfrontends.yaml src/_generated -t renderers

If you just want to validate your description file:

    omg microfrontends.yaml --validationOnly

Arguments:
 
 * *descriptionFile*: The OpenMicrofrontends description (yaml/json)
 * *outFolder*: The target folder for generated code (not required for --validationOnly)

Options:

| Option                     | Description                                                         |
|----------------------------|---------------------------------------------------------------------|
| -t, --templates            | A comma separated list of templates to use                          |
| -a, --additionalProperties | A comma separated list of extra properties to pass to the templates |
| -v, --validationOnly       | Only validate given spec file and exit                              |
| --help                     | Usage info                                                          |

## Templates

| Template                                                                  | Description                                                                             |
|---------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| [renderers](#renderers)                                                   | Client-side renderer functions for the Microfrontends server                            |
| [renderersServerSide](#renderersServerSide)                               | Server-side renderer functions for the Microfrontends server                            |
| [startersBrowserStandalone](#startersBrowserStandalone)                   | Starters for a plain HTML Application Host                                              |
| [starters](#starters)                                                     | Full starters for a Application Host with backend integration (security, proxying, SSR) |
| [hostBackendIntegrationsNodeJs](#hostBackendIntegrationsNodeJs)           | Application Host backend integrations for a Node.js backend                             |
| [hostBackendIntegrationsJavaServlet](#hostBackendIntegrationsJavaServlet) | Application Host backend integrations for a Java-based backend                          |

### renderers

Generates a *microfrontendRenderers.ts* file that contains the client-side render functions that need to be implemented.
The generated code is plain JavaScript and does not depend on any libraries.

#### Usage

Add this to the index file of your *Microfrontend*:

```ts
import {MyFirstMicrofrontendRenderFunction, MyFirstMicrofrontendRenderFunctionName} from './_generated/microfrontendsRenderers';

const renderFn: MyFirstMicrofrontendRenderFunction = async (host, context) => {
  const {config, messageBus} = context;
  host.innerHTML = '<div>My Microfrontend 1</div>';
  return {
    onRemove: () => {
      // ...
     }
  }
};

// If you bundle your code to ESM oder SystemJS
export default {
  [MyFirstMicrofrontendRenderFunctionName]: renderFn,
};
// Or otherwise (this always works)
// window[MyFirstMicrofrontendRenderFunctionName] = renderFn;
```

This template also creates useful constants for paths that can be used in the *Microfrontend* server like this:

```ts
import {MyMicrofrontendAssetsBasePath} from '../_generated/microfrontendRenderers';

const app = express();

// ...

app.use(MyMicrofrontendAssetsBasePath, express.static(resolve(serverDir, 'public')));
```

### renderersServerSide

Generates a *microfrontendRenderersServerSide.ts* file that contains the server-side render functions that need to be implemented.
The generated code is plain JavaScript and does not depend on any libraries.

#### Usage

1. Implement the server-side render function 

```ts
// renderMicrofrontend.ts

import type {MyFirstMicrofrontendServerSideRenderFunction} from "../_generated/microfrontendRenderersServerSide";
import Microfrontend from "../Microfrontend.vue";

const render: MyFirstMicrofrontendServerSideRenderFunction = async (requestBody) => {
    const { id, config } = requestBody;

    const html = /* render your Microfrontend here */ '';

    return {
        html,
    };
};

export default render;

```

2. Implement the route (depends on the framework you are using, in this example we use *Express*)

```ts
// ssrRoute.ts

import type {Request, Response} from 'express';
import renderMicrofrontend from '../renderMicrofrontend';

export default async (req: Request, res: Response) => {
    try {
        const html = await renderMicrofrontend(req.body);
        res.setHeader('Content-Type', 'application/json');
        res.send(html);
    } catch (e: any) {
        console.error('Server-side rendering failed!', e),
        res.sendStatus(500);
    }
}

```

3. Add the route under the correct path 

```ts
import {MyFirstMicrofrontendServerSideRenderPath} from '../_generated/microfrontendRenderersServerSide';
import ssrRoute from './ssrRoute';

const app = express();
app.use(express.json());

app.post(OpenMicrofrontendsExampleSSRServerSideRenderPath, ssrRoute);
```

### startersBrowserStandalone

Generates a *microfrontendStarters.ts* file that contains functions to launch the Microfrontends on an arbitrary HTML page. 

> [!IMPORTANT]
> This template does not fully support the *OpenMicrofrontends* spec, in particular it does not support security, API proxies or SSR.
> So, it is only suitable for *Microfrontends* that need any of those features.

> [!NOTE]
> This template uses a very basic cache busting mechanism by just appending the timestamp to every JS and CSS entry.
> It sets the last digit of the timestamp seconds to 0, so the browser will cache the files for 10 seconds at max.

#### Usage

```ts
import {startMyFirstMicrofrontend} from './_generated/microfrontendClients';

const hostElement = document.getElementById('root');

const {close, messages} = await startMyFirstMicrofrontend('https://my-microfrontend-server.com', hostElement, {
    id: '1',
    // lang: 'en',
    // user,
    config: {
        welcomeMessage: 'Microfrontend Demo!',
    },
    messageBus,
});

// Send a message to the Microfrontend
messages.publish('topic', {});
```

### starters

Generates a *microfrontendStarters.ts* file that contains functions to launch the *Microfrontends* in the frontend of the Application Host. 
This template requires the backend code from one of the *hostBackendIntegrationsXXX* templates (below) to function properly.

#### Additional Properties

| Property      | Description                                                            |
|---------------|------------------------------------------------------------------------|
| omBasePath    | The base path of OpenMicrofrontends integrations. Default: /\_\_om\_\_ |

#### Usage

```ts
import {startMyFirstMicrofrontend} from './_generated/microfrontendClients';

const hostElement = document.getElementById('root');

const {close, messages} = await startMyFirstMicrofrontend(hostElement, {
    id: '1',
    // lang, user, permissions, apiProxyPaths are provided by the backend integration
    config: {
      welcomeMessage: 'Microfrontend Demo!',
    },
    messageBus,
});

// Send a message to the Microfrontend
messages.publish('topic', {});
```

### hostBackendIntegrationsNodeJs

Generates a *microfrontendHostIntegrations.ts* file that contains backend integrations for *Node.js*-based Host Applications, including security, proxying and SSR.

It creates a *middleware* per *Microfrontend* that can be integrated into any backend framework (like Express, Fastify, etc.);

#### Extra Runtime Dependencies

 * [http-proxy-3](https://www.npmjs.com/package/http-proxy-3)

#### Additional Properties

| Property      | Description                                                            |
|---------------|------------------------------------------------------------------------|
| omBasePath    | The base path of OpenMicrofrontends integrations. Default: /\_\_om\_\_ |

#### Usage

First, implement the generated *\<Micfrontend-Name\>BaseSetup* interface generated for each *Microfrontend*:

```typescript
import {MyMicrofrontendBaseSetup} from './_generated/microfrontendHostIntegrations';

export default class MyMicrofrontendBaseSetupImpl implements MyMicrofrontendBaseSetup {
  get microfrontendBaseUrl() {
    return 'http://localhost:7830'
  };

  async getUser(req: IncomingMessage)  {
    // TODO
    return null;
  }

  // Other generated methods
}
```

Then, add the generated *middleware*. For example, with Express:

```typescript
import {myMicrofrontendHostIntegrationMiddleware} from './_generated/microfrontendHostIntegrations';

const app = express();

// ...

app.use(myMicrofrontendHostIntegrationMiddleware(
  new MyMicrofrontendBaseSetupImpl()
));
```

After this, you can start the *Microfrontend* with the functions generated by the [starters](#starters) template.

##### Server-Side Rendering

If the *Microfrontend* supports SSR you can pre-render and add the HTML to the page. With *Express* this could look like this:

```typescript
import {myMicrofrontendServerSideRender} from './_generated/microfrontendHostIntegrations';

try {
  const {contentHtml, headHtml} = await openMicrofrontendsExampleSSRServerSideRender(req, {
    ...microfrontend1,
  });
  return res.render('index', {
    microfrontend1ContentHtml: contentHtml,
    microfrontend1HeadHtml: headHtml,
  });
} catch (e) {
  // TODO
}
```

And in the template:

```ejs
<html>
    <head>
        <%-microfrontend1HeadHtml%>
    </head>
    <body>
        <h1>Microfrontend Application Host</h1>
        <!-- Important: There should be no whitespace between the div and pre-rendered content -->
        <div id="root"><%-microfrontend1ContentHtml%></div>
        <!-- Script that starts the Microfrontend -->
        <script src="main.js"></script>
    </body>
</html>
```

##### Annotations 

The template also generates a constant with the *Annotations* in the *Microfrontend* description (if any).
It can be used in the Application Host logic.

### hostBackendIntegrationsJavaServlet

Generates an *OpenMicrofrontendHostIntegrations.java* file that contains backend integrations for Java Servlet-based Host Applications, including security and proxying.

It creates a *Filter* per *Microfrontend* that can be integrated into any backend framework that supports Java Servlets (like Spring Boot, etc.);

> [!NOTE]
> The main purpose of this template is to demonstrate that a backend integration is possible in arbitrary languages.
> It is not fully type-safe, and SSR is not supported (at the moment).

#### Extra Runtime Dependencies

 * [SLF4J](https://www.slf4j.org/)
 * [Jackson Databind](https://github.com/FasterXML/jackson-databind)
 * [HTTP Proxy Servlet](https://github.com/mitre/HTTP-Proxy-Servlet) 2.x
 * [Apache HttpComponents](https://hc.apache.org)

#### Additional Properties

| Property     | Description                                                            |
|--------------|------------------------------------------------------------------------|
| omBasePath   | The base path of OpenMicrofrontends integrations. Default: /\_\_om\_\_ |
| packageName  | The Java package (default: *_generated*)                               |

#### Usage

First, implement the generated *\<Micfrontend-Name\>BaseSetup* interface generated for each *Microfrontend*:

```java
import _generated.OpenMicrofrontendHostIntegrations;

public class MyMicrofrontendBaseSetupImpl implements OpenMicrofrontendHostIntegrations.MyMicrofrontendHostIntegrationFilter.MicrofrontendBaseSetup {
    @Override
    public String getMicrofrontendBaseUrl() {
        return "http://localhost:7830";
    }

    @Override
    public OpenMicrofrontendHostIntegrations.User getUser(HttpServletRequest req) {
        // TODO
        return null;
    }

  // Other generated methods
}
```

Then, add the generated *Servlet Filter*. For example, with Spring Boot:

```java
import _generated.OpenMicrofrontendHostIntegrations;

@SpringBootApplication
public class HostIntegrationDemoApplication {

    // ...

    @Bean
    public Filter createMyMicrofrontendFilter() {
        return new OpenMicrofrontendHostIntegrations.MyMicrofrontendHostIntegrationFilter(new MyMicrofrontendBaseSetupImpl());
    }
}
```

After this, you can start the *Microfrontend* with the functions generated by the [starters](#starters) template.

## Examples

In [this repository](https://github.com/Open-Microfrontends/open-microfrontends-examples) you can find examples 
of *Microfrontends* and *Application Hosts* that use this generator.

## Contributing

Any contribution is highly welcome!

You can contribute by

* [Requesting](https://github.com/Open-Microfrontends/open-microfrontends-generator/issues) new features
* [Creating](https://github.com/Open-Microfrontends/open-microfrontends-generator/issues) issues
* Submitting pull requests

