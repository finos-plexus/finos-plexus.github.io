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
import {FormsModule} from '@angular/forms';
import {ClipboardModule} from 'ngx-clipboard';
import {ModalModule} from 'ngx-bootstrap';

import {ListOfAppsComponent} from './list-of-apps.component';
import {ModalDialogComponent} from '../shared/modal-dialog/modal-dialog.component';

import {ElectronService} from 'ngx-electron';
import {InitializeService} from '../services/initialize.service';
import {HelperService} from '../services/helper.service';

import {IApplication, IGlue42ToolbarApplication} from '../app';

const initApps: IApplication[] = require('../../mock-data/apps.json');

describe('List Of Apps Component', () => {
  let component: ListOfAppsComponent;
  let fixture: ComponentFixture<ListOfAppsComponent>;
  let initializeService: InitializeService;
  let helperService: HelperService;

  (window as any).process = {
    execFile: () => {},
    exec: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ClipboardModule,
        ModalModule.forRoot(),
      ],
      declarations: [
        ListOfAppsComponent,
        ModalDialogComponent
      ],
      providers: [
        ElectronService,
        InitializeService,
        HelperService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfAppsComponent);
    component = fixture.componentInstance;
    initializeService = TestBed.get(InitializeService);
    helperService = TestBed.get(HelperService);
    fixture.detectChanges();
  });

  it('Should show app config', () => {
    spyOn(component.logModalDialog, 'show');
    initializeService.apps.next(initApps);
    initializeService.apps.subscribe((apps: IApplication[]) => {
      const app: IApplication = apps[0];
      component.showAppConfig(app);
      expect(component.currentAppId).toEqual(app.appId);
      expect(component.appJSONConfigTitle).toEqual(`"${app.title}" JSON Config`);
      const tick42App: IGlue42ToolbarApplication = Object.assign({}, app);
      tick42App.manifest = JSON.parse(tick42App.manifest as string);
      delete (tick42App as IApplication).iconPath;
      delete (tick42App as IApplication).showApp;
      delete (tick42App as IApplication).isFavourite;
      expect(component.appJSONConfig).toEqual(JSON.stringify(tick42App, null, 2));
    });
  });

  it('Should Toggle Favourite apps', () => {
    spyOn(initializeService, 'updateApps');
    initializeService.apps.next(initApps);
    initializeService.apps.subscribe((apps: IApplication[]) => {
      const favApp: IApplication = apps[0];
      component.toggleFavouriteApp(favApp);
      expect(initializeService.updateApps).toHaveBeenCalledWith(favApp, 'isFavourite');
    });
  });

  it('Should update on search', () => {
    spyOn(initializeService, 'filterDisplayedApps');

    const searchValue: string = 'search value';
    component.onSearch(searchValue);
    component.searchValueChanged.subscribe((value: string) => {
      expect(value).toEqual(searchValue);
      expect(component.searchValue).toEqual(searchValue);
      expect(initializeService.filterDisplayedApps).toHaveBeenCalledWith(searchValue);
    });
  });
});
