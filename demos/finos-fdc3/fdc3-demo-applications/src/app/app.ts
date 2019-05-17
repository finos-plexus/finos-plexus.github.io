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

export interface IIntent {
  intent: IIntentMetadata;
  apps: IApplication[];
  show?: boolean;
}

export interface IIntentMetadata {
  name: string;
  displayName?: string;
}

export interface IInstrument {
  ric: string;
  description: string;
  [x: string]: string;
}

export interface IMethodImplementation {
  name: string;
  intent?: IMethodIntent[];
  onInvoke: (args: any) => Promise<any>;
}

export interface IListOfWindows {
  [key: string]: IWindow;
}

export interface IWindow {
  intent: string;
  isOpened: boolean;
  isWeb: boolean;
}

interface IMethodIntent {
  name: string;
  contexts?: string;
}

export interface IApplication {
  appId: string;
  name: string;
  manifest: string;
  manifestType: string;
  title?: string;
  show?: boolean;
}

export interface IGlueInteropPlatformConfig {
  application: string;
  gateway?: {
    protocolVersion: number;
    ws: string;
  };
  auth?: {
    username: string;
    password: string;
  };
}
