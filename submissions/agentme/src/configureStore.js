/* @flow */

import {compose, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createDevTools, persistState} from 'redux-devtools';
import rootReducer from './reducers';
import type {State} from './types';
import DevTools from './containers/DevTools.jsx';

export default function configureStore(initialState: ?State) {
  const finalCreateStore = compose(
    applyMiddleware(thunk),
    DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
  const store = finalCreateStore(rootReducer, initialState);
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers');
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}
