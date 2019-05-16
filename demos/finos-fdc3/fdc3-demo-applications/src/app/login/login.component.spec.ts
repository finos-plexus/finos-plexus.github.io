/**
 * Copyright © 2014-2019 Tick42 OOD
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Location} from '@angular/common';

import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';

import {LoginComponent} from './login.component';

import {InitializeService} from '../initialize.servise';

const username: string = 'username';
const bus: string = 'bus';

describe('Login Component', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let initService: InitializeService;
  let locationService: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        LoginComponent
      ],
      providers: [
        InitializeService,
        Location
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    initService = TestBed.get(InitializeService);
    locationService = TestBed.get(Location);
    fixture.detectChanges();
  });

  beforeAll(() => {
    window.localStorage.setItem('fdc3-demo-username', username);
    window.localStorage.setItem('fdc3-demo-bus', bus);
  });

  it('Should get username and bus from local storage', () => {
    expect(component.username).toEqual(username);
    expect(component.bus).toEqual(bus);
  });

  it('Should update username', () => {
    const newUsername: string = 'new username';
    component.onUsernameChange(newUsername);
    expect(component.username).toEqual(newUsername);
  });

  it('Should update password', () => {
    expect(component.password).toBeUndefined();
    const password: string = 'password';
    component.onPasswordChange(password);
    expect(component.password).toEqual(password);
  });

  it('Should update bus', () => {
    const newBus: string = 'new bus';
    component.onBusChange(newBus);
    expect(component.bus).toEqual(newBus);
  });

  it('Should login', () => {
    spyOn(window.localStorage, 'setItem');
    spyOn(initService, 'initializeFdc3APIImpl');
    spyOn(locationService, 'back');
    component.login();

    expect(window.localStorage.setItem).toHaveBeenCalledWith('fdc3-demo-username', component.username);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('fdc3-demo-bus', component.bus);
    expect(initService.initializeFdc3APIImpl).toHaveBeenCalled();
    expect(locationService.back).toHaveBeenCalled();
  });
});
