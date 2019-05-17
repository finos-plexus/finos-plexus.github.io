FDC3 Demo Applications
======================================================

##### Demo applications, part of the demonstration of the demo for FDC3 API and FINOS Interop API implementations.

The Demo applications react to context changes (broadcast) and raised intents (raiseIntent). The Instrument List application broadcasts whenever an instrument row is selected and raises intent whenever an item from the context menu is clicked.

### Steps to run

0. Make sure you have ```node``` & ```npm``` installed
1. ```npm i```
2. ```npm run start```
3. The demo applications run on ```localhost:4200/[instrument-list | instrument-price-chart | trade-ticket | login]```
