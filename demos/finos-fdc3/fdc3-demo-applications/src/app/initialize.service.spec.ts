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

import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { InitializeService } from './initialize.servise';

import { CONSTANTS } from './app.constants';
import { IApplication } from './app';

describe('Initialize Service', () => {
  let service: InitializeService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        InitializeService
      ]
    });
  }));

  beforeEach(() => {
    service = TestBed.get(InitializeService);
    router = TestBed.get(Router);
  });

  it('Should initialize FDC3 Implementation if bus name is set', () => {
    spyOn(service, 'isCurrentWindowGlue').and.callFake(() => {
      return true;
    });
    spyOn(service, 'init');
    service.initializeFdc3APIImpl();

    expect(service.isCurrentWindowGlue).toHaveBeenCalled();
    expect(service.init).toHaveBeenCalled();
  });

  it('Should go to login page if bus name is not set', () => {
    spyOn(router, 'navigate');
    service.initializeFdc3APIImpl();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('Should get bus name', () => {
    spyOn(service, 'isCurrentWindowGlue').and.callFake(() => {
      return true;
    });
    service.initializeFdc3APIImpl();
    expect(service.getBusName()).toEqual('Glue42');
  });

  describe('Should get application name', () => {
    it('instrument-list-glue42', () => {
      spyOn(service, 'getCurrentUrl').and.returnValue(CONSTANTS.appNames.instrumentList);
      service.isGlueWindow = true;
      expect(service.getApplicationName()).toEqual('instrument-list-glue42');
    });

    it('instrument-list-web', () => {
      spyOn(service, 'getCurrentUrl').and.returnValue(CONSTANTS.appNames.instrumentList);
      service.isGlueWindow = false;
      expect(service.getApplicationName()).toEqual('instrument-list-web');
    });

    it('instrument-price-chart-context-glue42', () => {
      spyOn(service, 'getCurrentUrl').and.returnValue(CONSTANTS.appNames.instrumentPriceChartContext);
      service.isGlueWindow = true;
      expect(service.getApplicationName()).toEqual('instrument-price-chart-context-glue42');
    });

    it('instrument-price-chart-context-web', () => {
      spyOn(service, 'getCurrentUrl').and.returnValue(CONSTANTS.appNames.instrumentPriceChartContext);
      service.isGlueWindow = false;
      expect(service.getApplicationName()).toEqual('instrument-price-chart-context-web');
    });

    it('instrument-price-chart-intent-glue42', () => {
      spyOn(service, 'getCurrentUrl').and.returnValue(CONSTANTS.appNames.instrumentPriceChartIntent);
      service.isGlueWindow = true;
      expect(service.getApplicationName()).toEqual('instrument-price-chart-intent-glue42');
    });

    it('instrument-price-chart-intent-web', () => {
      spyOn(service, 'getCurrentUrl').and.returnValue(CONSTANTS.appNames.instrumentPriceChartIntent);
      service.isGlueWindow = false;
      expect(service.getApplicationName()).toEqual('instrument-price-chart-intent-web');
    });

    it('trade-ticket-glue42', () => {
      spyOn(service, 'getCurrentUrl').and.returnValue(CONSTANTS.appNames.tradeTicket);
      service.isGlueWindow = true;
      expect(service.getApplicationName()).toEqual('trade-ticket-glue42');
    });

    it('trade-ticket-web', () => {
      spyOn(service, 'getCurrentUrl').and.returnValue(CONSTANTS.appNames.tradeTicket);
      service.isGlueWindow = false;
      expect(service.getApplicationName()).toEqual('trade-ticket-web');
    });

    it('default', () => {
      expect(service.getApplicationName()).toEqual('fdc3-demo-app');
    });
  });

  it('Should get application', () => {
    spyOn(service, 'getCurrentUrl').and.returnValue(CONSTANTS.appNames.instrumentList);
    service.isGlueWindow = false;
    const app: IApplication = {
      appId: 'instrument-list-web',
      name: 'instrument-list-web',
      manifest: '',
      manifestType: ''
    };
    expect(service.getApplication()).toEqual(app);
  });
});
