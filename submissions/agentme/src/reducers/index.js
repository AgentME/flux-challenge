/* @flow */

import _ from 'lodash';
import Im from 'immutable';
import {combineReducers} from 'redux';
import sithList from './sithList';
import planet from './planet';

const reducer = combineReducers({sithList, planet});
export default reducer;
