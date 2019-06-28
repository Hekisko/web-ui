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

import {environment} from '../../../../../../environments/environment';
import {Address, AddressField} from '../../../../../core/geocoding/address';

const CZECH_DEFAULT_FIELDS = [AddressField.Street, AddressField.City, AddressField.Country];
const ENGLISH_DEFAULT_FIELDS = [AddressField.Street, AddressField.City, AddressField.State, AddressField.Country];

export const ADDRESS_DEFAULT_FIELDS = environment.locale === 'cs' ? CZECH_DEFAULT_FIELDS : ENGLISH_DEFAULT_FIELDS;

const CZECH_EXAMPLE_ADDRESS: Address = {
  street: 'Lumírova 452/9',
  zip: '12800',
  city: 'Praha',
  country: 'Česká republika',
  continent: 'Evropa',
};

const ENGLISH_EXAMPLE_ADDRESS: Address = {
  street: '444 Castro Street',
  zip: '94041',
  city: 'Mountain View',
  state: 'CA',
  country: 'USA',
  continent: 'North America',
};

export const EXAMPLE_ADDRESS = environment.locale === 'cs' ? CZECH_EXAMPLE_ADDRESS : ENGLISH_EXAMPLE_ADDRESS;