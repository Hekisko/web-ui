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
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit} from '@angular/core';

import {select, Store} from '@ngrx/store';

import {BsModalRef} from 'ngx-bootstrap/modal';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {AppState} from '../../../../../../core/store/app.state';
import {KeyCode, keyboardEventCode} from '../../../../../key-code';
import {SimpleTable} from "../../simple-table/simple-table.component";
import {selectWorkspace} from "../../../../../../core/store/navigation/navigation.state";
import {WorkspaceService} from "../../../../../../workspace/workspace.service";
import {Workspace} from "../../../../../../core/store/navigation/workspace";
import {DocumentService} from "../../../../../../core/data-service";
import {catchError} from "rxjs/operators";
import {NotificationService} from "../../../../../../core/notifications/notification.service";

@Component({
  selector: 'ai-mass-edit-confirmation-modal',
  templateUrl: './ai-mass-edit-confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiMassEditConfirmationModalComponent implements OnInit {
  public simpleTable: SimpleTable;
  public idToBeDeleted: string[];
  public collectionId: string;

  public performingAction$ = new BehaviorSubject(false);
  constructor(
    private bsModalRef: BsModalRef,
    private store$: Store<AppState>,
    private workspaceService: WorkspaceService,
    private documentService: DocumentService,
    private notificationService: NotificationService
  ) {}

  public ngOnInit() {
    this.simpleTable.rows = this.simpleTable.rows.filter((row) => {
      return this.idToBeDeleted.includes(row.id);
    })
  }

  public hideDialog() {
    this.bsModalRef.hide();
  }

  public onSubmit() {
    let workspace;
    this.store$.pipe(select(selectWorkspace)).subscribe(data => {
      workspace = {...data};
    })

    this.workspaceService.selectOrGetUserAndWorkspace(workspace.organizationCode, workspace.projectCode).subscribe(data => {
      workspace.projectId = data.project.id;
      workspace.organizationId = data.organization.id
    })

    this.documentService.removeDocuments(
      this.collectionId,
      this.idToBeDeleted,
      workspace
    ).pipe(
      catchError(err => {
        this.notificationService.error(err);
        return of(true);
      })
    ).subscribe(response => {
      if (!response) {
        this.bsModalRef.hide();
        window.location.reload();
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
    if (keyboardEventCode(event) === KeyCode.Escape && !this.performingAction$.getValue()) {
      this.hideDialog();
    }
  }
}
