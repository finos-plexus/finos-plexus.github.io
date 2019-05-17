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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/index';
import { Context, DesktopAgent } from 'com-glue42-finos-fdc3-api-impl';

import { IApplication, IInstrument, IIntentMetadata, IGlueInteropPlatformConfig, IMethodImplementation } from './app';
import { CONSTANTS } from './app.constants';

const Fdc3Impl = require('com-glue42-finos-fdc3-api-impl');

@Injectable()
export class InitializeService {
  public readonly fdc3ApiImpl: Subject<DesktopAgent> = new Subject<DesktopAgent>();
  public readonly context: Subject<Context> = new Subject<Context>();
  public readonly instrument: Subject<IInstrument> = new Subject<IInstrument>();
  public isGlueWindow: boolean;
  private busName: string;
  private username: string;
  private password: string;

  constructor(private router: Router) {
  }

  /**
   * This function initializes the FDC3 API Implementation
   * If the bus is not saved to the localStorage, it redirects to the login page
   */
  public initializeFdc3APIImpl(): void {
    this.isGlueWindow = this.isCurrentWindowGlue();
    this.setLoginDetails();
    if (this.busName) {
      try {
        this.init();
      } catch (error) {
        console.error(error);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * This function sets the isGlueWindow property whether this is glue window
   */
  public isCurrentWindowGlue(): boolean {
    return typeof (window as any).glue42gd !== 'undefined';
  }

  /**
   * This function gets the bus name
   * @returns string The bus name
   */
  public getBusName(): string {
    return this.busName;
  }

  /**
   * This function initializes the FDC3 API Implementation for either Glue42 or Plexus
   */
  public init(): void {
    const methodsToRegister: IMethodImplementation[] = this.getMethodsToRegister();
    if (this.busName.toLowerCase() === 'glue42') {
      this.initGlueFdc3ApiImpl(methodsToRegister);
    } else if (this.busName.toLowerCase() === 'plexus') {
      this.initPlexusFdc3ApiImpl(methodsToRegister);
    }
  }

  /**
   * This function gets the application name
   * @returns string The current application name
   */
  public getApplicationName(): string {
    const currentUrl: string = this.getCurrentUrl();
    switch (currentUrl) {
      case CONSTANTS.appNames.instrumentList:
        return this.isGlueWindow ? `${CONSTANTS.appNames.instrumentList}-glue42` : `${CONSTANTS.appNames.instrumentList}-web`;
        break;
      case CONSTANTS.appNames.instrumentPriceChartContext:
        return this.isGlueWindow
          ? `${CONSTANTS.appNames.instrumentPriceChartContext}-context-glue42`
          : `${CONSTANTS.appNames.instrumentPriceChartContext}-context-web`;
        break;
      case CONSTANTS.appNames.instrumentPriceChartIntent:
        return this.isGlueWindow
          ? `${CONSTANTS.appNames.instrumentPriceChartContext}-intent-glue42`
          : `${CONSTANTS.appNames.instrumentPriceChartContext}-intent-web`;
        break;
      case CONSTANTS.appNames.tradeTicket:
        return this.isGlueWindow ? `${CONSTANTS.appNames.tradeTicket}-glue42` : `${CONSTANTS.appNames.tradeTicket}-web`;
        break;
      default:
        return CONSTANTS.appNames.fdc3DemoApp;
    }
  }

  /**
   * This function gets the application
   * @returns IApplication The current application
   */
  public getApplication(): IApplication {
    const appName: string = this.getApplicationName();
    return {
      appId: appName,
      name: appName,
      manifest: '',
      manifestType: ''
    };
  }

  /**
   * This function gets the current URL
   * @returns string The current URL
   */
  public getCurrentUrl(): string {
    return location.href.split('/')[location.href.split('/').length - 1];
  }

  /**
   * This function gets the methods which will be registered
   * @returns IMethodImplementation[] List of methods
   */
  private getMethodsToRegister(): IMethodImplementation[] {
    const applicationName = this.getApplicationName();
    // The Instrument List application doesn't register any methods.
    if (applicationName.includes(CONSTANTS.appNames.instrumentList)) {
      return;
    }

    const methodsToRegister: IMethodImplementation[] = [];
    // The Chart and Trade Ticket applications register the ContextListener method to get notified whenever somebody broadcasts
    // (https://github.com/FDC3/FDC3/blob/master/src/api/interface.ts#L155).
    const contextListenerMethodImplementation: IMethodImplementation = {
      name: `Fdc3.${this.getBusName()}.ContextListener`,
      onInvoke: (context: Context) => {
        this.context.next(context);
        return Promise.resolve(this.context);
      }
    };
    methodsToRegister.push(contextListenerMethodImplementation);

    // The Chart (Context) application doesn't reigster ShowChart (Intents) method.
    if (this.isInstrumentPriceChartWithContext(applicationName)) {
      return methodsToRegister;
    }

    const methodName: string = this.getMethodName(applicationName);
    const methodIntent: IIntentMetadata[] = this.getMethodIntent(applicationName);
    const showMethodImplementation: IMethodImplementation = {
      name: methodName,
      intent: methodIntent,
      onInvoke: (context: Context) => {
        this.instrument.next(context.id as IInstrument);
        return Promise.resolve(this.instrument);
      }
    };
    methodsToRegister.push(showMethodImplementation);

    return methodsToRegister;
  }

  /**
   * This function returns whether the application is Instrument Price Chart with context
   * @param applicationName The application name
   * @returns boolean If the application is Instrument Price Chart with context
   */
  private isInstrumentPriceChartWithContext(applicationName: string): boolean {
    // The Chart (Intent) application's url ends with '#1'.
    return applicationName.includes(CONSTANTS.appNames.instrumentPriceChartContext) && !location.hash.substr(1);
  }

  /**
   * This function gets the correct method name for Glue42 / Plexus bus
   * This will not be necessary when DB implements method intents
   * @param applicationName The application name
   * @returns string The method name
   */
  private getMethodName(applicationName: string): string {
    let name: string;
    let intent: string;
    if (applicationName.includes(CONSTANTS.appNames.instrumentPriceChartContext)) {
      name = CONSTANTS.methodsNames.showPriceChart;
      intent = CONSTANTS.intents.instrumentPriceChart;
    } else if (applicationName.includes(CONSTANTS.appNames.tradeTicket)) {
      name = CONSTANTS.methodsNames.showTradeTicket;
      intent = CONSTANTS.intents.tradeTicket;
    } else {
      return;
    }
    // DB's implementation of the FINOS Interop API doesn't support method intents, so we embed it inside the method name.
    return this.busName.toLowerCase() === 'glue42'
      ? `Fdc3.${this.getBusName()}.${name}`
      : `[{\'name\':\'${intent}\'}]Fdc3.${this.getBusName()}.${name}`;
  }

  /**
   * This function gets the method intent registered by the application
   * @param applicationName The application name
   * @returns IIntentMetadata[] List of method intents
   */
  private getMethodIntent(applicationName: string): IIntentMetadata[] {
    let name: string;
    if (applicationName.includes(CONSTANTS.appNames.instrumentPriceChartContext)) {
      name = CONSTANTS.intents.instrumentPriceChart;
    } else if (applicationName.includes(CONSTANTS.appNames.tradeTicket)) {
      name = CONSTANTS.intents.tradeTicket;
    } else {
      return;
    }
    return this.busName.toLowerCase() === 'glue42' ? [{ name }] : [];
  }

  /**
   * This function sets the login details saved in the localStorage
   */
  private setLoginDetails(): void {
    this.busName = this.isGlueWindow ? 'Glue42' : window.localStorage.getItem('fdc3-demo-bus');
    this.username = window.localStorage.getItem('fdc3-demo-username') || '';
    this.password = window.localStorage.getItem('fdc3-demo-password') || '';
  }

  /**
   * This function initializes the FDC3 API Implementation with Glue42 bus
   * @param methods List of methods to initialize the FDC3 API Implementation with
   */
  private initGlueFdc3ApiImpl(methods: IMethodImplementation[]): void {
    const InteropPlatform = require('glue-interop-api-impl');
    const typeSpecificInteropPlatform = InteropPlatform(this.getGlueInteropPlatformConfig(), this.busName);
    const fdc3ImplReady = Fdc3Impl([{
      platform: typeSpecificInteropPlatform,
      name: `Fdc3.${this.getApplicationName()}.Impl`
    }], methods);
    fdc3ImplReady.then((fdc3Impl) => {
      this.fdc3ApiImpl.next(fdc3Impl);
    });
  }

  /**
   * This function gets the Interop platform configuration for Glue42 bus
   * @returns IGlueInteropPlatformConfig Interop platform configuration
   */
  private getGlueInteropPlatformConfig(): IGlueInteropPlatformConfig {
    // When we run inside the Glue42 container we don't have to specify the GW url and authentication.
    if (this.isGlueWindow) {
      return {
        application: this.getApplicationName()
      };
    }

    return {
      application: this.getApplicationName(),
      gateway: {
        protocolVersion: 3,
        ws: 'ws://127.0.0.1:8385/gw',
      },
      auth: {
        username: this.username,
        password: this.password
      }
    };
  }

  /**
   * This function initializes the FDC3 API Implementation with Plexus bus
   * @param methods List of methods to initialize the FDC3 API Implementation with
   * @returns Promise<void> Returns empty promise
   */
  private async initPlexusFdc3ApiImpl(methods: IMethodImplementation[]): Promise<void> {
    const typeSpecificInteropPlatform = new (window as any).PlexusPlatformFactory
      .InteropPlatformFactory()
      .createPlatform({
        webSocketUrl: `ws://127.0.0.1:52486`
      });
    let platform;
    try {
      // The Promise.resolve() is a hack because of DB's factory function being async.
      platform = await Promise.resolve(typeSpecificInteropPlatform);

      platform.type = this.busName;
    } catch (error) {
      console.log(error);
    }

    const fdc3ImplReady = Fdc3Impl([{
      platform,
      name: `Fdc3.${this.getApplicationName()}.Impl`
    }], methods);
    fdc3ImplReady
      .then((fdc3Impl) => {
        this.fdc3ApiImpl.next(fdc3Impl);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
