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

import AppProvider from './types/app-provider';
import ProviderConfig from './types/providerConfig';
import App from '../apps/app';
import { AppAPI } from '../apps/types';
import fetch from 'node-fetch';
import logStream from '../shared';

export default class RestAppProvider implements AppProvider {
  public name: string;
  public apiUrl: string;
  public email: string;
  public password: string;
  public authUrl: string;

  constructor(providerConfig: ProviderConfig) {
    if (!providerConfig.name || !providerConfig.apiUrl) {
      const errorMsg = 'App provider is missing name/apiUrl field.';

      logStream.next([errorMsg, 'error', 'Toolbar']);
      throw new Error(errorMsg);
    }

    this.name = providerConfig.name;
    this.apiUrl = providerConfig.apiUrl;
    this.email = providerConfig.email || '';
    this.password = providerConfig.password || '';
    this.authUrl = providerConfig.authUrl || '';
  }

  // Used for providers that have authUrl set.
  public async getAuthToken() {
    const body = {
      email: this.email,
      password: this.password,
    };

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(body),
    };

    const res = await fetch(this.authUrl, postOptions);
    const resJSON = await res.json();

    return resJSON.Authorization;
  }

  public async getApps(): Promise<App[]> {
    let headers = {};

    if (this.authUrl !== '') {
      let authToken;

      try {
        authToken = await this.getAuthToken();
      } catch (error) {
        logStream.next([error.msg || error, 'error', 'Toolbar']);
        throw new Error(error.msg || error);
      }

      headers = {
        Authorization: `Bearer ${authToken}`,
      };
    }

    const getOptions = {
      method: 'GET',
      headers,
    };

    let resJSON;

    try {
      const res = await fetch(`${this.apiUrl}/apps/search`, getOptions);
      resJSON = await res.json();
    } catch (error) {
      logStream.next([error.msg || error, 'error', 'Toolbar']);
      throw new Error(error.msg || error);
    }

    const apps = resJSON.applications.map((app: AppAPI) => new App(app));

    return apps;
  }
}
