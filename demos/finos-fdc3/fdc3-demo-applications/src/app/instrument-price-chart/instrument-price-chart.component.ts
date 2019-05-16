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

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/index';
import { Context, DesktopAgent } from 'com-glue42-finos-fdc3-api-impl';
import { Chart } from 'chart.js';

import { InitializeService } from '../initialize.servise';

import { IApplication, IInstrument } from '../app';

const chartData = require('../../assets/instrument-chart-data.json');

@Component({
  selector: 'app-instrument-price-chart',
  templateUrl: './instrument-price-chart.component.html'
})
export class InstrumentPriceChartComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') chartElementRef: ElementRef;
  public isInstrumentSelected: boolean = false;
  public selectedInstrument: string;
  public loading: boolean = true;
  public isChartWithContext: boolean;
  private isGlueWindow: boolean;
  private fdc3ApiImpl: DesktopAgent;
  private fdc3PlatformApi: any;
  private container: any;
  private chartData: any[] = chartData;
  private years: string[] = [];
  private prices: number[] = [];
  private chart: any[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private initializeService: InitializeService) {
  }

  public ngOnInit(): void {
    this.isGlueWindow = this.initializeService.isCurrentWindowGlue();
    this.isChartWithContext = !location.hash.substr(1);
    this.subscribeForFdc3Impl();
    this.subscribeForContext();
    this.subscribeForInstrument();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * This function is a listener for context change
   * @param context Current context
   * If the context type is 'close-window', it closes the current window
   * If the context type is 'fdc3.instrument' and this window is with context, it updates the chart
   */
  public onContextChange(context: Context): void {
    if (context.type === 'close-window') {
      if (this.isGlueWindow) {
        const args: { application: IApplication } = { application: this.initializeService.getApplication() };
        this.fdc3PlatformApi.invoke('Fdc3.Glue42.StopApplication', args)
          .catch((error) => {
            console.error(error);
          });
      } else {
        // We use desktopJS to close the window when we are inside a browser.
        this.closeWindow();
      }
    } else if (context.type === 'fdc3.instrument' && this.isChartWithContext) {
      this.updateChart(context.id as IInstrument);
    }
  }

  /**
   * This function closes the current window
   */
  public closeWindow(): void {
    this.container.getCurrentWindow().close();
  }

  /**
   * This function updates the chart
   * @param instrument The selected instrument
   */
  public updateChart(instrument: IInstrument): void {
    this.clearChart();
    this.selectedInstrument = instrument.description || 'Instrument';
    this.isInstrumentSelected = true;
    this.createChart();
  }

  /**
   * This function subscribes for FDC3 API Implementation
   */
  private subscribeForFdc3Impl(): void {
    this.subscriptions.push(this.initializeService.fdc3ApiImpl.subscribe((fdc3ApiImpl: DesktopAgent) => {
      this.loading = false;
      this.fdc3ApiImpl = fdc3ApiImpl;
      this.fdc3PlatformApi = (this.fdc3ApiImpl as any).platforms[0].platformApi;
      this.initializeDesktopJS();
    }));
  }

  /**
   * This function subscribes for context
   */
  private subscribeForContext(): void {
    this.subscriptions.push(this.initializeService.context.subscribe((context: Context) => {
      this.onContextChange(context);
    }));
  }

  /**
   * This function subscribes for instrument
   */
  private subscribeForInstrument(): void {
    this.subscriptions.push(this.initializeService.instrument.subscribe((instrument: IInstrument) => {
      if (!this.isChartWithContext) {
        this.updateChart(instrument);
      }
    }));
  }

  /**
   * This function initializes desktopJS
   */
  private initializeDesktopJS(): void {
    this.container = (window as any).desktopJS.resolveContainer();
  }

  /**
   * This function clears the chart
   */
  private clearChart(): void {
    this.years = [];
    this.prices = [];
    this.chart = [];
  }

  /**
   * This function creates a new chart
   */
  private createChart(): void {
    this.chartData.forEach((data: { year: string }) => {
      this.years.push(data.year);
      this.prices.push(Math.floor(Math.random() * 1000));
    });
    this.chart = new Chart(this.chartElementRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.years,
        datasets: [
          {
            data: this.prices,
            borderColor: '#fff',
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }
}
