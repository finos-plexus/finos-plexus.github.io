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
import {NgxLoadingModule} from 'ngx-loading';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {Context, DesktopAgent} from 'com-glue42-finos-fdc3-api-impl';

import {InstrumentPriceChartComponent} from './instrument-price-chart.component';

import {InitializeService} from '../initialize.servise';

import {fdc3Impl, instrument} from '../mock-data';

(window as any).desktopJS = {
  resolveContainer: () => {}
};

describe('Instrument Price Chart Component', () => {
  let component: InstrumentPriceChartComponent;
  let fixture: ComponentFixture<InstrumentPriceChartComponent>;
  let service: InitializeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxLoadingModule.forRoot({}),
        NgbModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        InstrumentPriceChartComponent
      ],
      providers: [
        InitializeService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentPriceChartComponent);
    component = fixture.componentInstance;
    service = TestBed.get(InitializeService);
    fixture.detectChanges();
  });

  beforeEach(() => {
    service.fdc3ApiImpl.next(fdc3Impl as DesktopAgent);
    fixture.detectChanges();
  });

  afterEach(() => {
    component.isChartWithContext = false;
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

  it('Should subscribe for instrument if is not chart with context', () => {
    spyOn(component, 'updateChart');
    component.isChartWithContext = true;
    service.instrument.next(instrument);
    fixture.detectChanges();

    expect(component.updateChart).not.toHaveBeenCalledWith(instrument);
  });

  it('Should not subscribe for instrument if is chart with context', () => {
    spyOn(component, 'updateChart');
    component.isChartWithContext = false;
    service.instrument.next(instrument);
    fixture.detectChanges();

    expect(component.updateChart).toHaveBeenCalledWith(instrument);
  });

  it('Should update chart', () => {
    component.updateChart(instrument);
    expect(component.selectedInstrument).toEqual(instrument.description);
    expect(component.isInstrumentSelected).toBeTruthy();
  });
});
