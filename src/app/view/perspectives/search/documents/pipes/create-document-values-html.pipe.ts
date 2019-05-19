/*
 * Lumeer: Modern Data Definition and Processing Platform
 *
 * Copyright (C) since 2017 Answer Institute, s.r.o. and/or its affiliates.
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

import {Pipe, PipeTransform} from '@angular/core';
import {ConstraintData} from '../../../../../core/model/data/constraint';
import {DocumentModel} from '../../../../../core/store/documents/document.model';
import {createSearchDocumentValuesHtml} from '../search-document-html-helper';
import {Collection} from '../../../../../core/store/collections/collection';

@Pipe({
  name: 'createDocumentValuesHtml',
})
export class CreateDocumentValuesHtmlPipe implements PipeTransform {
  public transform(
    document: DocumentModel,
    collectionsMap: Record<string, Collection>,
    constraintData: ConstraintData
  ): any {
    const collection = collectionsMap[document.collectionId];
    return createSearchDocumentValuesHtml(document, collection, constraintData);
  }
}