![](./resources/fdc3.png)

# App Directory Demo Launcher aka Toolbar

This Toolbar, contributed by Tick42, connects to one or more FINOS FDC3 compatible application directories that implement the FDC3 App Directory REST API https://fdc3.finos.org/appd-spec. The Toolbar will show all the defined applications, and will attempt to launch applications that are defined by a supported Manifest type.

The Toolbar can also show a set of favourite application as Icons in the main Toolbar. 

The Toolbar is primarily aimed at developers working with FINOS FDC3, it provides easy access to the application definitions and to the log files to allow developers to explore the services.

The Toolbar is delivered as a standalone Electron application.

## Getting Started

### Prerequisites

You will need node.js & npm as well as a globally installed electron (npm i -g electron).

### Steps to run project

- run build-ui.bat
- run build-app.bat
- run start.bat

### Steps to run project manually

- Clone the project

#### Build UI

- ```cd``` to <project's root dir>/toolbar-ui-angular
- ```npm i```
- ```npm run build```

#### Install dependencies

- ```cd``` to the project's root dir
- ```npm i```

#### Run dev version

- ```npm run build```
- ```electron app-js/main.js```

#### Run prod version

- ```npm run package:all```
- Inside the release-builds folder locate the built version for your OS

## Description

### FINOS Interop API Implementations

On start, a modal dialog will be showed with predefined FINOS Interop API Implementations - Glue42 and Plexus.

Once the user chooses an implementation the Toolbar will be started with it.

#### Add additional FINOS Interop API Implementation

- Add the FINOS Interop API Implementation to the package.json under "optionalDependencies"

- Add a mapping with display name in ./app/types/interface.ts in InteropApiImplementation enum

- Add the display name in ./main.ts in interopApiImplementation array

- Build the project and the newly added FINOS Interop API Implementation will be loaded

### Application providers

The list Application providers aka (Application Directories) is defined in the Toolbar, using the Settings UI. 

Application provider details are held in local storage.

#### <a name="appd-poc-provider"></a> AppD PoC provider

In order to use the Glue42 FINOS FDC3 App Directroy toolbar, you need to have AppD services to connect to. If you do not have access to services, you can run your own instances using the [appd-poc](https://github.com/FDC3/appd-poc), a Java server. Steps to run:

- Clone the project

- Build the appd-poc

- Launch the appd-poc

- Register a user with the appd-poc

- Configure ```app/config/providers.config.ts``` with your e-mail and password for the appd-poc

- Inside of ```app/providers/appd-poc-apps``` you can find example application definitions that you can configure and provide to the appd-poc inside of ```json/apps```

- On Startup the Toolbar connects to all the configured application providers. The Toolbar can start applications with manifestType `org.finos.fdc3.demo` which is used to start non-FDC3 applications such as Desktop Executables and Browsers.

##### [org.finos.fdc3.demo](./app/apps/schemas/org.finos.fdc3.demo-manifest-schema.json)

Support for starting application of manifestType `org.finos.fdc3.demo.host` is scheduled for version 1.1. This manifestType is used for applications that are started via the FDC3 API.

##### [org.finos.fdc3.demo.host](./app/apps/schemas/org.finos.fdc3.demo.host-manifest-schema.json)

##### Other manifest types

The Toolbar can easily be extended to support more manifest types, by extendinf the code in ```app/apps/app.ts```.
