// The demo will run without any changes to this file.

const registryFactory = require('callback-registry');

// Used to store the callbacks/subscriptions for each instrument.
const registry = registryFactory();

// Gets a random float number between min and max.
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

// Price cache used to store the last price of the instrument as well as the spread for the instrument. The last price is then used to generate a new price close to it.
const priceCache = {};

const generateNewPricesForPriceCacheInstruments = () => {
  Object.keys(priceCache).forEach((instrument) => {
    const previousPrice = priceCache[instrument].price;
    // Max +-5% difference from the last price.
    const fluctuation = getRandomFloat(-0.05, 0.05);
    const newPrice = previousPrice + fluctuation * previousPrice;
    // The spread is constant.
    priceCache[instrument].price = newPrice;
  });
};

const executeAllRegistryCallbacksForPriceCacheInstruments = () => {
  Object.keys(priceCache).forEach((instrument) => {
    // Execute all callbacks/subscriptions.
    registry.execute(instrument, priceCache[instrument].price);
  });
};

const getPriceCacheForInstrument = (instrument) => {
  if (priceCache[instrument]) {
    return true;
  }
  return false;
};

const generateInitialPriceForPriceCacheInstrument = (instrument) => {
  priceCache[instrument] = {
    price: getRandomFloat(50, 500),
    spread: getRandomFloat(0.4, 0.6),
  };
};

const registerCallbackForInstrument = (instrument, callback) => {
  // Add the callback/subscription to the callback registry.
  registry.add(instrument, (price) => {
    // The buy price is equal to the sell price plus the spread.
    const buyPrice = price + priceCache[instrument].spread;
    // Call the subscriber's callback with the new buy and sell prices.
    callback({
      buy: +((buyPrice).toFixed(2)),
      sell: +(price.toFixed(2)),
    });
  });
};

// How often the price is updated in ms.
const updateInterval = 1500;

// Every updateInterval ms a new price is generated and all callbacks/subscriptions are notified.
setInterval(() => {
  generateNewPricesForPriceCacheInstruments();
  executeAllRegistryCallbacksForPriceCacheInstruments();
}, updateInterval);

module.exports = {
  registryFactory,
  generateNewPricesForPriceCacheInstruments,
  executeAllRegistryCallbacksForPriceCacheInstruments,
  getPriceCacheForInstrument,
  generateInitialPriceForPriceCacheInstrument,
  registerCallbackForInstrument,
};
