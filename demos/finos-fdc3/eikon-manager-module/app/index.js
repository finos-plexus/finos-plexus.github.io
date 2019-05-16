// FINOS Common Interop API per platform config and init function.
const availableFINOSInteropAPIImplementations = [
  {
    name: 'Glue42',
    init: (username = 'username', password = 'password') => InteropPlatform({
      gateway: {
        protocolVersion: 3,
        ws: 'ws://localhost:8385/gw'
      },
      auth: {
        username,
        password
      }
    })
  },
  {
    name: 'Plexus',
    init: () => new window.PlexusPlatformFactory
      .InteropPlatformFactory()
      .createPlatform({
        webSocketUrl: 'ws://127.0.0.1:52486',
      })
  }
];

// List of the Eikon Channels.
// [
//   { channelId: 5, color: "#DD2C3C" }, // Red.
//   { channelId: 2, color: "#A011FF" }, // Purple.
//   { channelId: 1, color: "#0658FE" }, // Blue.
//   { channelId: 3, color: "#0CAE51" }, // Green.
//   { channelId: 4, color: "#E7E355" } // Yellow.
// ]

// Eikon Channel Id to broadcast to.
const eikonChannelIdToBroadcastTo = 5;


// Eikon application and authentication details.
const productId = 'YOUR_APP_NAME_HERE';
const apiKey = 'YOUR_API_KEY_HERE';

// Eikon session token returned by the Eikon handshake.
let sessionToken;

// The currently selected (FDC3 global context) RIC.
let currentRic;

// The Eikon News Application manifest that follows the FDC3 app-directory specification (https://github.com/FDC3/FDC3/tree/master/src/app-directory).
const eikonNewsApplication = {
  appId: '5bf79a0d-d035-4567-8807-e5d11af914d6',
  name: 'News',
  version: '1.0.0',
  title: 'Eikon News',
  tooltip: 'Eikon News',
  description: 'Eikon News',
  images: [],
  publisher: 'Thomson Reuters',
  icons: [{
    icon: 'finos.png',
  }],
  intents: [
    {
      name: 'show-news',
      displayName: 'Show News'
    }
  ],
  manifestType: 'org.finos.fdc3.demo.host',
  manifest: `{
    "type": "host",
    "hostType": "Eikon",
    "hostName": "Eikon",
    "hostManifest": {}
  }`
};

// The Eikon Graph (Chart) Application manifest that follows the FDC3 app-directory specification (https://github.com/FDC3/FDC3/tree/master/src/app-directory).
const eikonGraphApplication = {
  appId: '3f2e086b-7f8f-45fa-9f3e-600c41c25ee6',
  name: 'Graph',
  version: '1.0.0',
  title: 'Eikon Chart',
  tooltip: 'Eikon Chart',
  description: 'Eikon Chart',
  images: [],
  publisher: 'Thomson Reuters',
  icons: [{
    icon: 'finos.png',
  }],
  intents: [
    {
      name: 'show-price-chart',
      displayName: 'Show Price Chart'
    }
  ],
  manifestType: 'org.finos.fdc3.demo.host',
  manifest: `{
    "type": "host",
    "hostType": "Eikon",
    "hostName": "Eikon",
    "hostManifest": {}
  }`
};

// An array containing the Eikon applications that will be listed and launched.
const eikonApplications = [
  eikonNewsApplication,
  eikonGraphApplication
];

// RIC to Instrument description map.
const ricToDescriptionMapping = {
  'TWTR.K': 'Twitter Inc',
  'ANTM.K': 'Anthem Inc',
  'BARC.L': 'Barclays PLC',
  'BXP': 'Boston Properties Inc',
  'CGC.AX': 'Costa Group Holdings Ltd',
  'CBS': 'CBS Corp',
  'CNA.L': 'Centrica PLC',
  'LNG': 'Cheniere Energy Inc',
  '1113.HK': 'CK Asset Holdings Ltd',
  'DELL.K': 'Dell Technologies Inc'
};

// Method that appends the message msg to the body element.
const appendMsgToBody = (msg) => {
  const msgElement = document.createElement('h4')
  const id = +new Date();
  msgElement.id = id;
  msgElement.innerHTML = msg;
  document.body.appendChild(msgElement);
  return id;
};

// Method that hides the element with id id.
const hideElementById = (id) => {
  document.getElementById(id).style.display = 'none';
};

// Method that attaches the form's onSubmit.
const attachFormOnSubmit = (form) => {
  form.onsubmit = (event) => {
    // Prevent the page from redirecting.
    event.preventDefault();

    // Get the username, password and bus fields' values.
    const username = document.getElementById('form').username.value;
    const password = document.getElementById('form').password.value;
    const bus = document.getElementById('form').bus.value;

    // Hide the form.
    hideElementById('prompt');

    let connectingMsgElementId;

    // Find the selected platform and call the its init method. The Promise.resolve() is a hack because of DB.
    return Promise.resolve(availableFINOSInteropAPIImplementations.find(availableFINOSInteropAPIImplementation => availableFINOSInteropAPIImplementation.name === bus)
      .init(username, password))
      // The init method resolves with the platform object.
      .then((platform) => {
        // Display a 'Connecting...' message.
        connectingMsgElementId = appendMsgToBody('Connecting...');

        // The callbacks of the methods to be registered with the chosen platform on connection.
        const fdc3ListApplicationsOnInvoke = () => ({ applications: eikonApplications });
        const fdc3StartApplicationOnInvoke = ({ application, context }) => startEikonApplication(application, context);
        const fdc3ContextListenerOnInvoke = ({ id: { ric } }) => sendContextChangedRequestForRedChannel(ric);
        const fdc3ShowChartOnInvoke = ({ id: { ric } }) => sendContextChangedRequestForRedChannel(ric);
        const fdc3ShowNewsOnInvoke = ({ id: { ric } }) => sendContextChangedRequestForRedChannel(ric);

        // The method definitions of the methods to be registered with the chosen platform on connection.
        const fdc3ListApplicationsMethod = { name: 'Fdc3.Eikon.ListApplications', onInvoke: fdc3ListApplicationsOnInvoke };
        const fdc3StartApplicationMethod = { name: 'Fdc3.Eikon.StartApplication', onInvoke: fdc3StartApplicationOnInvoke };
        const fdc3ContextListenerMethod = { name: 'Fdc3.Eikon.ContextListener', onInvoke: fdc3ContextListenerOnInvoke };
        let fdc3ShowChartMethod;
        let fdc3ShowNewsMethod;

        // Because the Plexus (Deutsche Bank) implementation doesn't support method's intents metadata we embed the intents inside the method's name.
        if (bus === 'Plexus') {
          fdc3ShowChartMethod = {
            name: '[{\'name\':\'show-price-chart\',\'displayName\':\'Show Price Chart\'}]Fdc3.Eikon.ShowChart',
            onInvoke: fdc3ShowChartOnInvoke
          };

          fdc3ShowNewsMethod = {
            name: '[{\'name\':\'show-news\',\'displayName\':\'Show News\'}]Fdc3.Eikon.ShowNews',
            onInvoke: fdc3ShowNewsOnInvoke
          };
        } else {
          fdc3ShowChartMethod = {
            name: 'Fdc3.Eikon.ShowChart',
            onInvoke: fdc3ShowChartOnInvoke,
            intent: [{
              name: 'show-price-chart',
              displayName: 'Show Price Chart'
            }]
          };

          fdc3ShowNewsMethod = {
            name: 'Fdc3.Eikon.ShowNews',
            onInvoke: fdc3ShowNewsOnInvoke,
            intent: [{
              name: 'show-news',
              displayName: 'Show News'
            }]
          };
        }

        // An array containing the methods to be registered with the chosen platform on connection.
        const methods = [
          fdc3ListApplicationsMethod,
          fdc3StartApplicationMethod,
          fdc3ContextListenerMethod,
          fdc3ShowChartMethod,
          fdc3ShowNewsMethod
        ];

        // Call the platform's connect method passing in the application name and the methods to be registered on connection.
        return platform.connect('eikon-manager-module', undefined, methods);
      })
      // The platform's connect method resolves with the peer object.
      .then((peer) => {
        // Attach the peer object to the window for debugging purposes.
        window.peer = peer;

        // Hide the 'Connecting...' message.
        hideElementById(connectingMsgElementId);

        // Display a `Successfully connected to ${bus}!\n\nThe Eikon FDC3 manager module is up and running!\n\nAll FDC3 API methods are registered.` message.
        appendMsgToBody(`Successfully connected to ${bus}!\n\nThe Eikon FDC3 manager module is up and running!\n\nAll FDC3 API methods are registered.`);
      })
      .catch((error) => {
        // Hide the 'Connecting...' message.
        hideElementById(connectingMsgElementId);

        // Display a `Failed to connect to ${bus}!\n\n${typeof error === 'string' ? error : error.message ? error.message : ''}` message.
        appendMsgToBody(`Failed to connect to ${bus}!`);
        if (typeof error !== 'undefined') {
          appendMsgToBody(`${typeof error === 'string' ? error : error.message ? error.message : ''}`);
        }
      });
  };
};

// Method that finds and starts an Eikon application with a given context.
const startEikonApplication = (application, context) => new Promise((resolve, reject) => {
  let appName;

  if (typeof application === 'string') {
    appName = application;
  } else if (typeof application === 'object') {
    appName = application.name;
  } else {
    return reject(new Error('The application object needs to be of type string or object.'));
  }

  const appToOpen = eikonApplications.find((eikonApp) => eikonApp.name === appName);

  if (typeof appToOpen === 'undefined') {
    return reject(new Error(`Application ${appName} doesn't exist.`));
  }

  // Send a launch request to Eikon with the application name and context.
  sendLaunchRequest(appName, context)
    .then(({ instanceId }) => resolve({
      app: application,
      instanceId
    }));
});

// Method that joins the running application instance to the eikonChannelIdToBroadcastTo.
const sendJoinRedColorChannelRequest = () => new Promise((resolve, reject) => {
  const body = {
    command: 'joinColorChannel',
    sessionToken,
    channelId: eikonChannelIdToBroadcastTo
  };

  sendSxsPostRequest(body, resolve, reject);
});

// Method that updates the RIC inside the eikonChannelIdToBroadcastTo.
const sendContextChangedRequestForRedChannel = (RIC) => new Promise((resolve, reject) => {
  const body = {
    command: 'contextChanged',
    sessionToken,
    channelId: eikonChannelIdToBroadcastTo,
    context: {
      entities: [{
        RIC
      }]
    }
  };

  sendSxsPostRequest(body, resolve, reject);
});

// Method that sends a side by side API POST request.
const sendSxsPostRequest = (body, callback, errorCallback) => {
  const stringifiedBody = JSON.stringify(body);
  const sxsUrl = 'http://127.0.0.1:9000/sxs/v1';

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      } else {
        errorCallback();
      }
    }
  };

  xhr.open('POST', sxsUrl, true);

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');

  xhr.send(stringifiedBody);
};

// Method that performs the initial handshake with Eikon and subscribes to the side by side notifications API.
const sendHandshakeRequest = () => new Promise((resolve, reject) => {
  const body = {
    command: 'handshake',
    productId,
    apiKey
  };

  const callback = (response) => {
    // Open a websocket with the Eikon's notifications API.
    window.ws = new WebSocket(`ws://localhost:9000/sxs/v1/notifications?sessionToken=${response.sessionToken}&linkType=3`);

    ws.onopen = () => {
      resolve(response);
    };

    // The onmessage callback is called whenever the channel's context is changed.
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newContext = data.context;
      if (typeof newContext === 'undefined') {
        return;
      }
      // The new RIC.
      currentRic = JSON.parse(newContext).entities[0].RIC;

      // The peer is undefined before the form is submitted.
      if (typeof peer !== 'undefined') {
        peer.discoverMethods()
          .then((existingMethods) => {
            // 'Fdc3.Toolbar.Broadcast' is the method registered by the toolbar that uses the FDC3 API (https://github.com/FDC3/FDC3/tree/master/src/api) and will broadcast to all platforms.
            const broadcastMethodToInvoke = 'Fdc3.Toolbar.Broadcast';
            const isBroadcastMethodToInvokeRegistered = existingMethods.some((existingMethod) => existingMethod.name === broadcastMethodToInvoke);
            if (isBroadcastMethodToInvokeRegistered) {
              peer.invoke(broadcastMethodToInvoke, {
                type: 'fdc3.instrument',
                id: {
                  ric: currentRic,
                  description: ricToDescriptionMapping[currentRic]
                }
              });
            }
          });
      }
    };
  };

  sendSxsPostRequest(body, callback, reject);
});

// Method that starts an Eikon application with a given context.
const sendLaunchRequest = (appName, context = `{ "entities": [{ "RIC": ${currentRic} }] }`) => new Promise((resolve, reject) => {
  if (typeof context !== 'undefined' && typeof context.id !== 'undefined') {
    context.entities = [{
      RIC: context.id.ric
    }]
  }

  const body = {
    command: 'launch',
    sessionToken,
    appId: appName,
    context
  };

  sendSxsPostRequest(body, resolve, reject);
});

// Send a handshake request on application start.
sendHandshakeRequest()
  // The sendHandshakeRequest method resolves with a response containing the sessionToken that is needed for all future requests.
  .then((response) => {
    sessionToken = response.sessionToken;

    return sendJoinRedColorChannelRequest();
  })
  .then(() => {
    // Populate the form's bus dropdown with an option for each platform.
    availableFINOSInteropAPIImplementations.forEach((availableFINOSInteropAPIImplementation) => {
      const finosInteropAPIImplDropdownElement = document.getElementById('bus');
      const optionElement = document.createElement('option');
      optionElement.text = availableFINOSInteropAPIImplementation.name;
      finosInteropAPIImplDropdownElement.add(optionElement);
    });
    const formElement = document.getElementById('form');

    attachFormOnSubmit(formElement);
  })
  .catch((error) => {
    // Hide the form.
    hideElementById('prompt');

    // Display a `Handshake with SxS failed!\n\n${typeof error === 'string' ? error : error.message ? error.message : ''}` message.
    appendMsgToBody('Handshake with SxS failed!');
    if (typeof error !== 'undefined') {
      appendMsgToBody(`${typeof error === 'string' ? error : error.message ? error.message : ''}`);
    }
  });
