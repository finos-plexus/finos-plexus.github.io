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
import {AccordionModule, ModalModule} from 'ngx-bootstrap';
import {ClipboardModule} from 'ngx-clipboard';
import {ElectronService} from 'ngx-electron';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {SettingsComponent} from './settings.component';
import {SettingsLogsComponent} from './logs/settings-logs.component';
import {AppDirectoryFormModalComponent} from './app-directory-form-modal/app-directory-form-modal.component';
import {ModalDialogComponent} from '../shared/modal-dialog/modal-dialog.component';

import {HelperService} from '../services/helper.service';
import {InitializeService} from '../services/initialize.service';

describe('Settings Component', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
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
        SettingsComponent,
        SettingsLogsComponent,
        AppDirectoryFormModalComponent,
        ModalDialogComponent
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
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    initializeService = TestBed.get(InitializeService);
    helperService = TestBed.get(HelperService);

    spyOn(component.providerJSONConfigModalDialog, 'show');
    spyOn(component.deleteProviderModalDialog, 'show');
    spyOn(component.deleteProviderModalDialog, 'hide');

    fixture.detectChanges();
  });

  it('Should toggle provider', fakeAsync(() => {
    spyOn(initializeService, 'updateProviders');
    spyOn(initializeService, 'setApps');
    initializeService.init();
    tick();
    initializeService.providers.subscribe(() => {
      const provider = component.providers[0];
      const event = {target: {checked: false}};
      component.toggleProvider(event, provider.name);
      expect(initializeService.updateProviders).toHaveBeenCalledWith(provider.name, event.target.checked);
      expect(initializeService.setApps).toHaveBeenCalled();
    });
  }));

  it('Should show provider json config modal dialog', fakeAsync(() => {
    initializeService.init();
    tick();
    initializeService.providers.subscribe(() => {
      const provider = component.providers[0];
      component.showProviderJSONConfigModal(provider);
      expect(component.currentProvider).toEqual(provider);
      expect(component.providerJSONConfigTitle).toEqual(`"${provider.name}" JSON Config`);
      expect(component.providerJSONConfig).toEqual(JSON.stringify(provider, null, 2));
      expect(component.providerJSONConfigModalDialog.show).toHaveBeenCalled();
    });
  }));

  it('Should show delete provider modal dialog', fakeAsync(() => {
    initializeService.init();
    tick();
    initializeService.providers.subscribe(() => {
      const provider = component.providers[0];
      component.showDeleteAppDirectoryModal(provider);
      expect(component.currentProvider).toEqual(provider);
      expect(component.deleteProviderModalDialog.show).toHaveBeenCalled();
    });
  }));

  it('Should delete provider', () => {
    spyOn((window as any).glue42DemoToolbar, 'deleteProvider');
    component.deleteProvider();
    expect((window as any).glue42DemoToolbar.deleteProvider).toHaveBeenCalled();
    expect(component.deleteProviderModalDialog.hide).toHaveBeenCalled();
  });
});
