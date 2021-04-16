/*
 * Lumeer: Modern Data Definition and Processing Platform
 *
 * Copyright (C) since 2017 Lumeer.io, s.r.o. and/or its affiliates.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalWrapperModule} from '../wrapper/modal-wrapper.module';
import {PipesModule} from '../../pipes/pipes.module';
import {PresenterModule} from '../../presenter/presenter.module';
import {InputModule} from '../../input/input.module';
import {TextInputModalComponent} from './text-input-modal.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [TextInputModalComponent],
  imports: [CommonModule, FormsModule, ModalWrapperModule, PipesModule, PresenterModule, InputModule],
})
export class TextInputModalModule {}
