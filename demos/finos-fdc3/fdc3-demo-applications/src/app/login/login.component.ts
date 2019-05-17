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

import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

import {InitializeService} from '../initialize.servise';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;
  public listOfBuses: string[] = ['Plexus', 'Glue42'];
  public bus: string;

  constructor(private location: Location,
              private initializeService: InitializeService) {
  }

  public ngOnInit(): void {
    this.username = window.localStorage.getItem('fdc3-demo-username');
    this.bus = window.localStorage.getItem('fdc3-demo-bus') || this.listOfBuses[0];
  }

  /**
   * This function is a listener for username change
   * @param username The user's input for username
   */
  public onUsernameChange(username: string): void {
    this.username = username;
  }

  /**
   * This function is a listener for password change
   * @param username The user's input for password
   */
  public onPasswordChange(password: string): void {
    this.password = password;
  }

  /**
   * This function is a listener for bus change
   * @param username The user's input for bus
   */
  public onBusChange(bus: string): void {
    this.bus = bus;
  }

  /**
   * This function logs the current user
   * The form data is saved to the localStorage
   * The FDC3 API Implementation is initialized
   * The page is redirected to the previous page
   */
  public login(): void {
    window.localStorage.setItem('fdc3-demo-username', this.username || '');
    window.localStorage.setItem('fdc3-demo-bus', this.bus);
    this.initializeService.initializeFdc3APIImpl();
    this.location.back();
  }
}
