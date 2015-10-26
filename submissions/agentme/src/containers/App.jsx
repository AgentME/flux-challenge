/* @flow */

import Im from 'immutable';
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import wsObservable from '../wsObservable';
import View from '../components/View.jsx';
import * as Actions from '../actions';
import {PlanetItem} from '../types';
import {WS_PLANET_URL} from '../constants';

class App extends React.Component {
  componentDidMount() {
    this.props.dispatch(Actions.init());
    wsObservable(WS_PLANET_URL)
      .onValue(event => this._planetValue(event));
  }

  _planetValue(event) {
    this.props.dispatch(Actions.setPlanet(new PlanetItem(JSON.parse(event.data))));
  }

  render(): ReactElement {
    const {sithList, planet, dispatch} = this.props;
    const boundActions = bindActionCreators(Actions, dispatch);

    let hasMatch = false;
    const sithListWithMatch = sithList.map(sith => {
      const sithObj = sith.toObject();
      sithObj.matched = (planet && sithObj.homeworld && sithObj.homeworld.id === planet.id);
      if (sithObj.matched) {
        hasMatch = true;
      }
      return sithObj;
    });

    const canScrollUp = !hasMatch && sithList.slice(0, sithList.size-2)
      .some(sith => sith.name != null)
    const canScrollDown = !hasMatch && sithList.slice(2)
      .some(sith => sith.name != null)

    return <View
      sithList={sithListWithMatch}
      planet={planet}
      canScrollUp={canScrollUp}
      canScrollDown={canScrollDown}
      onScrollUp={() => {boundActions.scroll(-2);}}
      onScrollDown={() => {boundActions.scroll(2);}}
      />;
  }
}

function mapStateToProps(state) {
  return {
    sithList: state.sithList,
    planet: state.planet
  };
}

export default connect(
  mapStateToProps
)(App);
