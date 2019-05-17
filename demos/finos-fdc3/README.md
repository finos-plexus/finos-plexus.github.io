FINOS-FDC3 Demo
======================================================

## App Directory Demo Launcher aka Toolbar

This Toolbar, contributed by Tick42, connects to one or more FINOS FDC3 compatible application directories that implement the FDC3 App Directory REST API https://fdc3.finos.org/appd-spec. The Toolbar will show all the defined applications, and will attempt to launch applications that are defined by a supported Manifest type.

The Toolbar can also show a set of favourite application as Icons in the main Toolbar.

The Toolbar is primarily aimed at developers working with FINOS FDC3, it provides easy access to the application definitions and to the log files to allow developers to explore the services.

The Toolbar is delivered as a standalone Electron application.

## FDC3 Demo Applications

Demo applications, part of the demonstration of the demo for FDC3 API (https://github.com/FDC3/FDC3/tree/master/src/api) and FINOS Interop API implementations (https://github.com/finos-plexus/finos-plexus.github.io).

The Demo applications react to context changes (broadcast) and raised intents (raiseIntent). The Instrument List application broadcasts whenever an instrument row is selected and raises intent whenever an item from the context menu is clicked.

## FDC3 API Implementation

Implementation of the FDC3 API (https://github.com/FDC3/FDC3/tree/master/src/api) that accepts and uses FINOS Interop API implementations (https://github.com/finos-plexus/finos-plexus.github.io).

## Eikon Bridge (Manager Module)

Eikon Bridge that uses a FINOS Interop API implementation (https://github.com/finos-plexus/finos-plexus.github.io) and allows applications to list and start Eikon applications and to also update the Eikon color channels.

## Eikon Application Provider

Eikon Application Provider that follows the FDC3 AppD spec (https://github.com/FDC3/FDC3/tree/master/src/app-directory).

## Plexus Config

Configuration files for the Plexus Broker that specify the provided and consumed methods by the demo applications.
