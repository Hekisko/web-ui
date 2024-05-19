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
import {Injectable, Signal, signal, WritableSignal} from '@angular/core';

import {of} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AiRestService} from '../data-service/ai/ai-rest-service';
import {AiTableRequest, AiTableResponse} from '../model/ai-table';
import {NotificationService} from '../notifications/notification.service';
import {Attribute, Collection} from '../store/collections/collection';
import {AiAssistedWritingRequest, AiAssistedWritingResponse} from "../model/ai-assisted-writing";
import {AiTemplateSuggestionRequest, AiTemplateSuggestionResponse} from "../model/ai-template-suggestions";
import {AiMassDeleteRequest, AiMassDeleteResponse} from "../model/ai-mass-delete";
import {AiCheckDataRequest, AiCheckDataResponse} from "../model/ai-check-data";
import {AiSuggestDataTypeRequest, AiSuggestDataTypeResponse} from "../model/ai-suggest-data-type";

@Injectable()
export class AiService {
  public tables$: WritableSignal<AiTableResponse | null> = signal(null);
  public assistedWriting$: WritableSignal<AiAssistedWritingResponse | null> = signal(null);
  public templateSuggestions$: WritableSignal<AiTemplateSuggestionResponse | null> = signal(null);
  public massDelete$: WritableSignal<AiMassDeleteResponse | null> = signal(null);
  public checkData$: WritableSignal<AiCheckDataResponse | null> = signal(null);
  public suggestDataType$: WritableSignal<AiSuggestDataTypeResponse | null> = signal(null);

  constructor(
    private aiRestService: AiRestService,
    private notificationsService: NotificationService
  ) {}

  public fetchTableSuggestions(request: AiTableRequest): void {
    this.aiRestService
      .getAiTables(request)
      .pipe(
        catchError(err => {
          this.notificationsService.error(err);
          return of({
            tables: null,
            responseFromAi: null,
            error: true,
            errorMessage: err
          });
        })
      )
      .subscribe(response => this.tables$.set(response));
  }

  public fetchAssistedWriting(request: AiAssistedWritingRequest): void {
    this.aiRestService
      .aiAssistedWriting(request)
      .pipe(
        catchError(err => {
          this.notificationsService.error(err);
          return of({
            generatedString: null,
            error: true,
            errorMessage: err
          });
        })
      )
      .subscribe(response => this.assistedWriting$.set(response));
  }

  public fetchTemplateSuggestions(request: AiTemplateSuggestionRequest): void {
    this.aiRestService
      .getAiTemplateSuggestions(request)
      .pipe(
        catchError(err => {
          this.notificationsService.error(err);
          return of({
            bestMatchTemplates: null,
            error: true,
            errorMessage: err
          });
        })
      )
      .subscribe(response => this.templateSuggestions$.set(response));
  }

  public fetchMassDelete(request: AiMassDeleteRequest): void {
    this.aiRestService
      .getAiMassDelete(request)
      .pipe(
        catchError(err => {
          this.notificationsService.error(err);
          return of({
            idsToBeDeleted: null,
            error: true,
            errorMessage: err
          });
        })
      )
      .subscribe(response => this.massDelete$.set(response));
  }

  public fetchCheckData(request: AiCheckDataRequest): void {
    this.aiRestService
      .getAiCheckData(request)
      .pipe(
        catchError(err => {
          this.notificationsService.error(err);
          return of({
            invalidData: null,
            error: true,
            errorMessage: err
          });
        })
      )
      .subscribe(response => this.checkData$.set(response));
  }

  public fetchSuggestDataType(request: AiSuggestDataTypeRequest): void {
    this.aiRestService
      .getAiSuggestDataType(request)
      .pipe(
        catchError(err => {
          this.notificationsService.error(err);
          return of({
            attribute: null,
            error: true,
            errorMessage: err
          });
        })
      )
      .subscribe(response => this.suggestDataType$.set(response));
  }
}
