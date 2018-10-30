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
  const applicationName = 'web-trader-server';

  // Method that is invoked by a client on buy/sell click. Adds the market order to the List.js list.
  const makeMartketOrderMethod = {
    name: 'make-market-order',
    displayName: 'Make Market Order',
    tooltip: 'Add the client order to the server\'s active orders table.',
    acceptType: 'Composite: { String id, String clientId, String instrument, String position, Double price, Double amount, Double value  } order',
    onInvoke: ({ id, clientId, instrument, position, price, amount, value }) => {
      appLogic.addToOrderList({ id: `${clientId}${id}`, clientId, instrument, position, price, amount, value: value.toFixed(2) });
    },
  };
  // Method that is invoked by a client on close order click. Removes the market order from the List.js list.
  const closeMarketOrderMethod = {
    name: 'close-market-order',
    displayName: 'Close Market Order',
    tooltip: 'Removes the client order from the server\'s active orders table.',
    acceptType: 'Composite: { String id, String clientId } clientOrderIdentifier',
    onInvoke: ({ id, clientId }) => {
      const objToRemove = {
        id,
        clientId,
      };
      appLogic.removeFromOrderListByIdObj(objToRemove);
    },
  };
  const methodsToBeRegisteredOnConnecting = [makeMartketOrderMethod, closeMarketOrderMethod];
  // Invoke the platform specific factory function.
  window.platform = await platformFactory();
  window.peer = await window.platform.connect(applicationName, undefined, methodsToBeRegisteredOnConnecting);
  appLogic.displayConnectedDetails(window.platform.type, window.peer.id);
  // When disconnected display the disconnected image and display 'Not connected'.
  window.peer.onConnectionStatusChanged((status) => {
    if (status === 'Connected') {
      appLogic.displayConnectedDetails(window.platform.type, window.peer.id);
    } else if (status === 'Disconnected') {
      appLogic.displayDisconnectedDetails();
    }
  });
  // Whenever a client peer is disconnected remove all of it's active orders from List.js.
  window.peer.onPeerDisconnected((peer) => {
    appLogic.removeFromOrderListByClientId(peer.id);
  });
})();
