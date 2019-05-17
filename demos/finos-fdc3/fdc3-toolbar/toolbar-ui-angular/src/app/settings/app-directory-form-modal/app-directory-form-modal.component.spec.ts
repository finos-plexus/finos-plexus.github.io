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
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalModule} from 'ngx-bootstrap';
import {ElectronService} from 'ngx-electron';

import {AppDirectoryFormModalComponent} from './app-directory-form-modal.component';
import {ModalDialogComponent} from '../../shared/modal-dialog/modal-dialog.component';

import {HelperService} from '../../services/helper.service';
import {InitializeService} from '../../services/initialize.service';

import {IProvider, IGlue42ToolbarProvider} from '../../app';

describe('App Directory Form Modal Component', () => {
  let component: AppDirectoryFormModalComponent;
  let fixture: ComponentFixture<AppDirectoryFormModalComponent>;
  let initializeService: InitializeService;
  let helperService: HelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ModalModule.forRoot(),
        NgbModule.forRoot()
      ],
      declarations: [
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
    fixture = TestBed.createComponent(AppDirectoryFormModalComponent);
    component = fixture.componentInstance;
    initializeService = TestBed.get(InitializeService);
    helperService = TestBed.get(HelperService);

    spyOn(component.newAppDirectoryModalDialog, 'show');
    spyOn(component.newAppDirectoryModalDialog, 'hide');

    fixture.detectChanges();
  });

  it('Should validate app directory name', () => {
    expect(component.isAppDirectoryNameValid).toBeTruthy();
    let appDirectoryName: string = 'test';
    component.name = appDirectoryName;
    expect(component._name).toEqual(appDirectoryName);
    expect(component.isAppDirectoryNameValid).toBeTruthy();

    appDirectoryName = '';
    component.name = appDirectoryName;
    expect(component._name).toEqual(appDirectoryName);
    expect(component.isAppDirectoryNameValid).toBeFalsy();
  });

  it('Should validate api url', () => {
    expect(component.isApiURLValid).toBeTruthy();
    let apiUrl: string = 'http://localhost:9875';
    component.apiURL = apiUrl;
    expect(component._apiURL).toEqual(apiUrl);
    expect(component.isApiURLValid).toBeTruthy();

    apiUrl = '';
    component.apiURL = apiUrl;
    expect(component._apiURL).toEqual(apiUrl);
    expect(component.isApiURLValid).toBeFalsy();

    apiUrl = 'apiUrl';
    component.apiURL = apiUrl;
    expect(component._apiURL).toEqual(apiUrl);
    expect(component.isApiURLValid).toBeFalsy();
  });

  it('Should validate auth url', () => {
    expect(component.isAuthURLValid).toBeTruthy();
    let authUrl: string = 'http://localhost:9875';
    component.authURL = authUrl;
    expect(component._authURL).toEqual(authUrl);
    expect(component.isAuthURLValid).toBeTruthy();

    authUrl = '';
    component.authURL = authUrl;
    expect(component._authURL).toEqual(authUrl);
    expect(component.isAuthURLValid).toBeTruthy();

    authUrl = 'authUrl';
    component.authURL = authUrl;
    expect(component._authURL).toEqual(authUrl);
    expect(component.isAuthURLValid).toBeFalsy();
  });

  it('Should validate email', () => {
    expect(component.isEmailValid).toBeTruthy();
    let email: string = 'mail@mail.com';
    component.email = email;
    expect(component._email).toEqual(email);
    expect(component.isEmailValid).toBeTruthy();

    email = '';
    component.email = email;
    expect(component._email).toEqual(email);
    expect(component.isEmailValid).toBeTruthy();

    email = 'email';
    component.email = email;
    expect(component._email).toEqual(email);
    expect(component.isEmailValid).toBeFalsy();
  });

  it('Should validate password', () => {
    expect(component.isPasswordSet).toBeTruthy();
    component.email = '';
    let password: string = 'password';
    component.password = password;
    expect(component._password).toEqual(password);
    expect(component.isPasswordSet).toBeTruthy();

    component.email = 'mail@mail.com';
    password = '';
    component.password = password;
    expect(component._password).toEqual(password);
    expect(component.isPasswordSet).toBeFalsy();

    component.email = 'mail@mail.com';
    password = 'password';
    component.password = password;
    expect(component._password).toEqual(password);
    expect(component.isPasswordSet).toBeTruthy();
  });

  it('Should toggle create and edit buttons on form change', () => {
    expect(component.enableCreateBtn).toBeFalsy();
    expect(component.enableEditBtn).toBeFalsy();

    component.isAppDirectoryNameValid = false;
    component.isApiURLValid = true;
    component.isAuthURLValid = true;
    component.isEmailValid = true;
    component.isPasswordSet = true;
    component.toggleButtons();
    expect(component.enableCreateBtn).toBeFalsy();
    expect(component.enableEditBtn).toBeFalsy();

    component.isAppDirectoryNameValid = true;
    component.isApiURLValid = false;
    component.isAuthURLValid = true;
    component.isEmailValid = true;
    component.isPasswordSet = true;
    component.toggleButtons();
    expect(component.enableCreateBtn).toBeFalsy();
    expect(component.enableEditBtn).toBeFalsy();

    component.isAppDirectoryNameValid = true;
    component.isApiURLValid = true;
    component.isAuthURLValid = false;
    component.isEmailValid = true;
    component.isPasswordSet = true;
    component.toggleButtons();
    expect(component.enableCreateBtn).toBeFalsy();
    expect(component.enableEditBtn).toBeFalsy();

    component.isAppDirectoryNameValid = true;
    component.isApiURLValid = true;
    component.isAuthURLValid = true;
    component.isEmailValid = false;
    component.isPasswordSet = true;
    component.toggleButtons();
    expect(component.enableCreateBtn).toBeFalsy();
    expect(component.enableEditBtn).toBeFalsy();

    component.isAppDirectoryNameValid = true;
    component.isApiURLValid = true;
    component.isAuthURLValid = true;
    component.isEmailValid = true;
    component.isPasswordSet = false;
    component.toggleButtons();
    expect(component.enableCreateBtn).toBeFalsy();
    expect(component.enableEditBtn).toBeFalsy();

    component.isAppDirectoryNameValid = true;
    component.isApiURLValid = true;
    component.isAuthURLValid = true;
    component.isEmailValid = true;
    component.isPasswordSet = true;
    component.toggleButtons();
    expect(component.enableCreateBtn).toBeTruthy();
    expect(component.enableEditBtn).toBeTruthy();
  });

  it('Should show new app directory modal dialog', () => {
    helperService.showAppDirectoryModal.next({show: true, provider: null});
    helperService.showAppDirectoryModal.subscribe(() => {
      expect(component.isAddAppDirectoryModalOpened).toBeTruthy();
      expect(component.newAppDirectoryModalDialogTitle).toEqual('Create New App Directory');
      expect(component._name).toEqual('');
      expect(component._apiURL).toEqual('');
      expect(component._authURL).toEqual('');
      expect(component._email).toEqual('');
      expect(component._password).toEqual('');
      expect(component.isAppDirectoryNameValid).toBeTruthy();
      expect(component.isApiURLValid).toBeTruthy();
      expect(component.enableCreateBtn).toBeFalsy();
      expect(component.newAppDirectoryModalDialog.show).toHaveBeenCalled();
    });
  });

  it('Should show edit app directory modal dialog', fakeAsync(() => {
    initializeService.init();
    tick();
    initializeService.providers.subscribe(() => {
      const provider: IProvider = component.providers[0];
      helperService.showAppDirectoryModal.next({show: true, provider});
      helperService.showAppDirectoryModal.subscribe(() => {
        expect(component.isAddAppDirectoryModalOpened).toBeFalsy();
        expect(component.editedProviderName).toEqual(provider.name);
        expect(component.newAppDirectoryModalDialogTitle).toEqual('Edit App Directory');
        expect(component._name).toEqual(provider.name);
        expect(component._apiURL).toEqual(provider.apiUrl);
        expect(component._authURL).toEqual(provider.authUrl);
        expect(component._email).toEqual(provider.email);
        expect(component._password).toEqual(provider.password);
        expect(component.isAppDirectoryNameValid).toBeTruthy();
        expect(component.isApiURLValid).toBeTruthy();
        expect(component.enableEditBtn).toBeTruthy();
        expect(component.newAppDirectoryModalDialog.show).toHaveBeenCalled();
      });
    });
  }));

  it('Should create app directory', () => {
    spyOn((window as any).glue42DemoToolbar, 'addProvider');
    component.name = 'test';
    component.apiURL = 'http://localhost:9875';
    component.createAppDirectory();
    const providerData: IGlue42ToolbarProvider = {
      name: component.name,
      apiUrl: component.apiURL,
      authUrl: component.authURL,
      email: component.email,
      password: component.password
    };
    expect((window as any).glue42DemoToolbar.addProvider).toHaveBeenCalledWith(providerData);
    expect(component.newAppDirectoryModalDialog.hide).toHaveBeenCalled();
  });

  it('Should edit app directory', fakeAsync(() => {
    spyOn((window as any).glue42DemoToolbar, 'updateProvider');
    component.name = 'test';
    component.apiURL = 'http://localhost:9875';
    initializeService.init();
    tick();
    initializeService.providers.subscribe(() => {
      const editedProvider: IProvider = component.providers[0];
      component.editedProviderName = editedProvider.name;
      const providerData: IGlue42ToolbarProvider = {
        name: component.name,
        apiUrl: component.apiURL,
        authUrl: component.authURL,
        email: component.email,
        password: component.password
      };
      component.editAppDirectory();
      expect((window as any).glue42DemoToolbar.updateProvider).toHaveBeenCalledWith(editedProvider, providerData);
      expect(component.newAppDirectoryModalDialog.hide).toHaveBeenCalled();
    });
  }));
});
