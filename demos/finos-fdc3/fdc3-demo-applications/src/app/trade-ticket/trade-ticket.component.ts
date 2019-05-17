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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/index';
import { Context, DesktopAgent } from 'com-glue42-finos-fdc3-api-impl';

import { InitializeService } from '../initialize.servise';
import { IApplication, IInstrument } from '../app';

@Component({
  selector: 'app-trade-ticket',
  templateUrl: './trade-ticket.component.html'
})
export class TradeTicketComponent implements OnInit, OnDestroy {
  public isInstrumentSelected: boolean = false;
  public selectedInstrument: string;
  public finalInstrumentPrice: string;
  public quantity: string = '1';
  public loading: boolean = true;
  private isGlueWindow: boolean;
  private instrumentPrice: number;
  private container: any;
  private fdc3ApiImpl: DesktopAgent;
  private fdc3PlatformApi: any;
  private subscriptions: Subscription[] = [];

  constructor(private initializeService: InitializeService) {
  }

  public ngOnInit(): void {
    this.isGlueWindow = this.initializeService.isCurrentWindowGlue();
    this.subscribeForFdc3Impl();
    this.subscribeForContext();
    this.subscribeForInstrument();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * This function calculates the price of the selected instrument
   * @param event The click event from the input field
   */
  public calculatePrice(event): void {
    const quantity: number = parseInt(event.target.value, 10);
    this.finalInstrumentPrice = `${this.instrumentPrice * quantity}`;
  }

  /**
   * This function closes the current window
   */
  public closeWindow(): void {
    this.container.getCurrentWindow().close();
  }

  /**
   * This function is a listener for context change
   * @param context Current context
   * If the context type is 'close-window', it closes the current window
   */
  public onContextChange(context: Context): void {
    // The Trade Ticket application uses Intents to update.
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
    }
  }

  /**
   * This function sets the current instrument
   * @param instrument The selected instrument
   */
  public setInstrument(instrument: IInstrument): void {
    this.quantity = '1';
    this.selectedInstrument = instrument.description;
    this.isInstrumentSelected = true;
    this.instrumentPrice = Math.floor(Math.random() * 1000);
    this.finalInstrumentPrice = `${this.instrumentPrice}`;
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
      this.setInstrument(instrument);
    }));
  }

  /**
   * This function initializes desktopJS
   */
  private initializeDesktopJS(): void {
    this.container = (window as any).desktopJS.resolveContainer();
  }
}
