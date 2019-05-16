Eikon Bridge (Manager Module)
======================================================

##### FINOS Interop API implementation to Eikon Bridge

Eikon Bridge that allows applications to list and start Eikon applications and to also update the Eikon color channels.

### Steps to run

0. Make sure you have ```node``` & ```npm``` installed
1. ```npm i```
2. ```npm run start```
3. Go to ```localhost:8081``` and choose the FINOS Interop API implementation you want to use

### Methods registered by the Bridge

- ```Fdc3.Eikon.ListApplications``` - Lists the Eikon Applications
- ```Fdc3.Eikon.StartApplication``` - Starts an Eikon Application
- ```Fdc3.Eikon.ContextListener``` - Allows the Eikon bridge to get notified whenever somebody broadcasts (https://github.com/FDC3/FDC3/blob/master/src/api/interface.ts#L155)
- ```Fdc3.Eikon.ShowChart``` - Method with ShowChart intent. Updates the context of the eikonChannelIdToBroadcastTo
- ```Fdc3.Eikon.ShowNews``` - Method with ShowNews intent. Updates the context of the eikonChannelIdToBroadcastTo
