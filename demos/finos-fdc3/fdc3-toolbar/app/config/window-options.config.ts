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

import * as path from 'path';
import { BrowserWindowConstructorOptions } from 'electron';

const modalDialogWindowConfig: BrowserWindowConstructorOptions = {
  show: false,
  webPreferences: {
    preload: path.join(__dirname, '..', 'preload.js'),
    nodeIntegration: true
  },
  height: 170,
  width: 780,
  minHeight: 170,
  minWidth: 780
};

const toolbarWindowConfig: BrowserWindowConstructorOptions = {
  show: false,
  webPreferences: {
    preload: path.join(__dirname, '..', 'preload.js'),
    nodeIntegration: true
  },
  x: 200,
  y: 200,
  height: 100,
  width: 800,
  minHeight: 100,
  minWidth: 500
};

export default {
  modalDialog: modalDialogWindowConfig,
  toolbar: toolbarWindowConfig
};
