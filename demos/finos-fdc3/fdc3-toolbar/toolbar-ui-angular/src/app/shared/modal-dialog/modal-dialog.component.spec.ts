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

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ModalModule} from 'ngx-bootstrap';

import {ModalDialogComponent} from './modal-dialog.component';

describe('Modal Dialog Component', () => {
  let component: ModalDialogComponent;
  let fixture: ComponentFixture<ModalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot()
      ],
      declarations: [
        ModalDialogComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDialogComponent);
    component = fixture.componentInstance;
    spyOn(component.modalDialog, 'show');
    spyOn(component.modalDialog, 'hide');
    fixture.detectChanges();
  });

  it('Should show modal dialog', () => {
    component.show();
    expect(component.modalDialog.show).toHaveBeenCalled();
  });

  it('Should hide modal dialog', () => {
    component.hide();
    expect(component.modalDialog.hide).toHaveBeenCalled();
  });
});
