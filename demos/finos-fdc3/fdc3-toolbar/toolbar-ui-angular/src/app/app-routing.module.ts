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

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ToolbarComponent} from './toolbar/toolbar.component';
import {LogsComponent} from './logs/logs.component';
import {AppConfigComponent} from './app-config/app-config.component';

const routes: Routes = [
  {path: 'toolbar', component: ToolbarComponent},
  {path: 'logs', component: LogsComponent},
  {path: 'app-config/:id', component: AppConfigComponent},
  {path: '', pathMatch: 'full', redirectTo: 'toolbar'},
  {path: '*', pathMatch: 'full', redirectTo: 'toolbar'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
