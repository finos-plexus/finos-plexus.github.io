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
import {RouterTestingModule} from '@angular/router/testing';
import {NgxLoadingModule} from 'ngx-loading';
import {FormsModule} from '@angular/forms';

import {Context, DesktopAgent} from 'com-glue42-finos-fdc3-api-impl';

import {TradeTicketComponent} from './trade-ticket.component';

import {InitializeService} from '../initialize.servise';

import {fdc3Impl, instrument} from '../mock-data';

(window as any).desktopJS = {
  resolveContainer: () => {}
};

describe('Trade Ticket Component', () => {
  let component: TradeTicketComponent;
  let fixture: ComponentFixture<TradeTicketComponent>;
  let service: InitializeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NgxLoadingModule.forRoot({}),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        TradeTicketComponent
      ],
      providers: [
        InitializeService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeTicketComponent);
    component = fixture.componentInstance;
    service = TestBed.get(InitializeService);
    fixture.detectChanges();
  });

  beforeEach(() => {
    service.fdc3ApiImpl.next(fdc3Impl as DesktopAgent);
    fixture.detectChanges();
  });

  it('Should initialize FDC3 Implementation', () => {
    expect(component.loading).toBeFalsy();
  });

  it('Should subscribe for context', () => {
    spyOn(component, 'onContextChange');
    const context: Context = { type: 'fdc3-context' };
    service.context.next(context);
    fixture.detectChanges();

    expect(component.onContextChange).toHaveBeenCalledWith(context);
  });

  it('Should close on context change', () => {
    spyOn(component, 'closeWindow');
    component.onContextChange({ type: 'close-window' });
    expect(component.closeWindow).toHaveBeenCalled();
  });

  it('Should subscribe for instrument', () => {
    spyOn(component, 'setInstrument');
    service.instrument.next(instrument);
    fixture.detectChanges();

    expect(component.setInstrument).toHaveBeenCalledWith(instrument);
  });

  it('Should set instrument', () => {
    component.setInstrument(instrument);

    expect(component.selectedInstrument).toEqual(instrument.description);
    expect(component.isInstrumentSelected).toBeTruthy();
    expect(component.finalInstrumentPrice).not.toBeUndefined();
  });

  it('Should calculate price', () => {
    component.setInstrument(instrument);
    const initPrice: string = component.finalInstrumentPrice;
    const event = { target: { value: '2' } };
    component.calculatePrice(event);
    fixture.detectChanges();

    const price: number = parseInt(initPrice, 10) * 2;
    expect(component.finalInstrumentPrice).toEqual(price.toString());
  });
});
