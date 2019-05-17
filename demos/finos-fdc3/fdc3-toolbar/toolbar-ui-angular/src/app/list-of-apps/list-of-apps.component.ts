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

import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {ElectronService} from 'ngx-electron';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

import {InitializeService} from '../services/initialize.service';
import {HelperService} from '../services/helper.service';

import {ModalDialogComponent} from '../shared/modal-dialog/modal-dialog.component';

import {IApplication, IGlue42ToolbarApplication} from '../app';

@Component({
  selector: 'app-list-of-apps',
  templateUrl: './list-of-apps.component.html'
})
export class ListOfAppsComponent implements OnInit, OnDestroy {
  @ViewChild('logModalDialog') logModalDialog: ModalDialogComponent;
  @ViewChild('appStartErrorModalDialog') appStartErrorModalDialog: ModalDialogComponent;
  public apps: IApplication[] = [];
  public currentAppId: string;
  public appJSONConfigTitle: string;
  public appJSONConfig: string;
  public showContent: boolean;
  public showSettings: boolean;
  public searchValue: string;
  public searchValueChanged: Subject<string> = new Subject<string>();
  public appStartErrorTitle: string;
  public appStartErrorMessage: string;
  private subscriptions: Subscription[] = [];

  constructor(private electronService: ElectronService,
              private initializeService: InitializeService,
              private helperService: HelperService,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.subscribeForApps();
    this.subscribeForShowContent();
    this.subscribeForShowSettings();
    this.subscribeForSearchChanges();
    this.subscribeForAppStartFail();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * Start App
   * @param app: app
   */
  public startApp(app: IApplication): void {
    app.start();
  }

  /**
   * Show app configuration
   * @param app: app
   */
  public showAppConfig(app: IApplication): void {
    this.currentAppId = app.appId;
    this.appJSONConfigTitle = `"${app.title}" JSON Config`;
    this.appJSONConfig = this.getAppJSONConfig(app);
    this.logModalDialog.show();
    (window as any).logStream.next([`Show JSON config for app "${app.title || app.name}"`, 'INFO', 'Angular']);
}

  /**
   * Toggle favourite app in the navbar
   * @param app: app
   */
  public toggleFavouriteApp(favouriteApp: IApplication): void {
    favouriteApp.isFavourite = !favouriteApp.isFavourite;
    this.initializeService.updateApps(favouriteApp, 'isFavourite');
  }

  /**
   * Open app JSON config in new Electron window
   */
  public openInNewWindow(): void {
    const preload: string = this.electronService.ipcRenderer.sendSync('get-preload-path');
    const win = new this.electronService.remote.BrowserWindow({
      width: 700,
      height: 800,
      webPreferences: {preload},
      autoHideMenuBar: true
    });
    const dirName: string = location.href.split('/').slice(0, -2).join('/');
    win.loadURL(`${dirName}/assets/app-config.html#${this.currentAppId}`);
  }

  /**
   * Update filter value on change
   * @param text: filter input value
   */
  public onSearch(text: string): void {
    this.searchValueChanged.next(text);
  }

  /**
   * Get app JSON config
   * @param app: app
   * @returns string: the app JSON config
   */
  private getAppJSONConfig(app: IApplication): string {
    const tick42App: IGlue42ToolbarApplication = this.helperService.getGlue42ToolbarApp(app);
    tick42App.manifest = JSON.parse(tick42App.manifest as string);
    return JSON.stringify(tick42App, null, 2);
  }

  /**
   * Subscribe for apps
   * Display them alphabetically
   */
  private subscribeForApps(): void {
    this.subscriptions.push(this.initializeService.apps.subscribe((apps: IApplication[]) => {
      this.zone.run(() => {
        const filteredApp: IApplication[] = apps.filter((app: IApplication) => app.showApp);
        this.apps = this.helperService.sortArrayAlphabeticallyByKey(filteredApp, 'title');
      });
    }));
  }

  /**
   * Subscribe for show content
   * The content of the app is the list of apps or the settings
   * Show content is initially set to false
   */
  private subscribeForShowContent(): void {
    this.subscriptions.push(this.helperService.showContent.subscribe((showContent: boolean) => {
      this.showContent = showContent;
    }));
  }

  /**
   * Subscribe for show settings
   * Show settings is initially set to false
   */
  private subscribeForShowSettings(): void {
    this.subscriptions.push(this.helperService.showSettings.subscribe((showSettings: boolean) => {
      this.showSettings = showSettings;
    }));
  }

  /**
   * Subscribe for search change
   * Filter the displayed apps depending on the search value
   */
  private subscribeForSearchChanges(): void {
    this.searchValueChanged
      .pipe(debounceTime(300))
      .subscribe((searchValue: string) => {
        this.searchValue = searchValue;
        this.initializeService.filterDisplayedApps(searchValue);
      });
  }

  /**
   * Subscribe for app start fail
   * If app start fails, show modal dialog
   */
  private subscribeForAppStartFail(): void {
    this.subscriptions.push(this.helperService.appStartFail.subscribe((args: {startApp: IApplication, message: string}) => {
      this.showAppStartFailModal(...(Object.values(args) as any[]));
    }));
  }

  /**
   * Show app start fail modal dialog
   * @param startApp: app
   * @param message: message to be displayed
   */
  private showAppStartFailModal(startApp?: IApplication, message?: string): void {
    this.appStartErrorTitle = `Failed to start ${startApp.title || startApp.name}`;
    this.appStartErrorMessage = message;
    this.appStartErrorModalDialog.show();
  }
}
