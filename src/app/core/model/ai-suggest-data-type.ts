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


import {Attribute} from "../store/collections/collection";
import {AiSuggestDataTypeRequestDto, AiSuggestDataTypeResponseDto} from "../dto/ai-suggest-data-type.dto";
import {convertCollectionDtoToModel} from "../store/collections/collection.converter";
import {convertAttributeDtoToModel, convertAttributeModelToDto} from "../store/collections/attribute.converter";

export interface AiSuggestDataTypeResponse {
  attribute: Attribute;
  error: boolean;
  errorMessage: string;
}

export interface AiSuggestDataTypeRequest {
  data: string[];
  attribute: Attribute;
}

export function convertAiSuggestDataTypeResponseDtoToModel(dto: AiSuggestDataTypeResponseDto): AiSuggestDataTypeResponse {
  return {
    attribute: dto.attribute !== null ? convertAttributeDtoToModel(dto.attribute) : null,
    error: dto.error,
    errorMessage: dto.errorMessage,
  };
}

export function convertAiSuggestDataTypeRequestToDto(model: AiSuggestDataTypeRequest): AiSuggestDataTypeRequestDto {
  return {
    data: model.data,
    attribute: convertAttributeModelToDto(model.attribute)
  };
}
