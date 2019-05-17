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

import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs/index';
import {ElectronService} from 'ngx-electron';

import {IApplication, IApplicationManifest, ILog, IProvider, IGlue42ToolbarApplication} from '../app';

@Injectable()
export class HelperService {
  public showSettings: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showContent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public appStartFail: Subject<{startApp: IApplication, message: string}> =
    new Subject<{startApp: IApplication, message: string}>();
  public showAppDirectoryModal: Subject<{show: boolean, provider?: IProvider}> =
    new Subject<{show: boolean, provider?: IProvider}>();
  public logs: BehaviorSubject<ILog[]> = new BehaviorSubject<ILog[]>([]);
  public clearLogsFilters: Subject<boolean> = new Subject<boolean>();
  private innerLogs: ILog[] = [];

  constructor(private electronService: ElectronService) {
  }

  /**
   * Sort array of apps alphabetically
   * @param apps: array of apps
   * @param key: key to sort by
   * @returns IApplication[]: array of apps
   */
  public sortArrayAlphabeticallyByKey(apps: IApplication[], key: string): IApplication[] {
    return apps.sort((a: IApplication, b: IApplication) => {
      const nameA: string = a[key].toUpperCase();
      const nameB: string = b[key].toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  /**
   * Add log to the list of displayed logs
   * @param timestamp: timestamp from log creation
   * @param type: 'INFO' | 'WARNING' | 'ERROR'
   * @param origin: 'Angular' | 'Electron' | 'Toolbar'
   * @param message: log message
   */
  public addLog(timestamp: number, type: string, origin: string, message: string): void {
    this.innerLogs.unshift({timestamp, type, origin, message, show: true});
    this.logs.next(this.innerLogs);
  }

  /**
   * Get Glue42 toolbar app
   * Converts the modified app into the originally received app from glue42DemoToolbar providers
   * @param app: modified app
   * @returns IGlue42ToolbarApplication: glue42DemoToolbar app
   */
  public getGlue42ToolbarApp(app: IApplication): IGlue42ToolbarApplication {
    const glue42ToolbarApp: IApplication | IGlue42ToolbarApplication = Object.assign({}, app);
    delete (glue42ToolbarApp as IApplication).iconPath;
    delete (glue42ToolbarApp as IApplication).showApp;
    delete (glue42ToolbarApp as IApplication).isFavourite;
    return glue42ToolbarApp;
  }
}
