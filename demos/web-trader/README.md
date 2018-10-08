# Web Trader

A demo application to showcase the capabilities of the [Common Interop API](https://github.com/finos-plexus/finos-plexus.github.io/blob/master/client-api/client-api.ts)'s implementation.

## Getting Started

### Prerequisites

You will need ```node.js``` & ```npm```.

### Installing dependencies

- Clone the project

- cd to the project's root dir

- ```npm install```

### Steps to run

- Inside the ```package.json``` replace the ```glue-interop-api-impl``` with the implementation you want to use

- ```npm install```

- Inside ```web-trader/lib``` place the implementation you want to use and change the web-trader/client, web-trader/server ```index.html```s to include it

- Configure ```platformFactory.js``` for the implementation you want to use

- ```node index.js``` will start the sample-price-publisher, serve the web-trader client and server and launch the client and server inside google chrome

### Common Interop API

The Demo uses the following Common Interop API methods:

  - InvokeMethod

  - SubscribeStream

  - ~RegisterMethod~

  - RegisterMethodOnConnect

  - ~RegisterStream~

  - RegisterStreamOnConnect

  - ~DiscoverPeers~

  - DiscoverMethods

  - DiscoverStreams

  - ~ListenPeerConnected~

  - ~ListenMethodRegistered~

  - ~ListenStreamRegistered~
