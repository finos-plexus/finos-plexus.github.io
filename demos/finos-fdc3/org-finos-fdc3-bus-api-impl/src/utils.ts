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

import { InteropPeer, InteropPlatform, MethodImplementation, Platform } from "./interfaces/client-api";
import { Context } from "./interfaces/interface";

export default class Utils {
  public static connectUntilReady(interopPlatformWithName: { name: string, platform: InteropPlatform }, methods: MethodImplementation[]): Promise<InteropPeer> {
    return new Promise((resolve) => {
      const applicationName: string = interopPlatformWithName.name
        ? interopPlatformWithName.name
        : `Fdc3.${interopPlatformWithName.platform.type}.Impl`;

      // Try to connect to the Platform every 2 seconds.
      (function connect() {
        interopPlatformWithName.platform.connect(applicationName, undefined, methods)
          .then((interopPeer) => resolve(interopPeer))
          .catch(() => setTimeout(connect, 2000));
      })();
    });
  }

  public static async interopPlatformsToPlatforms(interopPlatformsWithNames: Array<{ name: string, platform: InteropPlatform }>, methods: MethodImplementation[]): Promise<Platform[]> {
    const interopPlatformsConnectionPromises = interopPlatformsWithNames
      .map((interopPlatformWithName: any) => Utils.connectUntilReady(interopPlatformWithName, methods));
    const interopPeers = await Promise.all(interopPlatformsConnectionPromises);
    const interopPlatformNamesAndVersions = interopPlatformsWithNames
      .map((interopPlatformWithName: any) => ({ name: interopPlatformWithName.platform.type, version: interopPlatformWithName.platform.version }));
    const platforms = interopPeers
      .map((interopPeer, index) => ({
        name: interopPlatformNamesAndVersions[index].name,
        version: interopPlatformNamesAndVersions[index].version,
        online: interopPeer.isConnected,
        connectionStatus: interopPeer.connectionStatus,
        config: "",
        platformApi: interopPeer,
      }));

    return platforms;
  }

  public static validateContext(context: Context): void {
    if (!context) {
      return;
    }
    if (typeof context !== "object") {
      throw new Error(`Context must be of type "object"`);
    }
    if (!context.type) {
      throw new Error(`Context type is mandatory parameter`);
    }
    if (typeof context.type !== "string") {
      throw new Error(`Context type must be of type "string"`);
    }
    if (context.name && typeof context.name !== "string") {
      throw new Error(`Context name must be of type "string"`);
    }
  }

  public static validateOpenParams(app: string, context?: Context): void {
    if (!app) {
      throw new Error("App is mandatory parameter");
    }
    if (typeof app !== "string") {
      throw new Error(`App must be of type "string"`);
    }

    try {
      this.validateContext(context);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public static validateIntentAndContextParams(intent: string, context?: Context): void {
    this.validateIntent(intent);
    this.validateContext(context);
  }

  public static validateRaiseIntent(intent: string, context: Context, target?: string): void {
    this.validateIntentAndContextParams(intent, context);

    if (target && typeof target !== "string") {
      throw new Error(`Target must be of type "string"`);
    }
  }

  public static validateAddIntentListener(intent: string, handler: (context: Context) => void): void {
    this.validateIntent(intent);

    if (!handler) {
      throw new Error("Handler is mandatory parameter");
    }
    if (typeof handler !== "function") {
      throw new Error(`Handler must be of type "function"`);
    }
  }

  private static validateIntent(intent: string): void {
    if (!intent) {
      throw new Error("Intent is mandatory parameter");
    }
    if (typeof intent !== "string") {
      throw new Error(`Intent must be of type "string"`);
    }
  }
}
