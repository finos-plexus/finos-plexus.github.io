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

if (typeof window !== 'undefined') {
  window.platformFactory = () => InteropPlatform(platformConfig);
} else if (typeof global !== 'undefined') {
  const InteropPlatform = require('glue-interop-api-impl');

  // Glue42 platform factory function.
  module.exports = () => InteropPlatform(platformConfig);
}
