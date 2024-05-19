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
import {BehaviorSubject} from "rxjs";
import {DialogType} from "../../../../modal/dialog-type";
import {AppState} from "../../../../../core/store/app.state";
import {Collection} from "../../../../../core/store/collections/collection";
import {CollectionsAction} from "../../../../../core/store/collections/collections.action";
import {safeGetRandomIcon} from "../../../../picker/icons";
import {AiService} from "../../../../../core/ai/ai.service";
import {AiTableResponse} from "../../../../../core/model/ai-table";

@Component({
  selector: 'ai-create-table-confirmation-modal',
  templateUrl: './ai-create-table-confirmation-modal.component.html',
  styleUrls: ['./ai-create-table-confirmation-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiCreateTableConfirmationModalComponent implements OnInit {
  public readonly dialogType = DialogType;
  public requestedChanges: string;
  public requestedChanges$ = new BehaviorSubject<string>("");
  public errorMessage$ = new BehaviorSubject<string>("");

  public data: Record<number, any>;
  public simpleTables = []

  public tables: WritableSignal<AiTableResponse | null>;

  constructor(
    private bsModalRef: BsModalRef,
    private store$: Store<AppState>,
    private aiService: AiService
  ) {
  }

  public ngOnInit() {
    this.mapToSimpleTables(this.data["tables"]);
  }

  public hideDialog() {
    this.bsModalRef.hide();
  }

  public onSubmit() {
    for (let dataKey in this.data["tables"]) {
      const collection: Collection = this.data["tables"][dataKey];
      collection.icon = safeGetRandomIcon();
      this.store$.dispatch(
        new CollectionsAction.Create({
          collection: collection
        })
      );
    };
    this.bsModalRef.hide();
  }

  public onSecondarySubmit() {
    this.resetSignal();
    this.tables = this.aiService.tables$;
    this.aiService.fetchTableSuggestions(
      {
        tablesDescription: this.requestedChanges,
        oldAiTablesGeneratedStr: this.data["oldAiTablesGeneratedStr"]
      });
    this.requestedChanges$.next("");
  }

  private resetSignal() {
    this.aiService.tables$ = signal(null);
  }
  public onInputChanged(value: string) {
    this.requestedChanges = value;
    this.requestedChanges$.next(this.requestedChanges);
  }

  public onDataReceived(data: WritableSignal<AiTableResponse | null>): boolean {
    if (data === undefined) {
      return false;
    } else if (data() === null) {
      return true;
    } else {

      this.tables = undefined;

      if (data()["error"]) {
        this.errorMessage$.next(data()["errorMessage"]);
        this.requestedChanges$.next(this.requestedChanges);
        return false;
      }

      this.mapToSimpleTables(data()["tables"]);
      return false;
    }
  }

  private mapToSimpleTables(data) {
    this.simpleTables = [];
    for (let dataKey in data) {
      this.simpleTables.push({
        tableName: data[dataKey].name,
        headers: data[dataKey].attributes.map(attribute => {
          return {attribute: attribute}
        }),
        rows: [],
        columnWidth: {}
      });
    }
  }

  public requestedChangesPlaceHolder(): string {
    return $localize`:@@ai.create.table.modal.confirmation.request.changes.input.placeholder:Please provide your requests for modification.`;
  }

}
