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

import { shell } from 'electron';
import { execFile } from 'child_process';
import logStream from '../shared';
import { AppAPI, Image, Icon, Intent } from './types';

export default class App implements AppAPI {
  public appId: string;
  public name: string;
  public version: string;
  public title: string;
  public tooltip: string;
  public description: string;
  public images: Image[];
  public contactEmail: string;
  public supportEmail: string;
  public publisher: string;
  public icons: Icon[];
  public customConfig: any[];
  public intents: Intent[];
  public manifestType: string;
  public manifest: string;

  constructor(appConfig: AppAPI) {
    if (!appConfig.appId || !appConfig.name || !appConfig.manifest || !appConfig.manifestType) {
      const errorMsg = 'App is missing appId/name/manifest/manifestType field.';

      logStream.next([errorMsg, 'error', 'Toolbar']);
      throw new Error(errorMsg);
    }

    this.appId = appConfig.appId;
    this.name = appConfig.name;
    this.version = appConfig.version || '';
    this.title = appConfig.title || '';
    this.tooltip = appConfig.tooltip || '';
    this.description = appConfig.description || '';
    this.images = appConfig.images || [];
    this.contactEmail = appConfig.contactEmail || '';
    this.supportEmail = appConfig.supportEmail || '';
    this.publisher = appConfig.publisher || '';
    this.icons = appConfig.icons || [];
    this.customConfig = appConfig.customConfig || [];
    this.intents = appConfig.intents || [];
    this.manifestType = appConfig.manifestType;
    this.manifest = appConfig.manifest;
  }

  public async start() {
    logStream.next([`Starting app "${this.title || this.name}".`, 'info', 'Toolbar']);

    let manifestJSON: any; // The manifestType determines the shape of the parsed manifest.
    let errorMsg: string;

    try {
      manifestJSON = JSON.parse(this.manifest);
    } catch (error) {
      errorMsg = `Failed to parse "${this.title || this.name}"'s manifest.`;

      logStream.next([errorMsg, 'error', 'Toolbar']);
      throw new Error(errorMsg);
    }

    /* The toolbar is currently aware of the following manifest types:
       'org.finos.fdc3.demo' - covers browser/exe and therefore is platform/host independent
       'org.finos.fdc3.demo.host' - covers platform/host specific applications
    */
    switch (this.manifestType) {
      case 'org.finos.fdc3.demo':

        this.handleOrgFinosFdc3Demo(manifestJSON);
        break;

      case 'org.finos.fdc3.demo.host':

        await this.handleOrgFinosFdc3DemoHost(manifestJSON);
        break;

      default:
        errorMsg = `Failed to open application "${this.title || this.name}". Unsupported manifest type "${this.manifestType}".`;

        logStream.next([errorMsg, 'error', 'Toolbar']);
        throw new Error(errorMsg);
    }
  }

  // Handles browser/exe.
  private handleOrgFinosFdc3Demo(manifestJSON: any) {
    let errorMsg: string;

    switch (manifestJSON.type) {
      case 'browser':
        const appUrl = manifestJSON.url;

        if (typeof appUrl === 'undefined') {
          errorMsg = `Browser application "${this.title || this.name}" is missing url field inside the manifest.`;

          logStream.next([errorMsg, 'error', 'Toolbar']);
          throw new Error(errorMsg);
        }

        shell.openExternal(appUrl);
        break;
      case 'exe':
        const exePath = manifestJSON.exePath;

        if (typeof exePath === 'undefined') {
          errorMsg = `Exe application "${this.title || this.name}" is missing exePath field inside the manifest.`;

          logStream.next([errorMsg, 'error', 'Toolbar']);
          throw new Error(errorMsg);
        }

        execFile(exePath);
        break;
      default:
        errorMsg = `Unknown type "${manifestJSON.type}" application "${this.title || this.name}" with manifest type "org.finos.fdc3.demo".`;

        logStream.next([errorMsg, 'error', 'Toolbar']);
        throw new Error(errorMsg);
    }
  }

  // Handles host applications. Uses the FDC3 API implementation's open() method.
  private async handleOrgFinosFdc3DemoHost(manifestJSON: any) {
    let errorMsg: string;

    const fdc3Impl = (global as any).fdc3Impl;

    if (!fdc3Impl) {
      errorMsg = `No fdc3Impl implementation provided. Application "${this.title || this.name}" with manifest type "org.finos.fdc3.demo.host" can't be started.`;

      logStream.next([errorMsg, 'error', 'Toolbar']);
      throw new Error(errorMsg);
    }

    switch (manifestJSON.type) {
      case 'host':
        const wait = (ms: number, msg?: string) => new Promise((_, reject) => setTimeout(() => reject(msg), ms));

        try {
          await Promise.race([fdc3Impl.open(this.name), wait(3000)]);
        } catch (error) {
          logStream.next([`Failed to open application "${this.title || this.name}". ${error.msg || error}`, 'error', 'Toolbar']);
        }
        break;
      default:
        errorMsg = `Unknown type "${manifestJSON.type}" application "${this.title || this.name}" with manifest type "org.finos.fdc3.demo,host".`;

        logStream.next([errorMsg, 'error', 'Toolbar']);
        throw new Error(errorMsg);
    }
  }
}
