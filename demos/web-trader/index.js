const { spawn } = require('child_process');
const opn = require('opn');

const samplePricePublisherProcess = spawn('node', ['./sample-price-publisher/index.js']);
const clientServerProcess = spawn('node', ['./node_modules/.bin/http-server', './', '-p 8081']);

const redirectOutput = (childProcess, name) => {
  childProcess.stdout.on('data', (data) => {
    console.log(`${name} stdout:\n${data}`);
  });

  childProcess.stderr.on('data', (data) => {
    console.log(`${name} stderr:\n${data}`);
  });

  childProcess.on('close', (code) => {
    console.log(`${name} child process exited with code ${code}`);
  });
};

redirectOutput(samplePricePublisherProcess, 'SamplePricePublisher');
redirectOutput(clientServerProcess, 'Client/Server');

opn('http://localhost:8081/web-trader/client', { app: 'chrome' })
  .catch(() => opn('http://localhost:8081/web-trader/client', { app: 'google chrome' })
    .catch(() => console.log('\'google chrome\'/\'chrome\' couldn\'t be started.')));


opn('http://localhost:8081/web-trader/server', { app: 'chrome' })
  .catch(() => opn('http://localhost:8081/web-trader/server', { app: 'google chrome' })
    .catch(() => console.log('\'google chrome\'/\'chrome\' couldn\'t be started.')));
