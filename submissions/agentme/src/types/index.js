/* @flow */

import Im from 'immutable';

export type State = {
  planet: PlanetItem;
  sithList: Im.List;
};

export const SithItem = Im.Record({
  id: null,
  nextId: null,
  prevId: null,
  request: null,
  name: null,
  homeworld: null
});

export const PlanetItem = Im.Record({
  id: null,
  name: null
});
