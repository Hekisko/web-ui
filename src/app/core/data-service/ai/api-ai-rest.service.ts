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
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, of} from 'rxjs';
import {map, take} from 'rxjs/operators';

import {ConfigurationService} from '../../../configuration/configuration.service';
import {AiTableResponseDto} from '../../dto/ai-table.dto';
import {
  AiTableRequest,
  AiTableResponse,
  convertAiTableRequestModelToDto,
  convertAiTableResponseDtoToModel
} from '../../model/ai-table';
import {AiRestService} from './ai-rest-service';
import {
  AiAssistedWritingRequest, AiAssistedWritingRequestToDto,
  AiAssistedWritingResponse,
  convertAiAssistedWritingResponseDtoToModel
} from "../../model/ai-assisted-writing";
import {AiAssistedWritingRequestDto, AiAssistedWritingResponseDto} from "../../dto/ai-assisted-writing.dto";
import {
  AiTemplateSuggestionRequest,
  AiTemplateSuggestionResponse, convertAiTemplateSuggestionRequestToDto, convertAiTemplateSuggestionResponseDtoToModel
} from "../../model/ai-template-suggestions";
import {AiTemplateSuggestionRequestDto, AiTemplateSuggestionResponseDto} from "../../dto/ai-template-suggestions.dto";
import {
  AiMassDeleteRequest,
  AiMassDeleteResponse, convertAiMassDeleteRequestToDto,
  convertAiMassDeleteResponseDtoToModel
} from "../../model/ai-mass-delete";
import {AiMassDeleteRequestDto, AiMassDeleteResponseDto} from "../../dto/ai-mass-delete.dto";
import {
  AiCheckDataRequest,
  AiCheckDataResponse,
  convertAiCheckDataRequestToDto,
  convertAiCheckDataResponseDtoToModel
} from "../../model/ai-check-data";
import {AiCheckDataResponseDto} from "../../dto/ai-check-data.dto";
import {
  AiSuggestDataTypeRequest,
  AiSuggestDataTypeResponse,
  convertAiSuggestDataTypeRequestToDto, convertAiSuggestDataTypeResponseDtoToModel
} from "../../model/ai-suggest-data-type";
import {AiSuggestDataTypeResponseDto} from "../../dto/ai-suggest-data-type.dto";

@Injectable()
export class ApiAiRestService implements AiRestService {
  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {}

  public getAiTables(request: AiTableRequest): Observable<AiTableResponse> {
    return this.http.post<AiTableResponseDto>(`${this.apiPrefix()}/tables`, convertAiTableRequestModelToDto(request)).pipe(
      take(1),
      map(dto => convertAiTableResponseDtoToModel(dto))
    );
  }

  public aiAssistedWriting(request: AiAssistedWritingRequest): Observable<AiAssistedWritingResponse> {
    return this.http.post<AiAssistedWritingResponseDto>(`${this.apiPrefix()}/assistedWriting`, AiAssistedWritingRequestToDto(request)).pipe(
      take(1),
      map(dto => convertAiAssistedWritingResponseDtoToModel(dto))
    );
  }

  public getAiTemplateSuggestions(request: AiTemplateSuggestionRequest): Observable<AiTemplateSuggestionResponse> {
    return this.http.post<AiTemplateSuggestionResponseDto>(`${this.apiPrefix()}/template`, convertAiTemplateSuggestionRequestToDto(request)).pipe(
      take(1),
      map(dto => convertAiTemplateSuggestionResponseDtoToModel(dto))
    );
  }

  public getAiMassDelete(request: AiMassDeleteRequest): Observable<AiMassDeleteResponse> {
    return this.http.post<AiMassDeleteResponseDto>(`${this.apiPrefix()}/massDelete`, convertAiMassDeleteRequestToDto(request)).pipe(
      take(1),
      map(dto => convertAiMassDeleteResponseDtoToModel(dto))
    );
  }

  public getAiCheckData(request: AiCheckDataRequest): Observable<AiCheckDataResponse> {
    return this.http.post<AiCheckDataResponseDto>(`${this.apiPrefix()}/checkData`, convertAiCheckDataRequestToDto(request)).pipe(
      take(1),
      map(dto => convertAiCheckDataResponseDtoToModel(dto))
    );
  }

  public getAiSuggestDataType(request: AiSuggestDataTypeRequest): Observable<AiSuggestDataTypeResponse> {
    return this.http.post<AiSuggestDataTypeResponseDto>(`${this.apiPrefix()}/suggestDataType`, convertAiSuggestDataTypeRequestToDto(request)).pipe(
      take(1),
      map(dto => convertAiSuggestDataTypeResponseDtoToModel(dto))
    );
  }

  private apiPrefix(): string {
    return `${this.configurationService.getConfiguration().apiUrl}/rest/ai`;
  }
}
