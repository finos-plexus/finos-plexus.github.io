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

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';

import {ModalDialogComponent} from '../../shared/modal-dialog/modal-dialog.component';

import {HelperService} from '../../services/helper.service';
import {InitializeService} from '../../services/initialize.service';

import {IProvider, IGlue42ToolbarProvider} from '../../app';

@Component({
  selector: 'app-directory-form-modal',
  templateUrl: './app-directory-form-modal.component.html'
})
export class AppDirectoryFormModalComponent implements OnInit, OnDestroy {
  @ViewChild('newAppDirectoryModalDialog') newAppDirectoryModalDialog: ModalDialogComponent;
  public newAppDirectoryModalDialogTitle: string;
  public isAddAppDirectoryModalOpened: boolean;
  public providers: IProvider[] = [];
  public isAppDirectoryNameValid: boolean = true;
  public isApiURLValid: boolean = true;
  public isAuthURLValid: boolean = true;
  public isEmailValid: boolean = true;
  public isPasswordSet: boolean = true;
  public apiURLInvalidFeedback: string;
  public enableCreateBtn: boolean = false;
  public enableEditBtn: boolean = false;
  public editedProviderName: string;

  public _name: string;
  get name(): string {
    return this._name;
  }
  /**
   * Set app directory name
   * Validate and toggle "Create" and "Edit" buttons
   * @param value: input value
   */
  set name(value: string) {
    this._name = value;
    this.isAppDirectoryNameValid = this._name !== '';
    this.toggleButtons();
  }

  public _apiURL: string;
  get apiURL(): string {
    return this._apiURL;
  }
  /**
   * Set API URL
   * Validate and toggle "Create" and "Edit" buttons
   * @param value: input value
   */
  set apiURL(value: string) {
    this._apiURL = value;
    if (this._apiURL === '') {
      this.isApiURLValid = false;
      this.apiURLInvalidFeedback = 'API URL is required';
    } else if (this._apiURL.indexOf('http://') !== 0 && this._apiURL.indexOf('https://') !== 0) {
      this.isApiURLValid = false;
      this.apiURLInvalidFeedback = 'API URL is not valid';
    } else {
      this.isApiURLValid = true;
    }
    this.toggleButtons();
  }

  public _authURL: string;
  get authURL(): string {
    return this._authURL;
  }
  /**
   * Set auth URL
   * Validate and toggle "Create" and "Edit" buttons
   * @param value: input value
   */
  set authURL(value: string) {
    this._authURL = value;
    this.isAuthURLValid = !value || (this._authURL.indexOf('http://') === 0 || this._authURL.indexOf('https://') === 0);
    this.toggleButtons();
  }

  public _email: string;
  get email(): string {
    return this._email;
  }
  /**
   * Set email
   * Validate and toggle "Create" and "Edit" buttons
   * @param value: input value
   */
  set email(value: string) {
    this._email = value;
    this.isEmailValid = !this._email || /\S+@\S+\.\S+/.test(this._email);
    this.isPasswordSet = !this._email || (this._email && this._password !== '');
    this.toggleButtons();
  }

  public _password: string;
  get password(): string {
    return this._password;
  }
  /**
   * Set password
   * Validate and toggle "Create" and "Edit" buttons
   * @param value: input value
   */
  set password(value: string) {
    this._password = value;
    this.isPasswordSet = !this._email || this._email && value !== '';
    this.toggleButtons();
  }

  private subscriptions: Subscription[] = [];

  constructor(private helperService: HelperService,
              private initializeService: InitializeService) {
  }

  ngOnInit() {
    this.subscribeForProviders();
    this.subscribeForShowAppDirectoryModal();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * Create app directory
   */
  public createAppDirectory(): void {
    (window as any).logStream.next([`Created new app provider "${this._name}"`, 'INFO', 'Angular']);
    const providerData: IGlue42ToolbarProvider = {
      name: this._name,
      apiUrl: this._apiURL,
      authUrl: this._authURL,
      email: this._email,
      password: this._password
    };
    (window as any).glue42DemoToolbar.addProvider(providerData);
    this.newAppDirectoryModalDialog.hide();
  }

  /**
   * Edit app directory
   */
  public editAppDirectory(): void {
    (window as any).logStream.next([`Edited app directory "${this._name}"`, 'INFO', 'Angular']);
    const providerData: IGlue42ToolbarProvider = {
      name: this._name,
      apiUrl: this._apiURL,
      authUrl: this._authURL,
      email: this._email,
      password: this._password
    };
    const editedProvider: IProvider = this.providers
      .filter((provider: IProvider) => provider.name === this.editedProviderName)[0];
    (window as any).glue42DemoToolbar.updateProvider(editedProvider, providerData);
    this.newAppDirectoryModalDialog.hide();
  }

  /**
   * Toggle "Create" and "Edit" buttons
   */
  public toggleButtons(): void {
    this.enableCreateBtn = this.isAppDirectoryNameValid && this.isApiURLValid && this.isAuthURLValid &&
      this.isEmailValid && this.isPasswordSet;
    this.enableEditBtn = this.enableCreateBtn;
  }

  /**
   * Subscribe for providers
   */
  private subscribeForProviders(): void {
    this.subscriptions.push(this.initializeService.providers.subscribe((providers: IProvider[]) => {
      this.providers = providers;
    }));
  }

  /**
   * Subscribe for show app directory modal dialog
   * Set all fields as valid before opening the modal dialog
   */
  private subscribeForShowAppDirectoryModal(): void {
    this.subscriptions.push(this.helperService.showAppDirectoryModal
      .subscribe((args: {show: boolean, provider?: IProvider}) => {
        this.isAppDirectoryNameValid = true;
        this.isApiURLValid = true;
        this.isAuthURLValid = true;
        this.isEmailValid = true;
        this.isPasswordSet = true;
        if (args.provider) {
          this.showEditAppDirectoryModalDialog(args.provider);
        } else {
          this.showNewAppDirectoryModalDialog();
        }
      })
    );
  }

  /**
   * Show new app directory modal dialog
   */
  private showNewAppDirectoryModalDialog(): void {
    this.isAddAppDirectoryModalOpened = true;
    this.newAppDirectoryModalDialogTitle = 'Create New App Directory';
    this._name = '';
    this._apiURL = '';
    this._authURL = '';
    this._email = '';
    this._password = '';
    this.isAppDirectoryNameValid = true;
    this.isApiURLValid = true;
    this.enableCreateBtn = false;
    this.newAppDirectoryModalDialog.show();
  }

  /**
   * Show edit app directory modal dialog
   * @param provider: provider
   */
  private showEditAppDirectoryModalDialog(provider: IProvider): void {
    this.isAddAppDirectoryModalOpened = false;
    this.editedProviderName = provider.name;
    this.newAppDirectoryModalDialogTitle = 'Edit App Directory';
    this._name = provider.name;
    this._apiURL = provider.apiUrl;
    this._authURL = provider.authUrl;
    this._email = provider.email;
    this._password = provider.password;
    this.isAppDirectoryNameValid = true;
    this.isApiURLValid = true;
    this.enableEditBtn = true;
    this.newAppDirectoryModalDialog.show();
  }
}
