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
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  signal, WritableSignal
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
import {ConstraintData, DataValue} from "@lumeer/data-filters";
import {selectConstraintData} from "../../../../../core/store/constraint-data/constraint-data.state";
import {DocumentModel} from "../../../../../core/store/documents/document.model";
import {AiService} from "../../../../../core/ai/ai.service";
import {AiCheckDataResponse} from "../../../../../core/model/ai-check-data";


interface CheckValueDataObject {
  dataValue: DataValue,
  attribute: Attribute | undefined,
  constraintData: ConstraintData,
  valuePresentInRows: number[]
}

@Component({
  selector: 'ai-check-values-modal',
  templateUrl: './ai-check-values-modal.component.html',
  styleUrls: ['./ai-check-values-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiCheckValuesModalComponent implements OnInit, OnDestroy {
  @Input()
  public collectionId: string;

  @Input()
  public linkTypeId: string;

  @Input()
  public attributeId: string;

  @Input()
  public tableId: string;

  @Input()
  public workspace: Workspace;

  public collection$: Observable<Collection>;
  public linkType$: Observable<LinkType>;
  public attribute$: Observable<Attribute>;
  public permissions$: Observable<AllowedPermissions>;
  public performingAction$ = new BehaviorSubject(false);

  private subscriptions = new Subscription();

  public strangeValues$ = new BehaviorSubject<CheckValueDataObject[]>(null);
  public aiCheckData: WritableSignal<AiCheckDataResponse | null>;
  public errorMessage$ = new BehaviorSubject<string>("");
  private checkDataValues: Record<string, CheckValueDataObject> = {};
  constructor(
    private bsModalRef: BsModalRef,
    private store$: Store<AppState>,
    private aiService: AiService,
    private cdr: ChangeDetectorRef
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


    const rowDataObserv = this.store$.pipe(select(selectDocumentsByCollectionId(this.collectionId)));
    let rows: DocumentModel[];
    this.subscriptions.add(rowDataObserv.subscribe(data => {
      rows = data.sort((a, b) => a.id.localeCompare(b.id));
    }));


    let constraintData: ConstraintData;
    const constraintDataObserv = this.store$.pipe(select(selectConstraintData));
    this.subscriptions.add(constraintDataObserv.subscribe((data: ConstraintData) => {
      constraintData = data;
    }));

    let attribute: Attribute;
    this.subscriptions.add(this.attribute$.subscribe(data => {
      attribute = data;
    }))

    let rowCounter = 0;
    rows.map(document => {
      for (const data in document.data) {
        if (attribute.id === data) {
          const dataValue = attribute.constraint.createDataValue(document.data[data], constraintData);
          if (dataValue.format() in this.checkDataValues) {
            this.checkDataValues[dataValue.format()].valuePresentInRows.push(rowCounter);
          } else {
            this.checkDataValues[dataValue.format()] =
              {
                dataValue: dataValue,
                attribute: attribute,
                constraintData: constraintData,
                valuePresentInRows: [rowCounter]
              };
          }
        }
      }
      console.log(this.checkDataValues);
      rowCounter++;
    })

    let dataToBeSent: string[] = [];
    for (let data in this.checkDataValues) {
      dataToBeSent.push(this.checkDataValues[data].dataValue.format());
    }

    this.aiService.checkData$ = signal(null);
    this.aiCheckData = this.aiService.checkData$;
    this.errorMessage$.next("");
    this.aiService.fetchCheckData(
      {
        data: dataToBeSent
      }
    );
  }


  public onDataReceived(data: any): boolean {
    if (data === undefined) {
      return false;
    } else if (data() === null) {
      return true;
    } else {

      this.aiCheckData = undefined;

      if (data().length == 0 || data()["error"]) {
        this.errorMessage$.next(data()["errorMessage"]);
        return false;
      }

      this.strangeValues$.next([])
      data()["invalidData"].forEach(response => {
        if (response in this.checkDataValues) {
          this.strangeValues$.value.push(this.checkDataValues[response]);
        }
      })

      this.cdr.detectChanges();
      return false;
    }
  }
  public hideDialog() {
    this.bsModalRef.hide();
  }

  public onItemClick(value: CheckValueDataObject) {
    this.bsModalRef.onHidden.next({ clickedValue: value });
    this.bsModalRef.hide();
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
}
