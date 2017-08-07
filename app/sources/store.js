/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from "redux-logger";
import { persistState } from 'redux-devtools';
import createReducer from './reducers';
import DevTools from './containers/DevTools';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState, history) {

  // Create the store with two common middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
  ];

  // Add some debug middlewares
  if (process.env.NODE_ENV !== "production") {
    const loggerMiddleware = createLogger({
      level:    "info",
      collapsed: true,
      logErrors: true,
      duration:  true,
      colors: {
        title:     () => "#3366ff",
        prevState: () => "#75b8d4",
        nextState: () => "#f6921e",
        action:    () => "#60bd16",
        error:     () => "#aa0000",
      },
    });

    middlewares.unshift(
      loggerMiddleware,
      require("redux-immutable-state-invariant").default(),
    );
  }

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  if (process.env.NODE_ENV !== "production") {
    enhancers.push(
      DevTools.instrument(),
      persistState(
        window.location.href.match(/[?&]debug_session=([^&#]+)\b/)
      )
    );
  }

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers),
  );

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.asyncReducers = {};

  // Make reducers hot reloadable
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then(reducerModule => {
        const createReducers = reducerModule.default;
        const nextReducers   = createReducers(store.asyncReducers);
        store.replaceReducer(nextReducers);
      });
    });
  }

  return store;
}