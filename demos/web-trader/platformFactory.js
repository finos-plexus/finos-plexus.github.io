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
const gluePlatformConfig = {
  gateway: gw,
  auth: authRequest,
};

const plexusPlatformConfig = {
  webSocketUrl: `ws://127.0.0.1:49917`
};

if (typeof window !== 'undefined') {
  if (window.PlexusPlatformFactory) {
    window.platformFactory = async () => new window.PlexusPlatformFactory
      .InteropPlatformFactory()
      .createPlatform(plexusPlatformConfig);
  } else {
    window.platformFactory = async () => InteropPlatform(gluePlatformConfig);
  }
} else if (typeof global !== 'undefined') {
  try {
    const { InteropPlatformFactory } = require(`@plexus-interop/common-api-impl`)
    module.exports = async () => new InteropPlatformFactory().createPlatform(plexusPlatformConfig);
  } catch (error) {
    const InteropPlatform = require('glue-interop-api-impl');
    module.exports = async () => InteropPlatform(gluePlatformConfig);
  }
}
