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

export interface IGlue42ToolbarApplication {
  appId: string;
  name: string;
  version: string;
  title: string;
  tooltip: string;
  description: string;
  images: string[];
  contactEmail: string;
  supportEmail: string;
  publisher: string;
  icons: {icon: string}[];
  customConfig: any[];
  intents: any[];
  manifestType: string;
  manifest: string | IApplicationManifest;
  start: () => any;
}

export interface IApplication extends IGlue42ToolbarApplication {
  provider: IProvider;
  iconPath: string;
  showApp: boolean;
  isFavourite: boolean;
}

export interface IApplicationManifest {
  type: string;
  path?: string;
  exePath?: string;
  url?: string;
}

export interface IGlue42ToolbarProvider {
  name: string;
  apiUrl: string;
  email: string;
  password: string;
  authUrl: string;
  getApps?: () => any;
}

export interface IProvider extends IGlue42ToolbarProvider {
  enabled: boolean;
  status: string;
}

export interface ILog {
  timestamp: number;
  type: string;
  origin: string;
  message: string;
  show: boolean;
  date?: string;
}
