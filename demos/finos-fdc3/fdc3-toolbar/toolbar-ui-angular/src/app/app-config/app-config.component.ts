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

import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/index';

import {InitializeService} from '../services/initialize.service';
import {HelperService} from '../services/helper.service';

import {IApplication} from '../app';

@Component({
  selector: 'app-config',
  templateUrl: './app-config.component.html'
})
export class AppConfigComponent implements OnInit, OnDestroy {
  public app: IApplication;
  public appJSONConfig: string;
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private zone: NgZone,
              private initializeService: InitializeService,
              private helperService: HelperService) {
  }

  public ngOnInit() {
    this.subscribeForApps();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * Subscribe for apps
   */
  private subscribeForApps(): void {
    this.subscriptions.push(this.initializeService.apps.subscribe((apps: IApplication[]) => {
      this.setCurrentAppConfig(apps);
    }));
  }

  /**
   * Set JSON configuration from provided url hash parameter app ID
   * @param apps: list of apps
   */
  private setCurrentAppConfig(apps: IApplication[]): void {
    this.subscriptions.push(this.route.params.subscribe((params: {id: string}) => {
      const appId: string = params.id;
      this.app = this.getApp(apps, appId);
      if (this.app) {
        this.zone.run(() => {
          this.appJSONConfig = JSON.stringify(this.helperService.getGlue42ToolbarApp(this.app), null, 2);
        });
      }
    }));
  }

  /**
   * Get app
   * @param apps: list of apps
   * @param appId: app.appId
   * @returns app
   */
  private getApp(apps: IApplication[], appId: string): IApplication {
    return apps.filter((app: IApplication) => app.appId === appId)[0];
  }
}
