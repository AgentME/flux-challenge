/* @flow */

import _ from 'lodash';
import Im from 'immutable';
import {PlanetItem} from '../types';

export default function planet(state: ?PlanetItem=null, action: Object): ?PlanetItem {
  switch(action.type) {
    case 'SET_PLANET':
      return action.planet;
    default:
      return state;
  }
}
