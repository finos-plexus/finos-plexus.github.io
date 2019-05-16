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

import {SettingsLogsComponent} from './settings-logs.component';

import {ElectronService} from 'ngx-electron';
import {HelperService} from '../../services/helper.service';

import {ILog} from '../../app';

const initialLogs: ILog[] = require('../../../mock-data/logs.json');

describe('Settings Logs Component', () => {
  let component: SettingsLogsComponent;
  let fixture: ComponentFixture<SettingsLogsComponent>;
  let helperService: HelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SettingsLogsComponent
      ],
      providers: [
        ElectronService,
        HelperService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLogsComponent);
    component = fixture.componentInstance;
    helperService = TestBed.get(HelperService);
    fixture.detectChanges();
  });

  it('Should toggle sorting', () => {
    helperService.logs.next(initialLogs);
    helperService.logs.subscribe((logs: ILog[]) => {
      component.toggleSorting();
      expect(component.logs[0].origin).toEqual('Angular');
      component.toggleSorting();
      expect(component.logs[0].origin).toEqual('Electron');
    });
  });

  it('Should hide type options on origin filter checked', () => {
    const event = {target: {value: 'origin'}};
    component.onFilterByChange(event);
    expect(component.showFilterByOriginOptions).toBeTruthy();
    expect(component.showFilterByTypeOptions).toBeFalsy();
  });

  it('Should hide origin options on type filter checked', () => {
    const event = {target: {value: 'type'}};
    component.onFilterByChange(event);
    expect(component.showFilterByOriginOptions).toBeFalsy();
    expect(component.showFilterByTypeOptions).toBeTruthy();
  });

  it('Should filter logs by origin', () => {
    const filterValue: string = 'electron';
    helperService.logs.next(initialLogs);
    helperService.logs.subscribe(() => {
      component.showFilterByOriginOptions = true;
      const event = {target: {checked: true, value: filterValue}};
      component.filterLogs(event);

      component.logs.forEach((log: ILog) => {
        if (log.origin.toLowerCase() === filterValue) {
          expect(log.show).toBeTruthy();
        } else {
          expect(log.show).toBeFalsy();
        }
      });
    });
  });

  it('Should filter logs by type', () => {
    const filterValue: string = 'info';
    helperService.logs.next(initialLogs);
    helperService.logs.subscribe(() => {
      component.showFilterByTypeOptions = true;
      const event = {target: {checked: true, value: filterValue}};
      component.filterLogs(event);

      component.logs.forEach((log: ILog) => {
        if (log.type.toLowerCase() === filterValue) {
          expect(log.show).toBeTruthy();
        } else {
          expect(log.show).toBeFalsy();
        }
      });
    });
  });

  it('Should clear origin filters', () => {
    const filterValue: string = 'electron';
    helperService.logs.next(initialLogs);
    helperService.logs.subscribe(() => {
      component.showFilterByOriginOptions = true;
      const event = {target: {checked: true, value: filterValue}};
      component.filterLogs(event);

      const clearEvent = {target: {checked: false, value: filterValue}};
      component.filterLogs(clearEvent);
      component.logs.forEach((log: ILog) => {
        expect(log.show).toBeTruthy();
      });
    });
  });

  it('Should clear type filters', () => {
    const filterValue: string = 'info';
    helperService.logs.next(initialLogs);
    helperService.logs.subscribe(() => {
      component.showFilterByTypeOptions = true;
      const event = {target: {checked: true, value: filterValue}};
      component.filterLogs(event);

      const clearEvent = {target: {checked: false, value: filterValue}};
      component.filterLogs(clearEvent);
      component.logs.forEach((log: ILog) => {
        expect(log.show).toBeTruthy();
      });
    });
  });
});
