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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxLoadingModule } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Context, DesktopAgent } from 'com-glue42-finos-fdc3-api-impl';

import { InstrumentListComponent } from './instrument-list.component';

import { InitializeService } from '../initialize.servise';

import { fdc3Impl, instrument } from '../mock-data';
import { CONSTANTS } from '../app.constants';
import { IInstrument } from '../app';

const instrumentList = require('../../assets/instruments.json');

describe('Instrument List Component', () => {
  let component: InstrumentListComponent;
  let fixture: ComponentFixture<InstrumentListComponent>;
  let service: InitializeService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxLoadingModule.forRoot({}),
        NgbModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        InstrumentListComponent
      ],
      providers: [
        InitializeService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentListComponent);
    component = fixture.componentInstance;
    service = TestBed.get(InitializeService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  beforeEach(() => {
    service.fdc3ApiImpl.next(fdc3Impl as DesktopAgent);
    fixture.detectChanges();
  });

  it('Should initialize FDC3 Implementation', () => {
    expect(component.loading).toBeFalsy();
  });

  it('Should set instrument list alphabetically', () => {
    const firstInstrument: IInstrument = instrumentList
      .find((instr: IInstrument) => instr.description === 'Anthem Inc');
    const lastInstrument: IInstrument = instrumentList
      .find((instr: IInstrument) => instr.description === 'Twitter Inc');
    expect(component.instruments[0].ric).toEqual(firstInstrument.ric);
    expect(component.instruments[component.instruments.length - 1].ric).toEqual(lastInstrument.ric);
    expect(component.instruments.length).toEqual(instrumentList.length);
  });

  it('Should not broadcast if FDC3 Implementation is not initialized', () => {
    spyOn(component.fdc3PlatformApi, 'invoke');
    const context: Context = {
      type: 'fdc3.instrument',
      id: instrument
    };
    component.broadcast(instrument);

    expect(component.fdc3PlatformApi.invoke).toHaveBeenCalledWith(CONSTANTS.fullMethodNames.broadcast, context);
  });

  it('Should go to login page', () => {
    spyOn(router, 'navigate');
    component.goToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
