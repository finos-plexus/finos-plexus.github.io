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

import { default as CallbackRegistryFactory, CallbackRegistry } from "callback-registry";

import { AppIntent, Context, DesktopAgent, IntentResolution, Listener } from "./interfaces/interface";
import { Application, InteropPeerDescriptor, Method, MethodImplementation, Platform, InteropPlatform } from "./interfaces/client-api";
import Utils from "./utils";

const registry: CallbackRegistry = CallbackRegistryFactory();

class Fdc3Impl implements DesktopAgent {
  private platforms: Platform[];
  private defaultErrorMessage: string;

  constructor(platforms: Platform[] = []) {
    this.platforms = platforms;
  }

  public async open(app: string, context?: Context): Promise<any> {
    Utils.validateOpenParams(app, context);

    let platform: Platform;
    // The implementation allows for Platform specification inside the app name. E.g. <app name>:Plexus.
    const platformName: string = this.getPlatformName(app);
    const appName: string = platformName ? this.getApplicationName(app) : app;
    this.defaultErrorMessage = `Unable to start application named "${appName}"`;

    try {
      // Get the platform which the application runs on. A manager module (Bridge) registers ListApplications and StartApplication methods.
      platform = await this.getPlatform(appName, platformName);
    } catch (error) {
      throw new Error(error.message || this.defaultErrorMessage);
    }

    const args: { application: string, context: Context } = { application: appName, context };
    // Start the application by invoking the Host's StartApplication method.
    const methodName: string = `Fdc3.${platform.name}.StartApplication`;
    try {
      const startInvokeResult: any = await platform.platformApi.invoke(methodName, args);
      return startInvokeResult.result;
    } catch (error) {
      throw new Error(this.defaultErrorMessage);
    }
  }

  public async findIntent(intent: string, context?: Context): Promise<AppIntent> {
    Utils.validateIntentAndContextParams(intent, context);
    const appIntent: AppIntent = {
      intent: { name: intent, displayName: intent },
      apps: []
    };

    // Go through all platforms.
    for (const platform of this.platforms) {
      const methods: Method[] = await platform.platformApi.discoverMethods();

      // Go through the methods of each platform.
      for (const method of methods) {

        // See if the method has intents.
        if (method.intent && method.intent.length > 0) {

          // Push each intent to the result.
          for (const methodIntent of method.intent) {
            if (methodIntent.name === intent &&
              (!context || JSON.stringify(context) === JSON.stringify(methodIntent.context))) {
              appIntent.apps.push({ name: method.peer.applicationName });
            }
          }
        }
      }
    }

    return appIntent;
  }

  public async findIntentsByContext(context: Context): Promise<AppIntent[]> {
    Utils.validateContext(context);
    const appIntents: AppIntent[] = [];

    // Go through all platforms.
    for (const platform of this.platforms) {
      const methods: Method[] = await platform.platformApi.discoverMethods();

      // Go through the methods of each platform.
      for (const method of methods) {

        // See if the method has intents.
        if (method.intent && method.intent.length > 0) {

          // Push each intent that has context to the result.
          for (const methodIntent of method.intent) {
            if (JSON.stringify(methodIntent.context) === JSON.stringify(context)) {
              const intent: AppIntent = appIntents.find((appIntent: AppIntent) =>
                appIntent.intent.name === methodIntent.name);
              if (intent) {
                intent.apps.push({ name: method.peer.applicationName });
              } else {
                appIntents.push({
                  intent: { name: methodIntent.name, displayName: methodIntent.name },
                  apps: [{ name: method.peer.applicationName }]
                });
              }
            }
          }
        }
      }
    }

    return appIntents;
  }

  public broadcast(context: Context): void {
    if (!context) {
      throw new Error("Context is a mandatory parameter");
    }
    Utils.validateContext(context);

    // Broadcast to all listeners on each platform.
    this.platforms.forEach(async (platform: Platform) => {
      try {
        const methods: Method[] = await platform.platformApi.discoverMethods();
        const contextListenerMethods: Method[] = methods
          .filter((method: Method) => method.name === `Fdc3.${platform.name}.ContextListener`);
        for (const method of contextListenerMethods) {
          await platform.platformApi.invoke(method, context);
        }
      } catch (error) {
        return;
      }
    });
  }

  public async raiseIntent(intent: string, context: Context, target?: string): Promise<IntentResolution> {
    Utils.validateRaiseIntent(intent, context, target);

    // Go through all platforms.
    for (const platform of this.platforms) {
      // Get the methods of the platform.
      const tempMethods: Method[] = await platform.platformApi.discoverMethods();

      // Hack because of DB not supporting Intents.
      const methods: Method[] = this.considerPlexusNotSupportingIntents(tempMethods);

      // Find methds matching the intent and the target.
      const methodsWithIntent: Method[] = methods.filter((method: Method) => {
        if (method.intent && method.intent.length > 0) {

          // Go through the intents.
          for (const methodIntent of method.intent) {
            if (methodIntent.name === intent) {
              if (target) {
                const host = method.peer.applicationName.replace(/Fdc3.(.*?).Impl/, "$1");
                if (method.peer && host === target) {
                  return method;
                }
              } else {
                return method;
              }
            }
          }
        }
      });

      if (methodsWithIntent.length === 0) {
        throw new Error(`There is no method with intent "${intent}"`);
      }
      if (methodsWithIntent.length > 1) {
        throw new Error(`There are multiple applications with method with intent "${intent}"`);
      }

      // The checks above ensure that there is only one matching method.
      const methodToInvoke = methodsWithIntent[0];

      let invokeResult;

      // If the method was modified inside of considerPlexusNotSupportingIntents because of DB not supporting intents reconstruct the method name.
      // tslint:disable-next-line:no-string-literal
      if (methodToInvoke["modified"]) { // e.g. "[{'name':'show-news','displayName':'Show News'}]Fdc3.Eikon.ShowNews"
        methodToInvoke.name = `${JSON.stringify(methodToInvoke.intent).replace(/\"/g, "'")}${methodToInvoke.name}`;
        methodToInvoke.intent = undefined;
        // tslint:disable-next-line:no-string-literal
        delete methodToInvoke["modified"];
      }

      invokeResult = await platform.platformApi.invoke(methodToInvoke, context);

      return invokeResult.result;
    }
  }

  // Triggered whenever a method with an Intent intent is registered.
  public addIntentListener(intent: string, handler: (context: Context) => void): Listener {
    Utils.validateAddIntentListener(intent, handler);

    const unsubscribeFunction = registry.add(`add-intent-${intent}`, handler);
    const unsubscribe: () => void = () => {
      unsubscribeFunction();
    };

    // Subscribe for onMethodRegistered on each platform.
    for (const platform of this.platforms) {
      platform.platformApi.onMethodRegistered((method: Method) => {
        if (method.intent && method.intent.length > 0) {
          for (const methodIntent of method.intent) {
            if (methodIntent.name === intent) {
              registry.execute(`add-intent-${intent}`, methodIntent.context);
            }
          }
        }
      });
    }
    return { unsubscribe };
  }

  public addContextListener(handler: (context: Context) => void): Listener {
    if (!handler) {
      throw new Error("Handler is mandatory parameter");
    }
    if (typeof handler !== "function") {
      throw new Error(`Handler must be of type "function"`);
    }

    const unsubscribeFunction = registry.add("add-context", handler);
    const unsubscribe: () => void = () => {
      unsubscribeFunction();
    };

    // Go through all platforms and register a method on each that would get invoked whenever somebody broadcasts.
    for (const platform of this.platforms) {
      const method: MethodImplementation = {
        name: `Fdc3.${platform.name}.ContextListener`,
        onInvoke: (context: Context, peer: InteropPeerDescriptor) => {
          return Promise.resolve(registry.execute("add-context", context));
        }
      };
      platform.platformApi.register(method);
    }

    return { unsubscribe };
  }

  // Hack because of DB not supporting Intents.
  private considerPlexusNotSupportingIntents(methods: Method[]) {
    if (this.platforms.some((platform) => platform.name === "Plexus")) {
      return methods.map((method) => {
        if (method.name.toLowerCase().includes("fdc3") && method.name.startsWith("[")) { // e.g. "[{'name':'show-news','displayName':'Show News'}]Fdc3.Eikon.ShowNews"
          const methodName = method.name.substring(method.name.toLowerCase().indexOf("fdc3"));
          const methodIntent = JSON.parse(method.name.replace(methodName, "").replace(/'/g, "\""));

          method.name = methodName;
          method.intent = methodIntent;
          // tslint:disable-next-line:no-string-literal
          // Marks the method as modified so we can reconstruct the name before invoking it.
          method["modified"] = true;
          return method;
        } else {
          return method;
        }
      });
    } else {
      return methods;
    }
  }

  private getPlatformName(app: string): string {
    const splitAppName: string[] = app.split(":");
    return splitAppName.length > 1 ? splitAppName[splitAppName.length - 1] : null;
  }

  private getApplicationName(app: string): string {
    const splitAppName = app.split(":");
    if (splitAppName.length > 1) {
      splitAppName.pop();
      return splitAppName.join(":");
    } else {
      return app;
    }
  }

  // Get the platform which the application with name appName runs on.
  private async getPlatform(appName: string, platformName?: string): Promise<Platform> {
    if (platformName) {
      try {
        // Throw an Error when the FDC3 API implementation is initialized with more than one platform with name platformName.
        const platform: Platform = this.getUniquePlatform(platformName);
        return platform;
      } catch (error) {
        throw new Error(error.message || this.defaultErrorMessage);
      }
    } else {
      // Filter the platforms that have a manager module running which register Fdc3.<host>.ListApplications
      const platformsSupportingListApplicationsMethod: Platform[] = [];
      for (const platform of this.platforms) {
        const platformMethods = await platform.platformApi.discoverMethods();
        if (this.platformHasMethod(platform, platformMethods, "ListApplications")) {
          platformsSupportingListApplicationsMethod.push(platform);
        }
      }

      // Filter the platforms that have an application with name appName.
      const platformsWithProvidedApp: Platform[] = [];
      for (const platform of platformsSupportingListApplicationsMethod) {
        const platformHasProvidedApp: boolean = await this.platformHasProvidedApp(platform, appName);
        if (platformHasProvidedApp) {
          platformsWithProvidedApp.push(platform);
        }
      }

      if (platformsWithProvidedApp.length === 0) {
        throw new Error(`There are no platforms with application named '${appName}'.`);
      }
      if (platformsWithProvidedApp.length > 1) {
        throw new Error(`There are multiple platforms with application named '${appName}'.`);
      }

      // The checks above ensure that there is only one matching platform.
      const platformWithProvidedApp: Platform = platformsWithProvidedApp[0];

      const platformWithProvidedAppMethods = await platformWithProvidedApp.platformApi.discoverMethods();
      if (this.platformHasMethod(platformWithProvidedApp, platformWithProvidedAppMethods, "StartApplication")) {
        return platformWithProvidedApp;
      } else {
        return null;
      }
    }
  }

  private getUniquePlatform(platformName: string): Platform {
    const fdc3Platforms: Platform[] = this.platforms
      .filter((fdc3Platform: Platform) => fdc3Platform.name === platformName);
    if (fdc3Platforms.length === 0) {
      throw new Error(`There is no platform named "${platformName}"`);
    }
    if (fdc3Platforms.length > 1) {
      throw new Error(`There are multiple platforms named "${platformName}"`);
    }
    return fdc3Platforms[0];
  }

  private platformHasMethod(platform: Platform, platformMethods: any[], methodName: string): boolean {
    const methodFullName: string = `Fdc3.${platform.name}.${methodName}`;
    return platformMethods.filter((method: any) => method.name === methodFullName).length > 0;
  }

  private async platformHasProvidedApp(platform: Platform, app: string): Promise<boolean> {
    const listApplicationsMethodName: string = `Fdc3.${platform.name}.ListApplications`;
    let platformApplications: Application[];
    try {
      const listApplicationsInvocation = await platform.platformApi.invoke(listApplicationsMethodName);
      platformApplications = listApplicationsInvocation.result.applications;
    } catch (error) {
      return false;
    }
    const providedAppList: Application[] = platformApplications
      .filter((application: Application) => application.name === app);
    if (providedAppList.length > 1) {
      throw new Error(`There are multiple applications named '${app}'.`);
    }
    return providedAppList.length === 1;
  }
}

// Factory function that accepts an array of FINOS Interop API Platforms (https://github.com/finos-plexus/finos-plexus.github.io/blob/master/client-api/client-api.ts#L30)
// and methods to be registered on connection for each Platform.
export default async function Fdc3Bus(interopPlatformsWithNames: Array<{ name: string, platform: InteropPlatform }>, methods: MethodImplementation[]): Promise<Fdc3Impl> {
  const interopPlatformNames: string[] = interopPlatformsWithNames.map((interopPlatform) => interopPlatform.name);
  const interopPlatformNamesSet: Set<string> = new Set(interopPlatformNames);
  if (interopPlatformNames.length !== interopPlatformNamesSet.size) {
    throw new Error("Multiple platforms have the same name.");
  }

  const platforms: any = await Utils.interopPlatformsToPlatforms(interopPlatformsWithNames, methods);
  const fdc3ImplObj: any = new Fdc3Impl(platforms);
  return fdc3ImplObj;
}
