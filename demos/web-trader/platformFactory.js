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
// Glue42 specific platform config.
const platformConfig = {
  gateway: gw,
  auth: authRequest,
};

const plexusPlatformConfig = {
  webSocketUrl: `ws://127.0.0.1:61851`
};

if (typeof window !== 'undefined') {
  if (window.PlexusPlatformFactory) {
    window.platformFactory = async () => new window.PlexusPlatformFactory
      .InteropPlatformFactory()
      .createPlatform(plexusPlatformConfig);
  } else {
    window.platformFactory = async () => InteropPlatform(platformConfig);
  }
} else if (typeof global !== 'undefined') {
  const InteropPlatform = require('glue-interop-api-impl');
  // Glue42 platform factory function.
  module.exports = async () => InteropPlatform(platformConfig);
}
