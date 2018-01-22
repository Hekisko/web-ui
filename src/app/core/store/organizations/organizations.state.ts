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

import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {createSelector} from '@ngrx/store';
import {AppState} from '../app.state';
import {OrganizationModel} from './organization.model';

export interface OrganizationsState extends EntityState<OrganizationModel> {

  selectedOrganizationId: string;

}

export const organizationsAdapter = createEntityAdapter<OrganizationModel>({selectId: organization => organization.id});

export const initialOrganizationsState: OrganizationsState = organizationsAdapter.getInitialState({
  selectedOrganizationId: null
});

export const selectOrganizationsState = (state: AppState) => state.organizations;
export const selectAllOrganizations = createSelector(selectOrganizationsState, organizationsAdapter.getSelectors().selectAll);
export const selectOrganizationsDictionary = createSelector(selectOrganizationsState, organizationsAdapter.getSelectors().selectEntities);
export const selectSelectedOrganizationId = createSelector(selectOrganizationsState, organizationsState => organizationsState.selectedOrganizationId);
export const selectSelectedOrganization = createSelector(selectOrganizationsDictionary, selectSelectedOrganizationId, (organizations, selectedId) => {
  return selectedId ? organizations[selectedId] : null;
});

export const selectOrganizationByCode = (code) => createSelector(selectAllOrganizations, organizations => {
  return organizations.find(organization => organization.code === code);
});

export const selectOrganizationById = (id) => createSelector(selectOrganizationsDictionary, organizations => {
  return organizations[id];
});