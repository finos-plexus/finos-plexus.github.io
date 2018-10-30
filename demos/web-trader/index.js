/**
* Copyright © 2014-2018 Tick42 BG OOD, Deutsche Bank AG
* SPDX-License-Identifier: Apache-2.0
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
const { spawn } = require('child_process');
const opn = require('opn');

const samplePricePublisherProcess = spawn('node', ['./sample-price-publisher/index.js']);
const clientServerProcess = spawn('node', ['./node_modules/http-server/bin/http-server/', './', '-p 8081']);

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
