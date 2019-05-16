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

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AccordionModule, ModalModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {ClipboardModule} from 'ngx-clipboard';
import {NgxElectronModule} from 'ngx-electron';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {ListOfAppsComponent} from './list-of-apps/list-of-apps.component';
import {ModalDialogComponent} from './shared/modal-dialog/modal-dialog.component';
import {SettingsComponent} from './settings/settings.component';
import {SettingsLogsComponent} from './settings/logs/settings-logs.component';
import {LogsComponent} from './logs/logs.component';
import {AppConfigComponent} from './app-config/app-config.component';
import {AppDirectoryFormModalComponent} from './settings/app-directory-form-modal/app-directory-form-modal.component';

import {InitializeService} from './services/initialize.service';
import {HelperService} from './services/helper.service';

@NgModule({
  imports: [
    AccordionModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    ClipboardModule,
    FormsModule,
    ModalModule.forRoot(),
    NgbModule.forRoot(),
    NgxElectronModule
  ],
  declarations: [
    AppComponent,
    AppConfigComponent,
    ListOfAppsComponent,
    LogsComponent,
    ModalDialogComponent,
    SettingsComponent,
    SettingsLogsComponent,
    ToolbarComponent,
    AppDirectoryFormModalComponent
  ],
  providers: [
    HelperService,
    InitializeService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
