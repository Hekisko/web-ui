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
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {TableImportButtonComponent} from './import/table-import-button.component';
import {SeeMoreButtonComponent} from './see-more/see-more-button.component';
import {AiCreateTableButtonComponent} from "./ai-create-table-button/ai-create-table-button.component";
import {
  AiCreateTableModalComponent
} from "./ai-create-table-button/ai-create-table-modal/ai-create-table-modal.component";
import {ModalWrapperModule} from "../modal/wrapper/modal-wrapper.module";
import {FormsModule} from "@angular/forms";
import {
  AiCreateTableConfirmationModalComponent
} from "./ai-create-table-button/ai-create-table-modal/ai-create-table-confirmation-modal/ai-create-table-confirmation-modal.component";
import {PipesModule} from "../pipes/pipes.module";
import {AiModalModule} from "../modal/attribute/ai/ai-modal.module";

@NgModule({
  declarations: [SeeMoreButtonComponent, TableImportButtonComponent, AiCreateTableButtonComponent, AiCreateTableModalComponent, AiCreateTableConfirmationModalComponent],
    imports: [CommonModule, ModalWrapperModule, FormsModule, PipesModule, AiModalModule],
  exports: [SeeMoreButtonComponent, TableImportButtonComponent, AiCreateTableButtonComponent],
})
export class ButtonModule {}
