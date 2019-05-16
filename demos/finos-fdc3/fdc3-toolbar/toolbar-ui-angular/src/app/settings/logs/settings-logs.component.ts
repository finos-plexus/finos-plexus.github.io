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

import {Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {saveAs} from 'file-saver';
import {ElectronService} from 'ngx-electron';

import {ILog} from '../../app';

import {HelperService} from '../../services/helper.service';

@Component({
  selector: 'app-settings-logs',
  templateUrl: './settings-logs.component.html'
})
export class SettingsLogsComponent implements OnInit, OnDestroy {
  @Input() openNewWindow: boolean;
  @Input() logs: ILog[] = [] = [];
  public displayedLogs: ILog[];
  public showFilterByOriginOptions: boolean = false;
  public showFilterByTypeOptions: boolean = false;
  private sortAsc: boolean = true;
  private logOriginFilters: string[] = [];
  private logTypeFilters: string[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private electronService: ElectronService,
              private zone: NgZone,
              private helperService: HelperService) {
  }

  public ngOnInit() {
    this.subscribeForLogs();
    this.subscribeForClearLogsFilters();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * Toggle logs sorting by timestamp
   */
  public toggleSorting(): void {
    this.sortAsc = !this.sortAsc;
    this.logs = this.logs.sort((a: ILog, b: ILog) => {
      return this.sortAsc ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
    });
    this.setDisplayedLogs();
  }

  /**
   * On change of filter by fields
   * Toggles the displayed filters
   * @param event: click event
   */
  public onFilterByChange(event: any): void {
    this.showFilterByOriginOptions = event.target.value === 'origin';
    this.showFilterByTypeOptions = event.target.value === 'type';
    this.filterDisplayedLogs([], '');
  }

  /**
   * Filter logs
   * @param event: click event
   */
  public filterLogs(event: any): void {
    this.setFilterValues(event);
    if (this.showFilterByOriginOptions) {
      this.filterDisplayedLogs(this.logOriginFilters, 'origin');
    } else if (this.showFilterByTypeOptions) {
      this.filterDisplayedLogs(this.logTypeFilters, 'type');
    }
  }

  /**
   * Extract logs
   * Downloads all logs as .csv file
   */
  public extractLogs(): void {
    const logs: string = this.logs.map((log: ILog) => {
      const time: string = `${this.getDate(log.timestamp)}_${this.getTime(log.timestamp)}`;
      return `${time},${log.type},${log.origin},${log.message}`;
    }).join('\r\n');
    const blob = new Blob([logs], {type: 'text/csv'});
    saveAs(blob, `${this.getDate(Date.now())}_${this.getTime(Date.now())}.csv`);
  }

  /**
   * Open logs in new Electron window
   */
  public openInNewWindow(): void {
    const preload: string = this.electronService.ipcRenderer.sendSync('get-preload-path');
    const win = new this.electronService.remote.BrowserWindow({width: 900, height: 600, webPreferences: {preload}});
    win.loadURL(`${location.href.split('/').slice(0, -2).join('/')}/assets/logs.html`);
  }

  /**
   * Set filter values
   * @param event: click event
   */
  private setFilterValues(event: any): void {
    if (event.target.checked) {
      if (this.showFilterByOriginOptions) {
        this.logOriginFilters.push(event.target.value);
      } else if (this.showFilterByTypeOptions) {
        this.logTypeFilters.push(event.target.value);
      }
    } else {
      if (this.showFilterByOriginOptions) {
        this.logOriginFilters = this.logOriginFilters
          .filter((originFilter: string) => originFilter !== event.target.value);
      } else if (this.showFilterByTypeOptions) {
        this.logTypeFilters = this.logTypeFilters
          .filter((originFilter: string) => originFilter !== event.target.value);
      }
    }
  }

  /**
   * Filter displayed logs
   * @param filterValues: list of filter values
   * @param filterByKey: key used to filter the logs
   */
  private filterDisplayedLogs(filterValues: string[], filterByKey: string): void {
    this.logs = this.logs.map((log: ILog) => {
      if (filterValues.length > 0) {
        log.show = filterValues.indexOf(log[filterByKey].toLowerCase()) >= 0;
      } else {
        log.show = true;
      }
      return log;
    });
    this.setDisplayedLogs();
  }

  /**
   * Set displayed logs
   */
  private setDisplayedLogs(): void {
    this.zone.run(() => {
      this.displayedLogs = this.logs.map((log: ILog) => ({
        date: this.getTime(log.timestamp),
        timestamp: log.timestamp,
        type: log.type,
        origin: log.origin,
        message: log.message,
        show: log.show
      }));
    });
  }

  /**
   * Get date in format DD.MM.YYYY
   * @param timestamp: timestamp
   * @returns string: date in format DD.MM.YYYY
   */
  private getDate(timestamp: number): string {
    const date = new Date(timestamp);
    const day: string = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const month: string = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    const year: string = `${date.getFullYear()}`;
    return `${day}.${month}.${year}`;
  }

  /**
   * Get time in format HH:MM:SS
   * @param timestamp: timestamp
   * @returns string: time in format HH:MM:SS
   */
  private getTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hours: string = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
    const minutes: string = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    const seconds: string = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * Subscribe for logs
   */
  private subscribeForLogs(): void {
    this.subscriptions.push(this.helperService.logs.subscribe((logs: ILog[]) => {
      this.logs = logs;
      this.setDisplayedLogs();
    }));
  }

  /**
   * Subscribe for clear logs filters
   */
  private subscribeForClearLogsFilters(): void {
    this.subscriptions.push(this.helperService.clearLogsFilters.subscribe((clearFilters: boolean) => {
      if (clearFilters) {
        this.showFilterByOriginOptions = false;
        this.showFilterByTypeOptions = false;
        this.filterDisplayedLogs([], '');
      }
    }));
  }
}
