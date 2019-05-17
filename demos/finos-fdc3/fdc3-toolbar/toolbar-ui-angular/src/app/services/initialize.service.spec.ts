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

import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ElectronService} from 'ngx-electron';
import {HelperService} from './helper.service';
import {InitializeService} from './initialize.service';

import {IApplication, IProvider} from '../app';

const initProviders: IProvider[] = require('../../mock-data/providers.json');
const initApps: IApplication[] = require('../../mock-data/apps.json');

describe('Initialize Service', () => {
  let service: InitializeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        ElectronService,
        HelperService,
        InitializeService
      ]
    });
  }));

  beforeEach(() => {
    service = TestBed.get(InitializeService);
  });

  it('Should update providers', fakeAsync(() => {
    service.init();
    tick();
    const provider = initProviders[0];
    const enabled: boolean = provider.enabled;
    service.updateProviders(provider.name, !enabled);
    service.providers.subscribe((providers: IProvider[]) => {
      const updatedProviders: IProvider[] = providers.filter((prov: IProvider) => prov.name === provider.name);
      if (updatedProviders[0]) {
        expect(updatedProviders[0].enabled).toEqual(!enabled);
      }
    });
  }));

  it('Should update apps', fakeAsync(() => {
    service.init();
    tick();
    const application = initApps[0];
    application.showApp = !application.showApp;
    service.updateApps(application, 'showApp');
    service.apps.subscribe((apps: IApplication[]) => {
      const updatedApps: IApplication[] = apps.filter((app: IApplication) => app.appId === application.appId);
      if (updatedApps[0]) {
        expect(updatedApps[0].showApp).toEqual(application.showApp);
      }
    });
  }));

  it('Should filter displayed apps', fakeAsync(() => {
    service.init();
    tick();
    const application = initApps[0];
    service.filterDisplayedApps(application.title);
    service.apps.subscribe((apps: IApplication[]) => {
      apps.forEach((app: IApplication) => {
        if (app.appId === application.appId) {
          expect(app.showApp).toBeTruthy();
        } else {
          expect(app.showApp).toBeFalsy();
        }
      });
    });
  }));
});
