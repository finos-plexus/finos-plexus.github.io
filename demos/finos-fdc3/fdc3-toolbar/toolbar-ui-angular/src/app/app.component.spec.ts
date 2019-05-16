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

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ElectronService} from 'ngx-electron';
import {of} from 'rxjs';

import {AppComponent} from './app.component';
import {InitializeService} from './services/initialize.service';
import {HelperService} from './services/helper.service';
import {IGlue42ToolbarProvider, IApplication} from './app';

const applications: IApplication[] = require('../mock-data/apps.json');
const providers: IGlue42ToolbarProvider[] = require('../mock-data/providers.json');

describe('App Component', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let initializeService: InitializeService;

  const mockProviders: IGlue42ToolbarProvider[] = providers.map((provider: IGlue42ToolbarProvider) => {
    provider.getApps = () => new Promise((resolve) =>
      resolve(applications.filter((app: IApplication) => app.provider.name === provider.name)));
    return provider;
  });
  (window as any).glue42DemoToolbar = {
    addProvider: () => {},
    updateProvider: () => {},
    deleteProvider: () => {},
    providers: {
      subscribe: (fn) => of(fn(mockProviders))
    }
  };
  (window as any).logStream = {
    subscribe: (fn) => of(fn([])),
    next: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        ElectronService,
        HelperService,
        InitializeService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    initializeService = TestBed.get(InitializeService);
    spyOn(initializeService, 'init');
    fixture.detectChanges();
  });

  it('Should initialize', () => {
    expect(initializeService.init).toHaveBeenCalled();
  });
});
