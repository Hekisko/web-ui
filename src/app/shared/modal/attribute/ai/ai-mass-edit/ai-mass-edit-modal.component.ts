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
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit, signal,
  WritableSignal
} from '@angular/core';

import {Store, select} from '@ngrx/store';

import {BsModalRef} from 'ngx-bootstrap/modal';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import { map} from 'rxjs/operators';

import {AllowedPermissions} from '../../../../../core/model/allowed-permissions';
import {AppState} from '../../../../../core/store/app.state';
import {Attribute, Collection} from '../../../../../core/store/collections/collection';
import {findAttribute} from '../../../../../core/store/collections/collection.util';
import {selectCollectionById} from '../../../../../core/store/collections/collections.state';
import {selectLinkTypeByIdWithCollections} from '../../../../../core/store/link-types/link-types.state';
import {LinkType} from '../../../../../core/store/link-types/link.type';
import {Workspace} from '../../../../../core/store/navigation/workspace';
import {
  selectCollectionPermissions,
  selectLinkTypePermissions,
} from '../../../../../core/store/user-permissions/user-permissions.state';
import {KeyCode, keyboardEventCode} from '../../../../key-code';
import {selectDocumentsByCollectionId} from "../../../../../core/store/documents/documents.state";
import {ConstraintData} from "@lumeer/data-filters";
import {selectConstraintData} from "../../../../../core/store/constraint-data/constraint-data.state";
import {DocumentModel} from "../../../../../core/store/documents/document.model";
import {ModalService} from "../../../modal.service";
import {
  AiMassEditConfirmationModalComponent
} from "./ai-mass-edit-confirmation/ai-mass-edit-confirmation-modal.component";
import {SimpleTable} from "../simple-table/simple-table.component";
import {AiService} from "../../../../../core/ai/ai.service";
import {AiMassDeleteResponse} from "../../../../../core/model/ai-mass-delete";

@Component({
  selector: 'ai-mass-edit-modal',
  templateUrl: './ai-mass-edit-modal.component.html',
  styleUrls: ['./ai-mass-edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiMassEditModalComponent implements OnInit, OnDestroy {
  @Input()
  public collectionId: string;

  @Input()
  public linkTypeId: string;

  @Input()
  public attributeId: string;

  @Input()
  public workspace: Workspace;

  public collection$: Observable<Collection>;
  public linkType$: Observable<LinkType>;
  public attribute$: Observable<Attribute>;
  public permissions$: Observable<AllowedPermissions>;
  public performingAction$ = new BehaviorSubject(false);

  private subscriptions = new Subscription();

  public changesDesc: string;
  public wantedChangesDesc$ = new BehaviorSubject<string>("");

  public simpleTable: SimpleTable;
  public aiMassDeleteResponse: WritableSignal<AiMassDeleteResponse | null>;
  public buttonEnabled$ = new BehaviorSubject<boolean>(true);
  public errorMessage$ = new BehaviorSubject<string>("");

  constructor(
    private bsModalRef: BsModalRef,
    private store$: Store<AppState>,
    private modalService: ModalService,
    private aiService: AiService
  ) {}

  public ngOnInit() {
    if (this.collectionId) {
      this.collection$ = this.store$.pipe(select(selectCollectionById(this.collectionId)));
      this.attribute$ = this.collection$.pipe(
        map(collection => findAttribute(collection?.attributes, this.attributeId))
      );
      this.permissions$ = this.store$.pipe(select(selectCollectionPermissions(this.collectionId)));
    } else if (this.linkTypeId) {
      this.linkType$ = this.store$.pipe(select(selectLinkTypeByIdWithCollections(this.linkTypeId)));
      this.attribute$ = this.linkType$.pipe(map(linkType => findAttribute(linkType?.attributes, this.attributeId)));
      this.permissions$ = this.store$.pipe(select(selectLinkTypePermissions(this.linkTypeId)));
    }
  }

  public hideDialog() {
    this.bsModalRef.hide();
  }

  public onSubmit() {
    const rowDataObserv = this.store$.pipe(select(selectDocumentsByCollectionId(this.collectionId)));
    let rows: DocumentModel[];
    this.subscriptions.add(rowDataObserv.subscribe(data => {
      rows = data;
    }));

    let collection: Collection;
    this.subscriptions.add(this.store$.pipe(select(selectCollectionById(this.collectionId))).subscribe(data => {
      collection = data;
    }));

    let constraintData: ConstraintData;
    const constraintDataObserv = this.store$.pipe(select(selectConstraintData));
    this.subscriptions.add(constraintDataObserv.subscribe((data: ConstraintData) => {
      constraintData = data;
    }));

    let headersAsString: string[] = [];
    headersAsString.push("ID_ROW");
    let headers: any[] = [];
    collection.attributes.map(attribute => {
      headersAsString.push(attribute.name);
      headers.push({
        attribute: attribute
      });
    })

    let rowsAsString: string[] = [];
    let columnWidth: Record<string, number> = {};
    let rowsData: any[] = [];
    rows.map(document => {
      let simpleCellData: any[] = [];
      let rowAsString: string[] = [];
      rowAsString.push(document.id);
      headers.forEach(header => {
        let maxWidth;
        if (header.attribute.id in columnWidth) {
          maxWidth = columnWidth[header.attribute.id];
        } else {
          maxWidth = 0;
        }
        for (const data in document.data) {
          if (header.attribute.id === data) {
            const dataValue = header.attribute.constraint.createDataValue(document.data[data], constraintData);
            rowAsString.push(dataValue.format());
            columnWidth[header.attribute.id] =
              Math.max(maxWidth, dataValue.format().length);
            simpleCellData.push({
              dataValue: dataValue,
              attribute: header.attribute
            });
            return;
          }
        }
        const dataValue = header.attribute.constraint.createDataValue("", constraintData);
        rowAsString.push(dataValue.format());
        columnWidth[header.attribute.id] =
          Math.max(maxWidth, header.attribute.name.length);
        simpleCellData.push({
          dataValue: dataValue,
          attribute: header.attribute
        });
      });
      rowsData.push({
        id: document.id,
        cells: simpleCellData
      });
      rowsAsString.push(rowAsString.join("|"));
    })

    this.simpleTable = {
      tableName: collection.name,
      headers: headers,
      rows: rowsData,
      columnWidth: columnWidth
    };

    rowsAsString.unshift(headersAsString.join("|"));
    this.aiService.massDelete$ = signal(null);
    this.aiMassDeleteResponse = this.aiService.massDelete$;
    this.aiService.fetchMassDelete({
        deleteDescription: this.changesDesc,
        data: rowsAsString
      }
    );
    this.errorMessage$.next("");
    this.buttonEnabled$.next(false);
  }

  public onDataReceived(data: any): boolean {

    if (data === undefined) {
      return false;
    } else if (data() === null) {
      return true;
    } else {

      this.buttonEnabled$.next(true);
      this.errorMessage$.next("");
      this.aiMassDeleteResponse = undefined;

      if (data().length == 0 || data()["error"]) {
        this.errorMessage$.next(data()["errorMessage"]);
        return false;
      }

      this.modalService.show(
        AiMassEditConfirmationModalComponent,
        {
          keyboard: false,
          backdrop: 'static',
          initialState:
            {
              simpleTable: this.simpleTable,
              idToBeDeleted: data()["idsToBeDeleted"],
              collectionId: this.collectionId
            }
        }
      );
      this.bsModalRef.hide();
      return false;
    }
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
    if (keyboardEventCode(event) === KeyCode.Escape && !this.performingAction$.getValue()) {
      this.hideDialog();
    }
  }

  public onInputChanged(value: string) {
    this.changesDesc = value;
    this.wantedChangesDesc$.next(this.changesDesc);
  }

  public wantedChangesHolder(): string {
    return $localize`:@@ai.mass.edit.modal.input.placeholder:Describe what you want to delete`;
  }
}
