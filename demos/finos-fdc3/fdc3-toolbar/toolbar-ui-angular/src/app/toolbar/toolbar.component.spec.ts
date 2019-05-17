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
import {of} from 'rxjs/index';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {AccordionModule, ModalModule} from 'ngx-bootstrap';
import {ClipboardModule} from 'ngx-clipboard';
import {ElectronService} from 'ngx-electron';

import {ToolbarComponent} from './toolbar.component';
import {ListOfAppsComponent} from '../list-of-apps/list-of-apps.component';
import {SettingsComponent} from '../settings/settings.component';
import {SettingsLogsComponent} from '../settings/logs/settings-logs.component';
import {ModalDialogComponent} from '../shared/modal-dialog/modal-dialog.component';
import {AppDirectoryFormModalComponent} from '../settings/app-directory-form-modal/app-directory-form-modal.component';

import {InitializeService} from '../services/initialize.service';
import {HelperService} from '../services/helper.service';

import {IApplication} from '../app';

describe('Toolbar Component', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let initializeService: InitializeService;
  let helperService: HelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AccordionModule.forRoot(),
        ClipboardModule,
        FormsModule,
        ModalModule.forRoot(),
        NgbModule.forRoot()
      ],
      declarations: [
        ListOfAppsComponent,
        ModalDialogComponent,
        SettingsComponent,
        SettingsLogsComponent,
        AppDirectoryFormModalComponent,
        ToolbarComponent
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
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    initializeService = TestBed.get(InitializeService);
    helperService = TestBed.get(HelperService);

    spyOn(component, 'setWindowHeight').and.callFake(() => {});

    fixture.detectChanges();
  });

  it('Should toggle view', () => {
    expect(component.showContent).toBeFalsy();
    expect(component.showSettings).toBeFalsy();

    component.toggleView();
    expect(component.showContent).toBeTruthy();
    expect(component.showSettings).toBeFalsy();
    expect(component.setWindowHeight).toHaveBeenCalled();

    component.toggleView();
    expect(component.showContent).toBeFalsy();
    expect(component.showSettings).toBeFalsy();
    expect(component.setWindowHeight).toHaveBeenCalled();
  });

  it('Should toggle settings', () => {
    expect(component.showSettings).toBeFalsy();
    expect(component.showContent).toBeFalsy();

    component.toggleSettings();
    expect(component.showSettings).toBeTruthy();
    expect(component.showContent).toBeTruthy();
    expect(component.setWindowHeight).toHaveBeenCalled();

    component.toggleSettings();
    expect(component.showContent).toBeTruthy();
    expect(component.showSettings).toBeFalsy();
  });
});
