/* @flow */

import _ from 'lodash';
import Im from 'immutable';
import {SithItem, PlanetItem} from '../types';
import {SITH_LIST_LENGTH} from '../constants';

const defaultList = Im.List(_.range(SITH_LIST_LENGTH)
  .map((i) => new SithItem(i === Math.floor(SITH_LIST_LENGTH/2) ? {id: 3616} : undefined)));

function updateIds(sithList: Im.List): Im.List {
  return sithList.map((sith, i) => {
    if (sith.id == null) {
      if (i > 0) {
        const prevSith = sithList.get(i-1);
        if (prevSith && prevSith.nextId != null) {
          return sith.set('id', prevSith.nextId);
        }
      }
      if (i < sithList.size-1) {
        const nextSith = sithList.get(i+1);
        if (nextSith && nextSith.prevId != null) {
          return sith.set('id', nextSith.prevId);
        }
      }
    }
    return sith;
  });
}

export default function sithList(state=defaultList, action: Object) {
  switch(action.type) {
    case 'SCROLL':
      const {delta} = action;
      const newItems = Im.List(_.range(Math.min(Math.abs(delta), SITH_LIST_LENGTH))
        .map(() => new SithItem()));
      const newList = updateIds(delta > 0 ?
        state.slice(delta).concat(newItems) :
        newItems.concat(state.slice(0, delta)));
      const newListHasIds = newList.some(sith => sith.id != null);
      return newListHasIds ? newList : state;
    case 'SET_SITH_REQUEST':
      return state.map(sith => {
        return (sith.id === action.id) ? sith.set('request', action.request) : sith;
      });
    case 'SET_SITH_DATA':
      return updateIds(state.map(sith => {
        return (sith.id === action.id) ? action.sith : sith;
      }));
    default:
      return state;
  }
}
