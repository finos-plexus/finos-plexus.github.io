/**
 * Copyright © 2014-2019 Tick42 OOD
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

import logStream from './shared';
import { Toolbar } from './toolbar';
import { providerConfigs, toolbarConfig } from './config';
import ProviderConfig from './providers/types/providerConfig';
import ProviderFactory from './providers/providerFactory';
import InteropPlatformAPI, { MethodImplementation } from './types/client-api';
import { Context, Fdc3APIImplementation, InteropApiImplementations } from './types/interface';
import { app, BrowserWindow, ipcMain } from 'electron';
import { windowConfig } from './config';
import * as path from 'path';
import RestAppProvider from './providers/rest-app-provider';
import App from './apps/app';

const providerFactory = new ProviderFactory();
const interopApiImplementations: string[] = ['Glue42', 'Plexus'];
let modalDialogWindow: BrowserWindow;

const appProviders = providerConfigs.map((providerConfig: ProviderConfig) => {
  const provider = providerFactory.create(providerConfig);
  logStream.next([`Will add provider "${providerConfig.name}" with URL "${providerConfig.apiUrl}"`, 'info', 'Toolbar']);
  return provider;
});

const interopPlatformsPromises: Array<Promise<InteropPlatformAPI>> = []; // https://github.com/finos-plexus/finos-plexus.github.io

// Send the list of available FINOS Interop API implementations to the render process.
ipcMain.on('get-list-of-interop-impls', (event: any) => {
  event.returnValue = interopApiImplementations;
});

const startModalDialogWindow = () => {
  return new Promise((resolve) => {
    app.on('ready', () => {
      createModalDialogWindow();
      resolve();
    });
  });
};

const createModalDialogWindow = () => {
  modalDialogWindow = new BrowserWindow(windowConfig.modalDialog);
  modalDialogWindow.setTitle('Interop API Implementations');
  modalDialogWindow.setMenuBarVisibility(false);
  modalDialogWindow.loadURL(
    `file://${path.join(__dirname, '..')}/toolbar-ui-angular/dist/toolbar-ui/assets/interop-impl-modal-dialog.html`
  );
  modalDialogWindow.on('ready-to-show', () => {
    modalDialogWindow.show();
    logStream.next(['Finos Interop Modal Dialog window ready.', 'info', 'Toolbar']);
  });
};

const getAppsFromAllProviders = async (): Promise<App[]> => {
  const apps: App[] = [];
  for (const appProvider of appProviders) {
    const restAppProvider = new RestAppProvider(appProvider);
    try {
      const appsForProvider = await restAppProvider.getApps();
      apps.push(...appsForProvider);
    } catch (e) {
      console.log(e);
    }
  }
  return apps;
};

const getMethodsToRegister = (): MethodImplementation[] => {
  const methods: MethodImplementation[] = [];

  methods.push({
    name: 'Fdc3.Toolbar.ListApplications',
    onInvoke: async () => {
      const apps: App[] = await getAppsFromAllProviders();
      return Promise.resolve({ applications: apps });
    }
  });

  methods.push({
    name: 'Fdc3.Toolbar.StartApplication',
    onInvoke: async ({ application }) => {
      const apps: App[] = await getAppsFromAllProviders();
      const startApp: App = apps.find((providerApp: App) => providerApp.name === application);
      if (startApp) {
        return startApp.start();
      } else {
        throw new Error(`There is no application named "${application}"`);
      }
    }
  });

  methods.push({
    name: 'Fdc3.Toolbar.FindIntents',
    onInvoke: async () => {
      // TODO: Build dynamically.
      const showChart = { name: 'show-price-chart', displayName: 'Show Price Chart' };
      const showTrade = { name: 'show-trade-ticket', displayName: 'Show Trade Ticket' };
      const showNews = { name: 'show-news', displayName: 'Show News' };
      const showChartApps: App[] = [];
      const showTradeApps: App[] = [];
      const showNewsApps: App[] = [];

      const apps: App[] = await getAppsFromAllProviders();
      for (const appWithIntent of apps) {
        if (appWithIntent.intents && appWithIntent.intents
          .find((showChartIntent: App) => showChartIntent.name === showChart.name)) {
          showChartApps.push(appWithIntent);
        }
        if (appWithIntent.intents && appWithIntent.intents
          .find((showTradeIntent: App) => showTradeIntent.name === showTrade.name)) {
          showTradeApps.push(appWithIntent);
        }
        if (appWithIntent.intents && appWithIntent.intents
          .find((showNewsIntent: App) => showNewsIntent.name === showNews.name)) {
          showNewsApps.push(appWithIntent);
        }
      }

      return Promise.resolve({
        intentapps: [
          {
            intent: showChart,
            apps: showChartApps
          },
          {
            intent: showTrade,
            apps: showTradeApps
          },
          {
            intent: showNews,
            apps: showNewsApps
          }
        ]
      });
    }
  });

  methods.push({
    name: 'Fdc3.Toolbar.Broadcast',
    onInvoke: (context: Context) => {
      const fdc3Impl = (global as any).fdc3Impl;
      return Promise.resolve(fdc3Impl.broadcast(context));
    }
  });

  return methods;
};

const modalDialogWindowReady: Promise<{}> = startModalDialogWindow();
modalDialogWindowReady.then(() => {
  // Get the chosen FINOS Interop API implementation from the render process.
  ipcMain.once('get-interop-api-impl', (event: any, args: any) => {
    const interopApiImplementationDisplayName = args[0];
    const interopApiImplementation: string = InteropApiImplementations[interopApiImplementationDisplayName];
    // 'window-all-closed' subscription calls app.quit(), close window on toolbar window open
    modalDialogWindow.hide();

    if (interopApiImplementationDisplayName === 'Glue42') {
      try {
        const InteropPlatform = require(interopApiImplementation);
        const glue42InteropPlatform = InteropPlatform(toolbarConfig.FDC3_GLUE_IMPL_PLATFORMS_CONFIG, 'Glue42');
        const eikonOverGlue42InteropPlatform = InteropPlatform(toolbarConfig.FDC3_GLUE_IMPL_PLATFORMS_CONFIG, 'Eikon');
        interopPlatformsPromises.push(glue42InteropPlatform, eikonOverGlue42InteropPlatform);
      } catch (error) {
        logStream.next([`Failed to load ${interopApiImplementation} implementation.`, 'error', 'Toolbar']);
      }
    } else if (interopApiImplementationDisplayName === 'Plexus') {
      try {
        const { InteropPlatformFactory } = require(interopApiImplementation);
        const plexusInteropPlatform = new InteropPlatformFactory().createPlatform(toolbarConfig.FDC3_PLEXUS_IMPL_PLATFORMS_CONFIG);
        const eikonOverPlexusInteropPlatform = new InteropPlatformFactory().createPlatform(toolbarConfig.FDC3_PLEXUS_IMPL_PLATFORMS_CONFIG);
        interopPlatformsPromises.push(plexusInteropPlatform, eikonOverPlexusInteropPlatform);
      } catch (error) {
        logStream.next([`Failed to load ${interopApiImplementation} implementation.`, 'error', 'Toolbar']);
      }
    }

    let resolvedInteropPlatforms: InteropPlatformAPI[] = [];

    // The Promise.resolve() is a hack because of DB's factory function being async.
    Promise.all(interopPlatformsPromises).then((interopPlatforms) => {
      resolvedInteropPlatforms = interopPlatforms;
      // The DB's factory function doesn't accept type as an argument.
      if (interopApiImplementationDisplayName === 'Plexus') {
        interopPlatforms[0].type = 'Plexus';
        interopPlatforms[1].type = 'Eikon';
      }

      // Get the methods to be registered on connection to each Platform.
      const methods: MethodImplementation[] = getMethodsToRegister();

      let fdc3Impl: (interopPlatforms: any[], methods: MethodImplementation[]) => Promise<Fdc3APIImplementation>;

      try {
        fdc3Impl = require(toolbarConfig.FDC3_BUS_IMPLEMENTATION);
      } catch (error) {
        logStream.next([`Failed to load ${toolbarConfig.FDC3_BUS_IMPLEMENTATION} implementation.`, 'error', 'Toolbar']);
      }

      let fdc3ImplReady: Promise<Fdc3APIImplementation>;
      fdc3ImplReady = fdc3Impl(resolvedInteropPlatforms.map((interopPlatform) => ({
        platform: interopPlatform,
        name: `Fdc3.${interopPlatform.type}.Impl`
      })), methods);

      const glue42DemoToolbar = new Toolbar();
      glue42DemoToolbar.start(appProviders, modalDialogWindow, fdc3ImplReady);
      (global as any).glue42DemoToolbar = glue42DemoToolbar;
      (global as any).logStream = logStream;
    }).catch((error) => {
      logStream.next([error, 'error', 'Toolbar']);
    });
  });
});
