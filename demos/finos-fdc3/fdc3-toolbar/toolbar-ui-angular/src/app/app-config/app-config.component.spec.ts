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

import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRoute, Params} from '@angular/router';
import {ElectronService} from 'ngx-electron';

import {AppConfigComponent} from './app-config.component';

import {InitializeService} from '../services/initialize.service';
import {HelperService} from '../services/helper.service';

import {IApplication} from '../app';

const initApps: IApplication[] = require('../../mock-data/apps.json');
const applications: IApplication[] = require('../../mock-data/apps.json');
const appId: string = applications[0].appId;

describe('App Config Component', () => {
  let component: AppConfigComponent;
  let fixture: ComponentFixture<AppConfigComponent>;
  let initializeService: InitializeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        AppConfigComponent
      ],
      providers: [
        ElectronService,
        HelperService,
        InitializeService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: {
              subscribe: (fn: (value: Params) => void) => fn({id: appId}),
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppConfigComponent);
    component = fixture.componentInstance;
    initializeService = TestBed.get(InitializeService);
    fixture.detectChanges();
  });

  it('Should subscribe for apps', () => {
    initializeService.apps.next(initApps);
    initializeService.apps.subscribe(() => {
      expect(component.app.appId).toEqual(appId);
    });
  });
});
