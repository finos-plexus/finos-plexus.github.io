
# Plexus Interop Setup

This document describes how to setup Plexus Interop environment (Broker + Client) for Web Trader Demo Application.

# Setup Broker 

Plexus Broker is published as [Nuget package](https://www.nuget.org/packages/Plexus.Interop.Broker.Redist-win-x86/). To install it please follow these steps:

- Download [the package](https://www.nuget.org/api/v2/package/Plexus.Interop.Broker.Redist-win-x86/0.3.8) - you should receive `*.nupkg` file
- Unzip the package with any ZIP archiver (e.g. [7-zip](https://www.7-zip.org/)) to `web-trader/broker` folder

At the end you should get Plexus Broker's `plexus.exe` file located in:

`web-trader/broker/redist/Plexus.Interop.Broker.Redist-win-x86/plexus.exe`

# Run Broker

Please run `start-plexus-broker.bat` file from console. Successful launch will produce logs like:

```
00:00:00.856 | Websocket server started: http://127.0.0.1:52486
00:00:00.888 | New connection accepted: interop.AppLifecycleManager, ConnectionId: AE73F91751AAA294FE441A6E48F1BCFC, ApplicationInstanceId: 07785B4E689803B3E0496C069CD9AF8B
00:00:00.903 | New connection accepted: interop.NativeAppLauncher, ConnectionId: E1BAC8D8AC1212A07A4EAF4D69F986DD, ApplicationInstanceId: 2E4435FF27F57CAFE346D9D6C922DCA9
00:00:00.903 | Broker started in directory C:\Users\udalmik_old\AppData\Local\work\projects\plexus-interop-spec\demos\web-trader
00:00:00.903 | Interop Broker started
```

# Setup client

Please follow these steps to setup clients connection:

- Copy `node_modules/@plexus-interop/common-api-impl/dist/main/src/platform-factory.bundle.js` to `web-trader/lib` folder
- Uncomment `<script type="text/javascript" src="../lib/platform-factory.bundle.js"></script>` script in `web-trader/client/index.html` and `web-trader/server/index.html` files

Now clients are ready and you can start them with 
```
node index.js
```
