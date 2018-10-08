// The demo will run without any changes to this file.

// eslint-disable-next-line no-unused-vars
const appLogic = (() => {
  const connectionImageElement = $('#connection');
  const platformElement = $('#platform');

  // Options used by List.js for the Active Orders table. Item field is the template used by List.js for each object's visualization.
  const options = {
    valueNames: ['id', 'clientId', 'instrument', 'position', 'price', 'amount', 'value'],
    item: '<tr><td class="id" style="display:none;"></td><td class="clientId" align="center" style="width:330px"></td><td class="instrument" align="center"></td><td class="position" align="center"></td><td class="price" align="center"></td><td class="amount" align="center"></td><td class="value" align="center"></td></tr>',
  };

  // Create a new List that will hold the active orders.
  const orderList = new List('orders', options);

  const addToOrderList = (order) => {
    orderList.add(order);
  };

  const removeFromOrderListByIdObj = (objToRemove) => {
    orderList.remove('id', `${objToRemove.clientId}${objToRemove.id}`);
  };

  const removeFromOrderListByClientId = (id) => {
    orderList.remove('clientId', id);
  };

  const displayConnectedDetails = (platformType, peerId) => {
    // Display the connected image.
    connectionImageElement.attr('src', './assets/connected.png');
    // Display the platform type and peer id.
    platformElement.text(`Platform type: ${platformType}, peer id: ${peerId}`);
  };

  const displayDisconnectedDetails = () => {
    // Display the disconnected image.
    connectionImageElement.attr('src', './assets/disconnected.png');
    platformElement.text('Not connected');
  };

  return {
    addToOrderList,
    removeFromOrderListByIdObj,
    removeFromOrderListByClientId,
    displayConnectedDetails,
    displayDisconnectedDetails,
  };
})();
