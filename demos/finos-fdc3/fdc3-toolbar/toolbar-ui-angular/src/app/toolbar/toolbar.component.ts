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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {ElectronService} from 'ngx-electron';

import {InitializeService} from '../services/initialize.service';
import {HelperService} from '../services/helper.service';

import {IApplication} from '../app';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent implements OnInit, OnDestroy {
  public favouriteApps: IApplication[] = [];
  public showContent: boolean = false;
  public showSettings: boolean = false;
  private subscriptions: Subscription[] = [];
  private minHeight: number = 100;
  private maxHeight: number = 900;

  constructor(private initializeService: InitializeService,
              private electronService: ElectronService,
              private helperService: HelperService) {
  }

  public ngOnInit() {
    this.subscribeForApps();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * Toggle view
   * Toggle the window height to see only the navbar or show the whole content
   */
  public toggleView(): void {
    this.showContent = !this.showContent;
    this.helperService.showContent.next(this.showContent);
    this.showSettings = false;
    this.helperService.showSettings.next(this.showSettings);
    const height: number = this.showContent ? this.maxHeight : this.minHeight;
    this.setWindowHeight(height);
  }

  /**
   * Toggle settings
   * If the content is not visible, it will expand the window height and show the settings
   */
  public toggleSettings(): void {
    this.showSettings = !this.showSettings;
    this.helperService.showSettings.next(this.showSettings);
    if (!this.showContent) {
      this.showContent = !this.showContent;
      this.helperService.showContent.next(this.showContent);
      this.setWindowHeight(this.maxHeight);
    }
  }

  /**
   * Start App
   * @param ap  p: app
   */
  public startApp(app: IApplication): void {
    app.start();
  }

  /**
   * Set window height
   * @param height: window height
   */
  public setWindowHeight(height: number): void {
    const myWindow: any = this.electronService.remote.getCurrentWindow();
    const {width, x, y} = myWindow.getBounds();
    myWindow.setBounds({width, height, x, y});
  }

  /**
   * Subscribe for apps
   * Filter only the favourite ones
   */
  private subscribeForApps(): void {
    this.subscriptions.push(this.initializeService.apps.subscribe((apps: IApplication[]) => {
      this.favouriteApps = apps.filter((app: IApplication) => app.isFavourite);
    }));
  }
}
