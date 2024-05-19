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
import {AiMassEditModalComponent} from "./ai-mass-edit/ai-mass-edit-modal.component";
import {ModalWrapperModule} from "../../wrapper/modal-wrapper.module";
import {CommonModule} from "@angular/common";
import {AttributeCommonModalModule} from "../common/attribute-common-modal.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PickerModule} from "../../../picker/picker.module";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {SelectModule} from "../../../select/select.module";
import {DateTimeModule} from "../../../date-time/date-time.module";
import {PresenterModule} from "../../../presenter/presenter.module";
import {PipesModule} from "../../../pipes/pipes.module";
import {DirectivesModule} from "../../../directives/directives.module";
import {FilterPreviewModule} from "../../../builder/filter-preview/filter-preview.module";
import {FilterBuilderModule} from "../../../builder/filter-builder/filter-builder.module";
import {RouterModule} from "@angular/router";
import {InputModule} from "../../../input/input.module";
import {ProgressModule} from "../../../progress/progress.module";
import {AttributeLockModalModule} from "../lock/attribute-lock-modal.module";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {DataInputModule} from "../../../data-input/data-input.module";
import {SimpleTableComponent} from "./simple-table/simple-table.component";
import {
  AiMassEditConfirmationModalComponent
} from "./ai-mass-edit/ai-mass-edit-confirmation/ai-mass-edit-confirmation-modal.component";
import {AiCheckValuesModalComponent} from "./ai-check-values/ai-check-values-modal.component";
import {AiSuggestDataTypeModalComponent} from "./ai-suggest-data-type/ai-suggest-data-type-modal.component";

@NgModule({
  declarations: [
    AiMassEditModalComponent, SimpleTableComponent, AiMassEditConfirmationModalComponent, AiCheckValuesModalComponent, AiSuggestDataTypeModalComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalWrapperModule,
        PickerModule,
        DragDropModule,
        SelectModule,
        DateTimeModule,
        PresenterModule,
        PipesModule,
        DirectivesModule,
        FilterPreviewModule,
        FilterBuilderModule,
        RouterModule,
        InputModule,
        ProgressModule,
        AttributeCommonModalModule,
        AttributeLockModalModule,
        TooltipModule,
        DataInputModule,
    ],
  exports: [AiMassEditModalComponent, SimpleTableComponent, AiCheckValuesModalComponent, AiSuggestDataTypeModalComponent],
})
export class AiModalModule {}
