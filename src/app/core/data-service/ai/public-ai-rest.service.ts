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
import {Injectable} from '@angular/core';

import {Observable, of} from 'rxjs';

import {AiTableRequest, AiTableResponse} from '../../model/ai-table';
import {AiRestService} from './ai-rest-service';
import {AiAssistedWritingRequest, AiAssistedWritingResponse} from "../../model/ai-assisted-writing";
import {AiTemplateSuggestionRequest, AiTemplateSuggestionResponse} from "../../model/ai-template-suggestions";
import {AiMassDeleteRequest, AiMassDeleteResponse} from "../../model/ai-mass-delete";
import {AiCheckDataRequest, AiCheckDataResponse} from "../../model/ai-check-data";
import {AiSuggestDataTypeRequest, AiSuggestDataTypeResponse} from "../../model/ai-suggest-data-type";

@Injectable()
export class PublicAiRestService implements AiRestService {
  public getAiTables(request: AiTableRequest): Observable<AiTableResponse> {
    return of({tables: [], responseFromAi: '', error: false, errorMessage: ''});
  }

  public aiAssistedWriting(request: AiAssistedWritingRequest): Observable<AiAssistedWritingResponse> {
    return of({generatedString: '', error: false, errorMessage: ''});
  }

  getAiTemplateSuggestions(request: AiTemplateSuggestionRequest): Observable<AiTemplateSuggestionResponse> {
    return of({bestMatchTemplates: [], error: false, errorMessage: ''});
  }

  getAiMassDelete(request: AiMassDeleteRequest): Observable<AiMassDeleteResponse> {
    return of({idsToBeDeleted: [], error: false, errorMessage: ''});
  }

  getAiCheckData(request: AiCheckDataRequest): Observable<AiCheckDataResponse> {
    return of({invalidData: [], error: false, errorMessage: ''});
  }

  getAiSuggestDataType(request: AiSuggestDataTypeRequest): Observable<AiSuggestDataTypeResponse> {
    return of({attribute: null, error: false, errorMessage: ''});
  }
}
