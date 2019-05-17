FDC3 API Implementation
======================================================

#### Implementation of the FDC3 API (https://github.com/FDC3/FDC3/tree/master/src/api) that accepts and uses FINOS Interop API implementations (https://github.com/finos-plexus/finos-plexus.github.io)

## Methods that the implementation relies on

Fdc3.<Host>.ListApplications - used to find the applications of a Host
Fdc3.<Host>.StartApplication - used to start an application of a Host
Fdc3.<Host>.ContextListener - used to broadcast to listeners

TODO:
-Add link to the public npm registry version of the package.
-Add unit tests that mock the FDC3 Interop API.
