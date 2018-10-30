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
