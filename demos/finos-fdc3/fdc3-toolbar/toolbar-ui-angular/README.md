# Glue42 FINOS FDC3 AppD demo toolbar

## Overview

This Project, an open source contribution from Glue42, provides a UI that:
* connects to one or more FINOS FDC3 Application Directories.
* shows the applications defined in each server
* allows those applications to be launched.

The UI is oriented towards developers who are investigating the AppD service, for example it provides easy access to view the JSon definitions of the applications and to easily view the log files. However the UI is functional and a production oriented toolbar could easily be created by removing access to some features.

The UI shows the integration of the FDC3 AppD Services API and the FDC3 API used to launch applications.


### Application providers

The Toolbar displays the available applications from AppD providers aka Application Directories that follow the [appd-api](https://github.com/FDC3/appd-api).

The list of app providers can be managed using the Toolbar settings UI.

### Applications

The FINOS FDC3 Application Directory API defines applications, certain key attributes of each application are provided in common fields, including information on any Intents supported by the application. However the launch details of each application are defined in the application manifest, the manifest is either proviuded as a string, or a URL to the manifest definition. 

FINOS FDC3 does not define any manifest types, and the dettypes are expected to vary between FDC3 implementations. As an example of how manifest types could be used, the Toolbar projects defines two manifest types
* [org.finos.fdc3.demo](./app/apps/schemas/org.finos.fdc3.demo-manifest-schema.json)
Which is used to define Desktop Exe and Desktop Browser applications. These applications can be started by the Toolbar using the Electron native services.
* [org.finos.fdc3.demo.host](./app/apps/schemas/org.finos.fdc3.demo.host-manifest-schema.json) Which defines an FDC3 application i.e. an application which is started by an [Finos FDC3 API](https://github.com/FDC3/FDC3/blob/master/src/api/interface.ts) open call. The format specified here could be used to describe applications from a range of FDC3 API implementations. 

Support for the demo.host manifest is scheduled for v1.1 of the Toolbar demo.

### Logs

Log events can be exported as .csv file and can be opened in a separate window.

## Build

clone the project
* ```cd``` to <project's root dir>/toolbar-ui-angular
* ```npm i```
* ```npm run build```

OR

* clone the project
* run build-ui.bat

This generates a standalone Electron project. 

The built version of the project can be started using the start.bat batch file.
