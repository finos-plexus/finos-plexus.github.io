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
import { Router } from '@angular/router';
import { Context, DesktopAgent } from 'com-glue42-finos-fdc3-api-impl';

import { InitializeService } from '../initialize.servise';

import { IApplication, IInstrument, IIntent, IListOfWindows, IWindow } from '../app';
import { CONSTANTS } from '../app.constants';

const instrumentList = require('../../assets/instruments.json');

@Component({
  selector: 'app-instrument-list',
  templateUrl: './instrument-list.component.html'
})
export class InstrumentListComponent implements OnInit, OnDestroy {
  public instruments: IInstrument[];
  public intents: IIntent[] = [];
  public loading: boolean = true;
  public fdc3PlatformApi: any;
  private fdc3ApiImpl: DesktopAgent;
  private container: any;
  private listOfWindows: IListOfWindows = {};
  private busName: string;
  private subscriptions: Subscription[] = [];

  constructor(private initializeService: InitializeService,
    private router: Router) {
  }

  public ngOnInit(): void {
    this.setInstrumentList();
    this.subscribeForFdc3Impl();
    this.busName = this.initializeService.getBusName();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * This function broadcasts the selected instrument
   * @param instrument The selected instrument
   */
  public broadcast(instrument: IInstrument): void {
    const context: Context = {
      type: 'fdc3.instrument',
      id: instrument
    };
    this.fdc3PlatformApi.invoke(CONSTANTS.fullMethodNames.broadcast, context);
  }

  /**
   * This function raises intent for already opened applications
   * If the application is not already opened, it opens it and then raises the intent
   * @param intent The name of the intent to be raise
   * @param instrument The selected instrument
   * @param app The application which registers the intent
   * @returns Promise<void> Returns empty promise
   */
  public async raiseIntent(intent: string, instrument: IInstrument, app: IApplication): Promise<void> {
    const context: Context = {
      type: 'fdc3.instrument',
      id: instrument
    };
    if (this.listOfWindows[app.appId] && this.listOfWindows[app.appId].isOpened) {
      // TODO: Do not target the Eikon Manager Module directly as it could be running on a different bus.
      // There isn't a way for an Eikon application to register a method with intent so the Eikon Manager Module does that.
      const appName: string = app.title.toLowerCase().includes('eikon') ? CONSTANTS.eikonManagerModuleApp : app.name;
      this.fdc3ApiImpl.raiseIntent(intent, context, appName);
    } else {
      this.startAppAndRaiseIntent(intent, instrument, app, context);
    }
  }

  /**
   * This function redirects to the login page
   */
  public goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * This function sets the instrument list (sorted)
   */
  private setInstrumentList(): void {
    this.instruments = this.sort(instrumentList, 'description');
  }

  /**
   * This function subscribes for FDC3 API Implementation
   * When subscribed, it subscribes for Eikon and sets the received intents and app windows
   */
  private subscribeForFdc3Impl(): void {
    this.subscriptions.push(this.initializeService.fdc3ApiImpl.subscribe(async (fdc3ApiImpl: DesktopAgent) => {
      this.loading = false;
      this.fdc3ApiImpl = fdc3ApiImpl;
      this.fdc3PlatformApi = (this.fdc3ApiImpl as any).platforms[0].platformApi;
      // Close the already running instances of demo applications.
      this.fdc3PlatformApi.invoke(CONSTANTS.fullMethodNames.broadcast, { type: 'close-window' });
      this.initializeDesktopJS();
      this.addIntentListenerForEikon();
      // Get context menu items (intents) from the Toolbar.
      const findIntentsInvocation = await this.fdc3PlatformApi.invoke(CONSTANTS.fullMethodNames.findIntents);
      this.setIntents(findIntentsInvocation.result.intentapps);
      this.setListOfWindows();
    }));
  }

  /**
   * This function initializes desktopJS
   */
  private initializeDesktopJS(): void {
    this.container = (window as any).desktopJS.resolveContainer();
  }

  /**
   * This function starts application and then raises intent when the application registers it
   * @param intent The name of the intent to be raise
   * @param instrument The selected instrument
   * @param app The application to be started
   * @param context The context with which the intent is raised
   * @returns Promise<void> Returns empty promise
   */
  private async startAppAndRaiseIntent(intent: string, instrument: IInstrument, app: IApplication, context: Context): Promise<void> {
    try {
      this.startApp(app);
      if (app.title.toLowerCase().includes('eikon')) {
        // TODO: Do not target the Eikon Manager Module directly as it could be running on a different bus.
        // There isn't a way for an Eikon application to register a method with intent so the Eikon Manager Module does that.
        this.fdc3ApiImpl.raiseIntent(intent, context, CONSTANTS.eikonManagerModuleApp);
      } else {
        this.addIntentListener(intent, instrument, app.name);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * This function starts application
   * @param app The application to be started
   */
  private startApp(app: IApplication): void {
    const currentWindow: IWindow = this.listOfWindows[app.appId];
    if (currentWindow.isWeb) {
      // Use desktopJS to start the application when we are in the browser.
      let url: string;
      if (currentWindow.intent === CONSTANTS.intents.instrumentPriceChart) {
        url = CONSTANTS.windowUrls.instrumentPriceChart;
      } else if (currentWindow.intent === CONSTANTS.intents.tradeTicket) {
        url = CONSTANTS.windowUrls.tradeTicket;
      }

      this.container.createWindow(url, { name: app.name })
        .then((wnd) => this.listOfWindows[wnd.name].isOpened = true);
    } else {
      // Invoke the StartApplication method of the Toolbar.
      const methodName: string = CONSTANTS.fullMethodNames.startApplication;
      this.fdc3PlatformApi.invoke(methodName, { application: app.name });
      currentWindow.isOpened = true;
    }
  }

  /**
   * This function adds intent listener
   * @param intent The name of the intent to be raise
   * @param instrument The selected instrument
   * @param appName The name of the application which registers the intent
   */
  private addIntentListener(intent: string, instrument: IInstrument, appName: string): void {
    const context: Context = {
      type: 'fdc3.instrument',
      id: instrument
    };
    if (intent === CONSTANTS.intents.instrumentPriceChart) {
      // Hack because of DB not having implemented onMethodRegistered.
      // this.addIntentForShowChartListener = this.fdc3ApiImpl.addIntentListener(intent, () => {
      setTimeout(() => {
        this.fdc3ApiImpl.raiseIntent(intent, context, appName);
      }, 3000);
      // this.addIntentForShowChartListener.unsubscribe();
      // });
    } else if (intent === CONSTANTS.intents.tradeTicket) {
      // Hack because of DB not having implemented onMethodRegistered.
      // this.addIntentForShowTradeTicketListener = this.fdc3ApiImpl.addIntentListener(intent, () => {
      setTimeout(() => {
        this.fdc3ApiImpl.raiseIntent(intent, context, appName);
      }, 3000);
      // this.addIntentForShowTradeTicketListener.unsubscribe();
      // });
    }
  }

  /**
   * This function adds intent listener for Eikon
   */
  private addIntentListenerForEikon(): void {
    if (!this.initializeService.getApplicationName().includes('eikon')) {
      return;
    }

    // Hack because of DB not having implemented onMethodRegistered.
    // this.fdc3ApiImpl.addIntentListener(CONSTANTS.intents.news, async () => {
    setInterval(async () => {
      const findIntentsInvocation = await this.fdc3PlatformApi.invoke(CONSTANTS.fullMethodNames.findIntents);
      this.setIntents(findIntentsInvocation.result.intentapps);
      this.setListOfWindows();
    }, 1500);
    // });
  }

  /**
   * This function sets the intents
   * @param intents List of intents received from the Toolbar
   */
  private setIntents(intents: any[]): void {
    this.intents = intents.map((intent: IIntent) => {
      intent.apps = this.sort(intent.apps, 'name');
      intent.apps.map((app: IApplication) => {
        app.show = true;
        return app;
      });
      intent.show = intent.apps.filter((app: IApplication) => app.show).length > 0;
      return intent;
    });
  }

  /**
   * This function sets the list of app windows received from the Toolbar
   */
  private setListOfWindows(): void {
    this.intents.forEach((intent: IIntent) => {
      intent.apps.forEach((app: IApplication) => {
        this.listOfWindows[app.appId] = {
          intent: intent.intent.name,
          isOpened: false,
          isWeb: app.appId.includes('web')
        };
      });
    });
  }

  /**
   * This function sorts alphabetically any array of objects by provided key
   * @param arr Array of objects
   * @param key Key by which the array is sorted alphabetically
   * @returns any[] The array sorted alphabetically
   */
  private sort(arr: object[], key: string): any[] {
    return arr.sort((a, b) =>
      a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
    );
  }
}
