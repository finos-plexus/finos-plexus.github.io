// The demo will run without any changes to this file.

// eslint-disable-next-line no-unused-vars
const appLogic = (() => {
  // Available instruments to trade.
  const availableInstruments = [
    { value: 'Apple (APPL)', text: 'AAPL' },
    { value: 'Google (GOOGL)', text: 'GOOGL' },
    { value: 'Microsoft (MSFT)', text: 'MSFT' },
  ];

  // Count of the currently opened instrument subscriptions.
  let canvasCounter = 0;

  // Client balance in $.
  let balance = 0;

  // The instrument's that the client has selected from the dropdown menu.
  const selectedInstruments = [];

  // Object that holds the current buy prices per instrument.
  const currentBuyPrices = {};
  // Object that holds the current sell prices per instrument.
  const currentSellPrices = {};

  const bodyElement = $('body');
  const connectionImageElement = $('#connection');
  const platformElement = $('#platform');
  const balanceElement = $('#balance');
  const submitElement = $('#submit');
  const instrumentElement = $('#instrument');
  const instrumentSubscribeElement = $('#instrumentSubscribe');

  // Options used by List.js for the Active Orders table. Item field is the template used by List.js for each object's visualization.
  const options = {
    valueNames: ['id', 'instrument', 'position', 'price', 'amount', 'value', 'pl'],
    item: '<tr><td class="id" style="display:none;"></td><td class="instrument" align="center"></td><td class="position" align="center"></td><td class="price" align="center"></td><td class="amount" align="center"></td><td class="value" align="center"></td><td class="pl" align="center" style="color: red;"></td><td class="closeOrder"><button class="closeOrderBtn">Close Order</button></td></tr>',
  };

  // Create a new List that will hold the active orders.
  const orderList = new List('orders', options);

  const updateBalance = (amount) => {
    balance += amount;
    if (balance < 0) {
      balanceElement.text('You went bankrupt!');
    } else {
      balanceElement.text(`$${balance.toFixed(2)}`);
    }
  };

  const displayConnectedDetails = (platformType, peerId) => {
    // Display the connected image.
    connectionImageElement.attr('src', './assets/connected.png');
    // Display the platform type and peer id.
    platformElement.text(`Platform type: ${platformType}, peer id: ${peerId}`);
    // Display the subscription selection box.
    instrumentSubscribeElement.show();
    // Add each of the availableInstruments as a select option.
    availableInstruments.forEach((availableInstrument) => {
      instrumentElement.append($('<option>', availableInstrument));
    });
  };

  const displayDisconnectedDetails = () => {
    // Display the disconnected image.
    connectionImageElement.attr('src', './assets/disconnected.png');
    platformElement.text('Not connected');
    // Hide the subscription selection box.
    instrumentSubscribeElement.hide();
  };

  const validateAmountInput = (amount, currentPrice, selectedInstrument) => {
    if (!amount) {
      alert('Please enter an amount.');
      return false;
    }
    if (+amount <= 0) {
      alert('Please enter an amount greater than 0.');
      return false;
    }
    // Takes care of the case when the stream-price-publisher still hasn't sent a buy price for the selectedInstrument.
    if (!currentPrice) {
      alert(`Price information for ${selectedInstrument} isn't available yet. Please try again.`);
      return false;
    }
    // Client balance insufficient to execute order.
    if (amount * currentPrice > balance) {
      alert(`You are $${(amount * currentPrice - balance).toFixed(2)} short.`);
      return false;
    }

    return true;
  };

  // Function used to attach the onClick callback to the Close Order buttons.
  const addCloseOrderButtonCallbacks = (discoverMethods, invoke, clientId) => {
    // All buttons that don't already have a callback.
    const buttonsThatDontHaveACallback = $('.closeOrderBtn:not(.hasCallback)');
    buttonsThatDontHaveACallback.click(async function() {
      const currentButton = $(this);
      // Get the id of the row on which the close button is.
      const itemId = currentButton.closest('tr').find('.id').text();
      // The row values.
      const orderValues = orderList.get('id', itemId)[0]._values;
      const { amount } = orderValues;
      const oldPrice = orderValues.price;
      let newPrice;
      let profitLoss;
      // When closing a buy order we add the newPrice * amount to the client's balance.
      if (orderValues.position === 'Buy') {
        newPrice = currentSellPrices[orderValues.instrument];
        profitLoss = newPrice * amount;
        // When closing a sell order we add the (oldPrice + oldPrice - newPrice) * amount to the client's balance.
      } else if (orderValues.position === 'Sell') {
        newPrice = currentBuyPrices[orderValues.instrument];
        profitLoss = (2 * oldPrice - newPrice) * amount;
      }

      updateBalance(profitLoss);

      // We remove the closed order from the active order list.
      orderList.remove('id', itemId);

      const registeredMethods = await discoverMethods();
      const closeMarketOrderMethods = registeredMethods.filter(method => method.name === 'close-market-order');
      // We invoke each server's close-market-order method in order for the web trading server to delete the order from it's active orders list.
      if (closeMarketOrderMethods.length > 0) {
        closeMarketOrderMethods.forEach(method => invoke(method, { id: itemId, clientId }));
      }
    });
    // We add the hasCallback class to the buttons that we just added callback to.
    buttonsThatDontHaveACallback.addClass('hasCallback');
  };

  // Function that adds the order to the active orders list.
  const addToOrderList = ({ id, instrument, position, price, amount, value, profitLoss }, discoverMethods, invoke, clientId) => {
    // Add the order to List.js.
    orderList.add({ id, instrument, position, price, amount, value: value.toFixed(2), pl: profitLoss.toFixed(2) });
    // Add the callback to the newly created close order button.
    addCloseOrderButtonCallbacks(discoverMethods, invoke, clientId);
  };

  // Function that invokes the web trading server's make-market-order method.
  const invokeServerMakeMarketOrder = async({ id, instrument, position, price, amount, value }, discoverMethods, invoke, clientId) => {
    const registeredMethods = await discoverMethods();
    const makeMarketOrderMethods = registeredMethods.filter(method => method.name === 'make-market-order');
    if (makeMarketOrderMethods.length > 0) {
      // We invoke each server's make-market-order method in order for the web trading server to add the order to it's active orders list.
      makeMarketOrderMethods.forEach(method => invoke(method, { id, clientId, instrument, position, price, amount, value }));
    }
  };

  const createCanvasDiv = (selectedInstrument, discoverMethods, invoke, clientId) => {
    // Used by Chart.js.
    const chartContainer = $('<div></div>');
    // Container div for the Buy/Sell buttons.
    const buttonContainer = $('<div></div>');
    buttonContainer.attr('class', 'buttonContainer');
    // Input field for the instrument amount to buy/sell.
    const input = $('<input>').attr({
      type: 'number',
      value: 1,
      class: 'amountInput',
    });
    const buyButton = $('<button>Buy</button>');
    buyButton.addClass('buyButton positionButton');
    const sellButton = $('<button>Sell</button>');
    sellButton.addClass('sellButton positionButton');
    // Callback for the buy button that adjusts the client's balance, adds the item to the Active Orders table, adds the click listener to close order and invokes the server's make-market-order method.
    buyButton.click(async() => {
      // The amount of stocks to buy.
      const amount = input.val();
      const currentPrice = currentBuyPrices[selectedInstrument];
      if (!validateAmountInput(amount, currentPrice, selectedInstrument)) {
        return;
      }
      updateBalance(-amount * currentPrice);
      const id = orderList.items.length;
      const instrument = selectedInstrument;
      const position = 'Buy';
      const value = amount * currentPrice;
      // We use the current sell price to calculate the profit/loss.
      const newPrice = currentSellPrices[instrument];
      const profitLoss = (newPrice - currentPrice) * amount;
      const order = {
        id,
        instrument,
        position,
        price: currentPrice,
        amount,
        value,
        profitLoss,
      };
      addToOrderList(order, discoverMethods, invoke, clientId);
      invokeServerMakeMarketOrder(order, discoverMethods, invoke, clientId);
    });
    // Callback for the sell button that adjusts the client's balance, adds the item to the Active Orders table, adds the click listener to close order and invokes the server's make-market-order method.
    sellButton.click(async() => {
      // The amount of stocks to sell.
      const amount = input.val();
      const currentPrice = currentSellPrices[selectedInstrument];
      if (!validateAmountInput(amount, currentPrice, selectedInstrument)) {
        return;
      }
      updateBalance(-amount * currentPrice);
      const id = orderList.items.length;
      const instrument = selectedInstrument;
      const position = 'Sell';
      const value = amount * currentPrice;
      // We use the current buy price to calculate the profit/loss.
      const newPrice = currentBuyPrices[instrument];
      const profitLoss = (currentPrice - newPrice) * amount;
      const order = {
        id,
        instrument,
        position,
        price: currentPrice,
        amount,
        value,
        profitLoss,
      };
      addToOrderList(order, discoverMethods, invoke, clientId);
      invokeServerMakeMarketOrder(order, discoverMethods, invoke, clientId);
    });
    chartContainer.attr('id', `chartContainer${canvasCounter}`);
    // Append the chartContainer, input field and buy/sell buttons to the body.
    bodyElement.append(chartContainer);
    bodyElement.append(input);
    bodyElement.append(buttonContainer);
    buttonContainer.append(buyButton);
    buttonContainer.append(sellButton);
    chartContainer.css({
      height: '370px',
      width: '70%',
      float: 'right',
    });
    canvasCounter++;
    // We provide the chartContainer's id to Canvas.js to add the line chart canvas visualization. The buy and sell buttons are used for our price-stream subscription to update the buy/sell button's text.
    return {
      id: chartContainer.attr('id'),
      buyButton,
      sellButton,
    };
  };

  // Function that creates a new canvas for the selectedInstrument and subscribes to the price-stream for that instrument.
  const subscribeForInstrument = async(selectedInstrument, {
    discoverMethods,
    discoverStreams,
    invoke,
    subscribe,
    clientId,
  }) => {
    selectedInstruments.push(selectedInstrument);

    // The data points visualized on the line chart.
    const dps = [];
    const canvasDivInfo = createCanvasDiv(selectedInstrument, discoverMethods, invoke, clientId);
    const chart = new CanvasJS.Chart(canvasDivInfo.id, {
      title: {
        text: selectedInstrument,
      },
      axisY: {
        includeZero: false,
      },
      data: [{
        type: 'line',
        dataPoints: dps,
      }],
    });
    chart.render();

    // The x-axis represents the number of next() invocations.
    let xVal = 0;
    // The amount of data points to display at any moment on the line chart.
    const dataLength = 20;

    // Function used to update the line chart with the new data (we visualize the sell price).
    const updateChart = (sellPrice) => {
      dps.push({
        x: xVal,
        y: sellPrice,
      });
      xVal++;

      // If the count of data points is greater than the amount of data points to display at any time we remove the first element.
      if (dps.length > dataLength) {
        dps.shift();
      }

      chart.render();
    };

    // Observer's next function that we provide on subscribing to the price stream. It updates the chart and the profit/loss field for all orders of the selected instrument inside the active orders table.
    const next = (instrumentData) => {
      // Update the chart with the new price.
      updateChart(instrumentData.sell);
      const newBuyPrice = instrumentData.buy;
      const newSellPrice = instrumentData.sell;
      // Display the new buy price inside the Buy button.
      canvasDivInfo.buyButton.text(`Buy ${newBuyPrice.toFixed(2)}`);
      // Display the new sell price inside the Sell button.
      canvasDivInfo.sellButton.text(`Sell ${newSellPrice.toFixed(2)}`);
      currentBuyPrices[selectedInstrument] = newBuyPrice;
      currentSellPrices[selectedInstrument] = newSellPrice;

      // Get all active.
      // That are for the selected instrument.
      orderList.items
        .forEach((item) => {
          if (item._values.instrument !== selectedInstrument) {
            return;
          }
          const oldPrice = item._values.price;
          const { amount } = item._values;
          // The new profit/loss value of the order that we update the table with.
          let profitLoss;
          if (item._values.position === 'Buy') {
            profitLoss = (newSellPrice - oldPrice) * amount;
          } else if (item._values.position === 'Sell') {
            profitLoss = (oldPrice - newBuyPrice) * amount;
          }

          const profitLossFixed = profitLoss.toFixed(2);
          item.values({ pl: profitLoss > 0 ? `+${profitLossFixed}` : profitLossFixed });
          const pl = Array.from(item.elm.childNodes).find(node => node.className === 'pl');
          if (profitLoss > 0) {
            pl.style.color = 'green';
          } else if (profitLoss < 0) {
            pl.style.color = 'red';
          } else {
            pl.style.color = 'blue';
          }
        });
    };

    const registeredStreams = await discoverStreams();
    // Check if the sample-price-publisher is running.
    const priceStream = registeredStreams.find(stream => stream.name === 'price-stream');
    if (priceStream) {
      subscribe('price-stream', { next }, { instrument: selectedInstrument });
    } else {
      alert('Price stream not available.');
    }
  };

  const addSubmitButtonCallback = (partialPlatformAPI) => {
    // Callback for the submit button. If the client isn't already subscribed for the selected instrument a new canvas is created to display the price data and the client is subscribed to the price-stream offered by the sample-price-publisher.
    submitElement.click(() => {
      // The currently selected instrument.
      const selectedInstrument = instrumentElement.val();
      if (!selectedInstruments.includes(selectedInstrument)) {
        // Create a new canvas for the selectedInstrument and subscribe to the price-stream.
        subscribeForInstrument(selectedInstrument, partialPlatformAPI);
      }
    });
  };

  return {
    updateBalance,
    displayConnectedDetails,
    displayDisconnectedDetails,
    addSubmitButtonCallback,
  };
})();
