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
import {
  ConstraintData,
  ConstraintType,
  SelectConstraintConfig,
} from "@lumeer/data-filters";
import {selectConstraintData} from "../../../../../core/store/constraint-data/constraint-data.state";
import {DocumentModel} from "../../../../../core/store/documents/document.model";
import {AiService} from "../../../../../core/ai/ai.service";
import {AiSuggestDataTypeResponse} from "../../../../../core/model/ai-suggest-data-type";
import {objectValues} from "../../../../utils/common.utils";
import {parseSelectTranslation} from "../../../../utils/translation.utils";
import {isUsedConstraintAttribute} from "../../../../utils/attribute.utils";
import {NotificationService} from "../../../../../core/notifications/notification.service";
import {isSelectConstraintOptionValueRemoved} from "../../type/form/constraint-config/select/select-constraint.utils";
import {CollectionsAction} from "../../../../../core/store/collections/collections.action";
import {LinkTypesAction} from "../../../../../core/store/link-types/link-types.action";

@Component({
  selector: 'ai-suggest-data-type-modal',
  templateUrl: './ai-suggest-data-type-modal.component.html',
  styleUrls: ['../ai-mass-edit/ai-mass-edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiSuggestDataTypeModalComponent implements OnInit, OnDestroy {
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

  public aiSuggestDataType: WritableSignal<AiSuggestDataTypeResponse | null>;
  public errorMessage$ = new BehaviorSubject<string>("");
  public suggestedAttribute$ = new BehaviorSubject<Attribute>(null);

  constructor(
    private bsModalRef: BsModalRef,
    private store$: Store<AppState>,
    private aiService: AiService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {
  }

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
      rows = data;
    }));

    let constraintData: ConstraintData;
    const constraintDataObserv = this.store$.pipe(select(selectConstraintData));
    this.subscriptions.add(constraintDataObserv.subscribe((data: ConstraintData) => {
      constraintData = data;
    }));

    let attribute: Attribute;
    this.subscriptions.add(this.attribute$.subscribe(data => {
      attribute = data;
    }));

    let dataToBeSent: string[] = [];
    rows.map(document => {
      for (const data in document.data) {
        if (attribute.id === data) {
          const dataValue = attribute.constraint.createDataValue(document.data[data], constraintData);
          dataToBeSent.push(dataValue.format());
        }
      }
    });

    this.aiService.suggestDataType$ = signal(null);
    this.aiSuggestDataType = this.aiService.suggestDataType$;
    this.errorMessage$.next("");
    this.aiService.fetchSuggestDataType(
      {
        data: dataToBeSent,
        attribute: attribute
      }
    );
  }

  public onDataReceived(data: any): boolean {
    if (data === undefined) {
      return false;
    } else if (data() === null) {
      return true;
    } else {

      this.aiSuggestDataType = undefined;

      if (data().length == 0 || data()["error"]) {
        this.errorMessage$.next(data()["errorMessage"]);
        this.cdr.detectChanges();
        return false;
      }

      this.suggestedAttribute$.next(data()["attribute"]);
      this.cdr.detectChanges();
      return false;
    }
  }

  public onSubmit() {
    if (this.checkWarningBeforeSave(this.suggestedAttribute$.value)) {
      this.saveAttributeChange();
    }
  }

  private checkWarningBeforeSave(attribute: Attribute): boolean {
    if (this.shouldWarnAboutDeletedFiles(attribute)) {
      this.showFilesConstraintChangePrompt(attribute);
      return false;
    }
    switch (attribute.constraint?.type) {
      case ConstraintType.Select:
        return this.checkWarningBeforeSaveSelect(attribute);
      default:
        return true;
    }
  }

  private checkWarningBeforeSaveSelect(attribute: Attribute): boolean {
    const previousConfig = this.suggestedAttribute$.value.constraint.config as SelectConstraintConfig;
    const nextConfig = attribute.constraint.config as SelectConstraintConfig;

    if (
      isUsedConstraintAttribute(this.suggestedAttribute$.value, ConstraintType.Select) &&
      isSelectConstraintOptionValueRemoved(previousConfig, nextConfig)
    ) {
      this.showSelectValueChangePrompt(attribute);
      return false;
    }
    return true;
  }

  private showFilesConstraintChangePrompt(attribute: Attribute) {
    const title = $localize`:@@constraint.files.modify.constraint.title:Delete all files?`;
    const message = $localize`:@@constraint.files.modify.constraint.message:Changing the constraint type from 'File attachment' will permanently remove all attachments in this column. Do you want to proceed?`;
    this.notificationService.confirmYesOrNo(message, title, 'danger', () => this.saveAttributeChange());
  }

  private showSelectValueChangePrompt(attribute: Attribute) {
    const title = $localize`:@@constraint.select.modify.value.title:Remove options?`;
    const message = $localize`:@@constraint.select.modify.value.message:You are modifying the value of an option which might be used in some records. This will make those records value invalid. Do you want to proceed?`;
    this.notificationService.confirmYesOrNo(message, title, 'danger', () => this.saveAttributeChange());
  }

  private shouldWarnAboutDeletedFiles(attribute: Attribute): boolean {
    return (
      isUsedConstraintAttribute(this.suggestedAttribute$.value, ConstraintType.Files) &&
      attribute.constraint.type !== ConstraintType.Files
    );
  }

  public getAttributeAsText(): string {

    if (this.suggestedAttribute$.value == null) {
      return "";
    }

    const localizedTypes: Record<string, string> = {};
    objectValues(ConstraintType)
    .map(type => {
      localizedTypes[type] = parseSelectTranslation(
        $localize`:@@constraint.type:{type, select, Address {Address} Boolean {Checkbox} Action {Action} Color {Color} Coordinates {Coordinates} DateTime {Date} FileAttachment {File attachment} Duration {Duration} None {None} Number {Number} Percentage {Percentage} Link {Link} Select {Selection} Text {Text} User {User} View {View}}`,
        {type});
    });

    return localizedTypes[this.suggestedAttribute$.value.constraint.type];
  }

  private saveAttributeChange() {
    if (this.collectionId) {
      this.updateCollectionAttribute(this.collectionId, this.suggestedAttribute$.value);
    } else if (this.linkTypeId) {
      this.updateLinkTypeAttribute(this.linkTypeId, this.suggestedAttribute$.value);
    }
  }

  private updateCollectionAttribute(collectionId: string, attribute: Attribute) {
    this.store$.dispatch(
      new CollectionsAction.ChangeAttribute({
        collectionId,
        attributeId: attribute.id,
        attribute,
        workspace: this.workspace,
        onSuccess: () => this.hideDialog(),
        onFailure: () => this.performingAction$.next(false),
      })
    );
  }

  private updateLinkTypeAttribute(linkTypeId: string, attribute: Attribute) {
    this.store$.dispatch(
      new LinkTypesAction.UpdateAttribute({
        linkTypeId,
        attributeId: attribute.id,
        attribute,
        workspace: this.workspace,
        onSuccess: () => this.hideDialog(),
        onFailure: () => this.performingAction$.next(false),
      })
    );
  }

  public hideDialog() {
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
