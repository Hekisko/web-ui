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
import {Observable} from 'rxjs';

import {AiTableRequest, AiTableResponse} from '../../model/ai-table';
import {AiAssistedWritingRequest, AiAssistedWritingResponse} from "../../model/ai-assisted-writing";
import {AiTemplateSuggestionRequest, AiTemplateSuggestionResponse} from "../../model/ai-template-suggestions";
import {AiMassDeleteRequest, AiMassDeleteResponse} from "../../model/ai-mass-delete";
import {AiCheckDataRequest, AiCheckDataResponse} from "../../model/ai-check-data";
import {AiSuggestDataTypeRequest, AiSuggestDataTypeResponse} from "../../model/ai-suggest-data-type";

export abstract class AiRestService {
  public abstract getAiTables(request: AiTableRequest): Observable<AiTableResponse>;
  public abstract aiAssistedWriting(request: AiAssistedWritingRequest): Observable<AiAssistedWritingResponse>;
  public abstract getAiTemplateSuggestions(request: AiTemplateSuggestionRequest): Observable<AiTemplateSuggestionResponse>;
  public abstract getAiMassDelete(request: AiMassDeleteRequest): Observable<AiMassDeleteResponse>;
  public abstract getAiCheckData(request: AiCheckDataRequest): Observable<AiCheckDataResponse>;
  public abstract getAiSuggestDataType(request: AiSuggestDataTypeRequest): Observable<AiSuggestDataTypeResponse>;
}
