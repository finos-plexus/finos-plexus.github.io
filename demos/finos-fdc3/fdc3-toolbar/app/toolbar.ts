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

import AppProvider from './providers/types/app-provider';
import ProviderConfig from './providers/types/providerConfig';
import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain } from 'electron';
import { windowConfig } from './config';
import * as path from 'path';
import { BehaviorSubject } from 'rxjs';
import logStream from './shared';
import RestAppProvider from './providers/rest-app-provider';
import { writeFileSync } from 'fs';
import { Fdc3APIImplementation } from './types/interface';

export class Toolbar {
  public toolbarWindow: BrowserWindow;
  private toolbarWindowOptions: BrowserWindowConstructorOptions = windowConfig.toolbar;
  private providers = new BehaviorSubject<AppProvider[]>([]);

  public start(providers: AppProvider[], modalDialogWindow: BrowserWindow, fdc3ImplReady?: Promise<Fdc3APIImplementation>) {
    this.startToolbarWindow(modalDialogWindow);
    this.addProviders(providers);
    // Allows the front end to access logs, application manifests and application directories.
    ipcMain.on('get-preload-path', (event: any) => {
      event.returnValue = path.join(__dirname, '../toolbar-ui-angular/preload.js');
    });
    if (typeof fdc3ImplReady !== 'undefined') {
      fdc3ImplReady.then((fdc3Impl) => {
        (global as any).fdc3Impl = fdc3Impl;
      });
    }
  }

  public addProvider(provider: ProviderConfig): void {
    if (this.validateProvider(provider)) {
      const providers = this.providers.value;
      providers.push(new RestAppProvider(provider));

      this.updateAllProviders(providers);
    }
  }

  public updateProvider(oldProvider: AppProvider, newProviderData: ProviderConfig): void {
    let updatedProviderIndex;
    const providers = this.providers.value;
    providers.forEach((provider: AppProvider, index: number) => {
      if (provider.name === oldProvider.name && provider.apiUrl === oldProvider.apiUrl) {
        updatedProviderIndex = index;
      }
    });

    if (this.validateProvider(newProviderData)) {
      const newProvider = new RestAppProvider(newProviderData);
      providers.splice(updatedProviderIndex, 1, newProvider);
      this.updateAllProviders(providers);
    }
  }

  public deleteProvider(deletedProvider: AppProvider): void {
    let deletedProviderIndex;
    const providers = this.providers.value;
    providers.forEach((provider: AppProvider, index: number) => {
      if (provider.name === deletedProvider.name && provider.apiUrl === deletedProvider.apiUrl) {
        deletedProviderIndex = index;
      }
    });

    if (deletedProviderIndex) {
      providers.splice(deletedProviderIndex, 1);
    } else {
      logStream.next([`Unable to delete provider ${deletedProvider.name}`, 'error', 'Toolbar']);
    }
    this.updateAllProviders(providers);
  }

  private startToolbarWindow(modalDialogWindow: BrowserWindow) {
    this.createWindow();

    modalDialogWindow.close();

    logStream.next(['Electron ready.', 'info', 'Electron']);
  }

  private createWindow() {
    this.toolbarWindow = new BrowserWindow(this.toolbarWindowOptions);
    this.toolbarWindow.setTitle('Tick42 Toolbar');
    this.toolbarWindow.setMenuBarVisibility(false);
    this.toolbarWindow.loadURL(
      `file://${path.join(__dirname, '..')}/toolbar-ui-angular/dist/toolbar-ui/index.html`
    );
    this.toolbarWindow.on('ready-to-show', () => {
      this.toolbarWindow.show();
      logStream.next(['Toolbar window ready.', 'info', 'Toolbar']);
    });
  }

  private addProviders(providers: AppProvider[]): void {
    this.providers.next(providers);
  }

  private updateAllProviders(providers: AppProvider[]): boolean {
    try {
      writeFileSync(path.join(__dirname, 'config', 'rest-providers.config.json'), JSON.stringify(providers, null, 2));
      this.providers.next(providers);
      return true;
    } catch (e) {
      return false;
    }
  }

  private validateProvider(provider: ProviderConfig): boolean {
    return provider.name && provider.name.length > 0 && provider.apiUrl && provider.apiUrl.length > 0;
  }
}
