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

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {ElectronService} from 'ngx-electron';

import {HelperService} from '../services/helper.service';
import {InitializeService} from '../services/initialize.service';

import {ModalDialogComponent} from '../shared/modal-dialog/modal-dialog.component';

import {IApplication, ILog, IProvider} from '../app';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild('providerJSONConfigModalDialog') providerJSONConfigModalDialog: ModalDialogComponent;
  @ViewChild('deleteProviderModalDialog') deleteProviderModalDialog: ModalDialogComponent;
  public showSettings: boolean;
  public providers: IProvider[] = [];
  public apps: IApplication[] = [];
  public logs: ILog[] = [];
  public currentProvider: IProvider;
  public providerJSONConfigTitle: string;
  public providerJSONConfig: string;
  private subscriptions: Subscription[] = [];

  constructor(private electronService: ElectronService,
              private helperService: HelperService,
              private initializeService: InitializeService) {
  }

  public ngOnInit() {
    this.subscribeForShowSettings();
    this.subscribeForProviders();
    this.subscribeForApps();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * Toggle providers
   * Show apps only for enabled providers
   * @param ev: event whether the toggle button was checked or not
   * @param providerName: provider.name
   */
  public toggleProvider(ev: any, providerName: string): void {
    this.initializeService.updateProviders(providerName, ev.target.checked);
    this.initializeService.setApps();
  }

  /**
   * Show provider json config modal dialog
   * @param provider: provider
   */
  public showProviderJSONConfigModal(provider: IProvider): void {
    this.currentProvider = provider;
    this.providerJSONConfigTitle = `"${provider.name}" JSON Config`;
    this.providerJSONConfig = JSON.stringify(provider, null, 2);
    this.providerJSONConfigModalDialog.show();
    (window as any).logStream.next([`Show JSON config for provider "${provider.name}"`, 'INFO', 'Angular']);
  }

  /**
   * Show modal dialog for adding new app directory
   */
  public showNewAppDirectoryModalDialog(): void {
    this.helperService.showAppDirectoryModal.next({show: true, provider: null});
  }

  /**
   * Show modal dialog for editing app directory
   * @param provider: provider
   */
  public showEditAppDirectory(provider: IProvider): void {
    this.helperService.showAppDirectoryModal.next({show: true, provider});
  }

  /**
   * Show delete app directory modal dialog
   * @param provider: provider
   */
  public showDeleteAppDirectoryModal(provider: IProvider): void {
    this.currentProvider = provider;
    this.deleteProviderModalDialog.show();
  }

  /**
   * Delete provider
   */
  public deleteProvider(): void {
    (window as any).glue42DemoToolbar.deleteProvider(this.currentProvider);
    this.deleteProviderModalDialog.hide();
  }

  /**
   * Open provider config in new electron window
   */
  public openInNewWindow(): void {
    const preload: string = this.electronService.ipcRenderer.sendSync('get-preload-path');
    const win = new this.electronService.remote.BrowserWindow({
      width: 700,
      height: 300,
      webPreferences: {preload},
      autoHideMenuBar: true
    });
    const dirName: string = location.href.split('/').slice(0, -2).join('/');
    win.loadURL(`${dirName}/assets/provider-config.html#${this.currentProvider.name.split(' ').join('_')}`);
  }

  /**
   * Subscribe for show settings
   * Show settings is initially set to false
   */
  private subscribeForShowSettings(): void {
    this.subscriptions.push(this.helperService.showSettings.subscribe((showSettings: boolean) => {
      this.showSettings = showSettings;
      if (!showSettings) {
        this.helperService.clearLogsFilters.next(true);
      }
    }));
  }

  /**
   * Subscribe for providers
   */
  private subscribeForProviders(): void {
    this.subscriptions.push(this.initializeService.providers.subscribe((providers: IProvider[]) => {
      this.providers = providers;
    }));
  }

  /**
   * Subscribe for apps
   */
  private subscribeForApps(): void {
    this.subscriptions.push(this.initializeService.apps.subscribe((apps: IApplication[]) => {
      this.apps = apps;
    }));
  }
}
