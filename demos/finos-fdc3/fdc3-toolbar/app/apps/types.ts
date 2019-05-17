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

export interface AppAPI {
  appId: string;
  name: string;
  version: string;
  title: string;
  tooltip: string;
  description: string;
  images: Image[];
  contactEmail: string;
  supportEmail: string;
  publisher: string;
  icons: Icon[];
  customConfig: NameValuePair[];
  intents: Intent[];
  manifestType: string;
  manifest: string;
}

export interface Image {
  url: string;
}

export interface Icon {
  icon: string;
}

export interface Intent {
  name: string;
}

export interface NameValuePair {
  key: string;
  value: string;
}
