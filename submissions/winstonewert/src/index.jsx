import React from 'react';
import {Provider} from 'react-redux';
import Root from './root';
import { compose, createStore, applyMiddleware } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { serverMiddleware} from './server'
import '../../../styles.css'
import _ from 'lodash'

const INITIAL_STATE = {
	dark_jedi: [
		{id: 3616},
		{},
		{},
		{},
		{}
	]
}

function update_dark_jedi(dark_jedi, payload) {
	var update_index = _.findIndex(dark_jedi, (jedi) => jedi.id == payload.id);
	return _.map(dark_jedi, (jedi, index) => {
		if (index == update_index) {
			return payload;
		} else if (index + 1 == update_index && !jedi.id) {
			return {id: payload.master.id};
		} else if (index - 1 == update_index && !jedi.id) {
			return {id: payload.apprentice.id};
		} else {
			return jedi;
		}
	});
}

function infer_dark_jedi_ids(dark_jedi) {
	return _.map(dark_jedi, (jedi, index) => {
		if (!jedi.id) {
			// We don't currently know the id of this jedi.
			// Try the jedi before/after to look master/apprentice.
			if (dark_jedi[index-1] 
				&& dark_jedi[index-1].apprentice) {
				return {id: dark_jedi[index-1].apprentice.id};
			}
			if (dark_jedi[index+1] 
				&& dark_jedi[index+1].master) {
				return {id: dark_jedi[index+1].master.id};
			}
		}
		return jedi;			
	});
}

function up_clicked(dark_jedi) {
	return [{}, {}].concat(_.dropRight(dark_jedi, 2));
}

function down_clicked(dark_jedi) {
	return _.drop(dark_jedi, 2).concat([{}, {}]);
}


function reducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case "OBIWAN_LOCATION_CHANGE":
			return {...state, obiwan_location: action.payload};
		case "LOAD_DARK_JEDI":
			return {...state, dark_jedi: update_dark_jedi(state.dark_jedi, action.payload)};
		case "UP_CLICKED":
			return {...state, dark_jedi: infer_dark_jedi_ids(up_clicked(state.dark_jedi))};
		case "DOWN_CLICKED":
			return {...state, dark_jedi: infer_dark_jedi_ids(down_clicked(state.dark_jedi))};
		default:			
			return state;
	}
}

const finalCreateStore = compose(
	applyMiddleware(serverMiddleware),		
	devTools(),
	persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

const store = finalCreateStore(reducer);

React.render(
	<div>		
		<Provider store={store}>
			{() => <Root />}
		</Provider>
		<DebugPanel top right bottom>
			<DevTools store={store} monitor={LogMonitor} />
		</DebugPanel>
	</div>,
	document.getElementById('app')
);
