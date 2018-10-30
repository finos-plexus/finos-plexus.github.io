(async() => {
  const applicationName = 'web-trader-client';

  appLogic.updateBalance(10000);

  // Invoke the platform specific factory function.
  window.platform = await platformFactory();
  window.peer = await window.platform.connect(applicationName);
  appLogic.displayConnectedDetails(window.platform.type, window.peer.id);  
  // When disconnected display the disconnected image and display 'Not connected'.
  window.peer.onConnectionStatusChanged((status) => {
    if (status === 'Connected') {
      appLogic.displayConnectedDetails(window.platform.type, window.peer.id);
    } else if (status === 'Disconnected') {
      appLogic.displayDisconnectedDetails();
    }
  });

  // Injected to the onSubmitButtonCallback to check if the make-market-order/close-market-order methods of the server exist (are registered) before invoking them.
  const { discoverMethods } = window.peer;
  // Injected to the onSubmitButtonCallback to check if the price-stream stream of the sample-price-publisher exists (is registered) before subscribing.
  const { discoverStreams } = window.peer;
  // Injected to the onSubmitButtonCallback to invoke the make-market-order/close-market-order methods of the server.
  const { invoke } = window.peer;
  // Injected to the onSubmitButtonCallback to subscribe to the price-stream stream of the sample-price-publisher.
  const { subscribe } = window.peer;
  // Injected to the onSubmitButtonCallback for the make-market-order/close-market-order methods' invocation of the server to identify the client.
  const clientId = window.peer.id;

  const partialPlatformAPI = {
    discoverMethods,
    discoverStreams,
    invoke,
    subscribe,
    clientId,
  };

  appLogic.addSubmitButtonCallback(partialPlatformAPI);
})();
