/* @flow */

import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './configureStore';
import Root from './containers/Root.jsx';

document.addEventListener('DOMContentLoaded', function() {
  const appContainer = document.getElementById('app-container');
  const store = configureStore();
  ReactDOM.render(<Root store={store} />, appContainer);
});
