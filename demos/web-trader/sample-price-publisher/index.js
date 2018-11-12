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
  const platform = platformFactory();
  platform
    .connect(applicationName, undefined, undefined, streamsToBeRegisteredOnConnecting)
    .then(() => console.log('sample-price-publisher connected'))
    .catch(e => console.error('Failed to created Platform Factory', e));
})();
