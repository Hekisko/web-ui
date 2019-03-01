/*
 * Lumeer: Modern Data Definition and Processing Platform
 *
 * Copyright (C) since 2017 Answer Institute, s.r.o. and/or its affiliates.
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
import {TextDataValuePipe} from './text-data-value.pipe';
import {DateTimeDataValuePipe} from './datetime-data-value.pipe';
import {DataValuePipe} from './data-value.pipe';
import {BooleanDataValuePipe} from './boolean-data.pipe';
import {NumberDataValuePipe} from './number-data-value.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [TextDataValuePipe, DateTimeDataValuePipe, DataValuePipe, BooleanDataValuePipe, NumberDataValuePipe],
  exports: [TextDataValuePipe, DateTimeDataValuePipe, DataValuePipe, BooleanDataValuePipe, NumberDataValuePipe],
})
export class DataPipesModule {}