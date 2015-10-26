/* @flow */

import _ from 'lodash';
import Im from 'immutable';
import type {State} from './types';
import {SithItem, PlanetItem} from './types';
import {SITH_URL_PREFIX} from './constants';

export type Action = {
  type: string;
};
type Thunk = (dispatch: (action: Action|Thunk) => any, getState: () => State) => any;

export function scroll(delta: number): Thunk {
  return (dispatch, getState) => {
    const preSithsWithRequests = getState().sithList
      .filter(sith => sith.request);

    dispatch({
      type: 'SCROLL', delta
    });

    const postSithsSet = getState().sithList
      .map(sith => sith.id).toSet();

    preSithsWithRequests
      .filter(sith => !postSithsSet.has(sith.id))
      .forEach(sith => {
        sith.request.abort();
      });

    dispatch(init());
  };
}

export function init(): Thunk {
  return (dispatch, getState) => {
    const {planet, sithList} = getState();
    if (!planet || !isOnPlanetWithSith(planet.id, sithList)) {
      dispatch(startNewRequests());
    } else {
      dispatch(killAllRequests());
    }
  };
}

function isOnPlanetWithSith(planetid: number, sithList: Im.List): boolean {
  return sithList.some(sith => sith.homeworld && planetid === sith.homeworld.id);
}

function startNewRequests(): Thunk {
  return (dispatch, getState) => {
    const {sithList} = getState();
    sithList.filter(sith =>
      sith.name == null && sith.id != null && sith.request == null
    ).forEach(sith => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        const homeworld = new PlanetItem(data.homeworld);
        const sith = new SithItem({
          id: data.id,
          name: data.name,
          prevId: data.master.id,
          nextId: data.apprentice.id,
          homeworld
        });
        dispatch(setSithData(data.id, sith));
        dispatch(init());
      };
      // xhr.onerror = () => {};
      xhr.open('GET', SITH_URL_PREFIX+sith.id);
      xhr.send();
      dispatch(setSithRequest(sith.id, xhr));
    });
  };
}

function killAllRequests(): Thunk {
  return (dispatch, getState) => {
    const {sithList} = getState();
    sithList
      .filter(sith => sith.request)
      .forEach(sith => {
        sith.request.abort();
        dispatch(setSithRequest(sith.id, null));
      });
  };
}

export function setPlanet(planet: ?PlanetItem): Thunk {
  return (dispatch, getState) => {
    dispatch({
      type: 'SET_PLANET', planet
    });
    dispatch(init());
  };
}

function setSithRequest(id: number, request: ?Object): Action {
  return {
    type: 'SET_SITH_REQUEST', id, request
  };
}

function setSithData(id: number, sith: SithItem): Action {
  return {
    type: 'SET_SITH_DATA', id, sith
  };
}
