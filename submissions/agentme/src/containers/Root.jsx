/* @flow */

import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
import App from './App.jsx';
import DevTools from './DevTools.jsx';

export default class Root extends React.Component {
  render(): ReactElement {
    const {store} = this.props;
    return (
      <Provider store={store}>
        <div>
          <App />
          <DevTools />
        </div>
      </Provider>
    );
  }
}
Root.propTypes = {
  store: PropTypes.object.isRequired
};
