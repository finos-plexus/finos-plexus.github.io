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

import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ElectronService} from 'ngx-electron';

import {HelperService} from './helper.service';

import {IApplication, ILog} from '../app';
import {InitializeService} from './initialize.service';

const applications: IApplication[] = require('../../mock-data/apps.json');

describe('Helper Service', () => {
  let service: HelperService;
  let initializeService: InitializeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        ElectronService,
        HelperService,
        InitializeService
      ]
    });
  }));

  beforeEach(() => {
    service = TestBed.get(HelperService);
    initializeService = TestBed.get(InitializeService);
  });

  it('Should sort array alphabetically', () => {
    const apps: IApplication[] = applications;
    expect(apps[0].title).toEqual('Client Contact');
    expect(apps[1].title).toEqual('Glue42 Website');
    expect(apps[2].title).toEqual('Excel');
    const sortedArrey = service.sortArrayAlphabeticallyByKey(apps, 'title');
    expect(sortedArrey[0].title).toEqual('Client Contact');
    expect(sortedArrey[1].title).toEqual('Excel');
    expect(sortedArrey[2].title).toEqual('Glue42 Website');
  });

  it('Should add logs', () => {
    const log = {timestamp: Date.now(), type: 'type', origin: 'origin', message: 'message'};
    service.addLog(log.timestamp, log.type, log.origin, log.message);
    service.logs.subscribe((logs: ILog[]) => {
      expect(logs.length).toEqual(1);
      expect(logs[0].timestamp).toEqual(log.timestamp);
      expect(logs[0].type).toEqual(log.type);
      expect(logs[0].origin).toEqual(log.origin);
      expect(logs[0].message).toEqual(log.message);
    });
  });

  it('Should convert apps to Tick42Apps', fakeAsync(() => {
    initializeService.init();
    tick();
    initializeService.apps.subscribe((apps: IApplication[]) => {
      const tick42App = service.getGlue42ToolbarApp(apps[0]);
      expect((tick42App as IApplication).iconPath).toBeUndefined();
      expect((tick42App as IApplication).showApp).toBeUndefined();
      expect((tick42App as IApplication).isFavourite).toBeUndefined();
    });
  }));
});
