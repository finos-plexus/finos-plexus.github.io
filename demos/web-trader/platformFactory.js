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

// Glue42 specific platform factory function. Needs to be configured for the specific platform you want to use.

const gwPort = 8080;
const gw = {
  protocolVersion: 3,
  ws: `ws://localhost:${gwPort}/gw`,
};
const authRequest = {
  username: 'username',
  password: 'password',
};

// Glue42 specific platform config
const gluePlatformConfig = {
  gateway: gw,
  auth: authRequest,
};

// Plexus specific platform config
const plexusWebSocketPort = 52486;
const plexusPlatformConfig = {
  webSocketUrl: `ws://127.0.0.1:${plexusWebSocketPort}`
};

if (typeof window !== 'undefined') {
  if (window.PlexusPlatformFactory) {
    // Plexus in browser
    window.platformFactory = async () => new window.PlexusPlatformFactory
      .InteropPlatformFactory()
      .createPlatform(plexusPlatformConfig);
  } else {
    // Glue42 in browser
    window.platformFactory = async () => InteropPlatform(gluePlatformConfig);
  }
} else if (typeof global !== 'undefined') {
  try {
    // Plexus in Node
    const { InteropPlatformFactory } = require(`@plexus-interop/common-api-impl`)
    module.exports = async () => new InteropPlatformFactory().createPlatform(plexusPlatformConfig);
  } catch (error) {
    // Glue42 in Node
    const InteropPlatform = require('glue-interop-api-impl');
    module.exports = async () => InteropPlatform(gluePlatformConfig);
  }
}
