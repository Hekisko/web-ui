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
import {ChangeDetectionStrategy, Component, computed, OnInit, signal, WritableSignal} from '@angular/core';

import {Store} from '@ngrx/store';

import {BsModalRef} from 'ngx-bootstrap/modal';
import {DialogType} from "../../../modal/dialog-type";
import {AppState} from "../../../../core/store/app.state";
import {BehaviorSubject} from "rxjs";
import {ModalService} from "../../../modal/modal.service";
import {
  AiCreateTableConfirmationModalComponent
} from "./ai-create-table-confirmation-modal/ai-create-table-confirmation-modal.component";
import {AiService} from "../../../../core/ai/ai.service";
import {AiTableResponse} from "../../../../core/model/ai-table";


@Component({
  selector: 'ai-create-table-modal',
  templateUrl: './ai-create-table-modal.component.html',
  styleUrls: ['./ai-create-table-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiCreateTableModalComponent {
  public readonly dialogType = DialogType;
  public desc: string;
  public projectDesc$ = new BehaviorSubject<string>("");
  public errorMessage$ = new BehaviorSubject<string>("");

  public tables: WritableSignal<AiTableResponse | null>;
  constructor(
      private bsModalRef: BsModalRef,
      private store$: Store<AppState>,
      private modalService: ModalService,
      private aiService: AiService
  ) {}

  public hideDialog() {
    this.bsModalRef.hide();
  }

  public onSubmit() {
    this.aiService.tables$ = signal(null);
    this.tables = this.aiService.tables$;
    this.aiService.fetchTableSuggestions(
      {
        tablesDescription: this.desc,
        oldAiTablesGeneratedStr: null
      }
    );
    this.projectDesc$.next("");
  }

  public onDataReceived(data: any): boolean {

    if (data === undefined) {
      return false;
    } else if (data() === null) {
      return true;
    } else {

      this.tables = undefined;

      if (data().length == 0 || data()["error"]) {
        this.errorMessage$.next(data()["errorMessage"]);
        this.projectDesc$.next(this.desc);
        return false;
      }

      this.modalService.show(
        AiCreateTableConfirmationModalComponent,
        {keyboard: true,
          backdrop: 'static',
          initialState:
            {data: {...data()}}
        });
      this.bsModalRef.hide();
      return false;
    }
  }

  public projectPlaceHolder(): string {
    return $localize`:@@ai.create.table.modal.input.placeholder:Describe your project`;
  }

  public onInputChanged(value: string) {
    this.desc = value;
    this.projectDesc$.next(this.desc);
    this.errorMessage$.next("");
  }

}
