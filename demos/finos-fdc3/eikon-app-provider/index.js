const express = require('express');
const bodyParser = require('body-parser');

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
  customConfig: [],
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
  }`,
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
  customConfig: [],
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
  }`,
};

// An array containing the Eikon applications that will be listed and launched.
const eikonApplications = [
  eikonNewsApplication,
  eikonGraphApplication
];

// Express server that will serve the applications.
const app = express();
const port = 3001;
app.use(bodyParser.json());
app.listen(port, () => console.log(`App is running on port ${port}.`));

// End-point that exposes all applications.
app.get("/apps/search", (_, res) => {
  res.json({
    applications: eikonApplications,
    message: 'OK',
  });
});

// End-point that exposes a single application by name.
app.get("/apps/*", (req, res) => {
  const applicationName = req.originalUrl.replace('/apps/', '');
  const application = eikonApplications.find(app => app.name === applicationName);
  if (application) {
    res.status(200);
    res.json({
      application: application,
      message: 'OK',
    });
  } else {
    res.status(400).send('App doesn\'t exist.');
  }
});

// App creation isn't implemented.
app.post('/apps', (_, res) => {
  res.status(501).send('App creation currently not supported.');
});
