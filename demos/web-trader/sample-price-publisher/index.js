(() => {
  const appLogic = require('./appLogic');
  const platformFactory = require('../platformFactory');

  const applicationName = 'sample-price-publisher';

  // The name of the stream.
  const name = 'price-stream';
  const onSubscriptionRequested = (observer, caller, args) => {
    const { instrument } = args;
    if (!instrument) {
      observer.error('Instrument not specified.');
    }
    // If this is the first subscriber for the specified in args instrument generate initial price and spread for the instrument.
    if (!appLogic.getPriceCacheForInstrument(instrument)) {
      appLogic.generateInitialPriceForPriceCacheInstrument(instrument);
    }

    appLogic.registerCallbackForInstrument(instrument, observer.next);
  };
  const priceStream = {
    name,
    displayName: 'Price Stream',
    tooltip: 'Stream buy sell price for the selected instrument.',
    acceptType: 'String instrument',
    returnType: 'Composite: { Double buy, Double sell } instrumentBuySellPrice',
    onSubscriptionRequested,
  };
  const streamsToBeRegisteredOnConnecting = [priceStream];
  // Invoking the interop-api-impl.min.js's InteropPlatform factory function.
  platformFactory()
    .then(platform => platform.connect(applicationName, undefined, undefined, streamsToBeRegisteredOnConnecting))
    .catch(e => console.error('Failed to created Platform Factory', e));
})();
