import 'babel-polyfill';

import React from 'react';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Link from 'react-router-dom/Link';
import Redirect from 'react-router-dom/Redirect';

import createBrowserHistory from 'history/createBrowserHistory'
import { ConnectedRouter, push, goBack } from 'react-router-redux'

// Root app
import App from './sources/containers/App';
import DevTools from './sources/containers/DevTools';

import configureStore from './sources/store';
import LanguageProvider from './sources/containers/LanguageProvider';

// import i18n messages
import { translations } from './sources/i18n';

const history = createBrowserHistory();

const initialState = {};
const store = configureStore(initialState, history);

const HomePage = () => (
  <ul>
    <li><Link to="/about">About Us</Link></li>
    <li><Link to="/company">Company</Link></li>
  </ul>
);

const AboutPage   = () => <h2>About<button onClick={ () => store.dispatch(goBack()) }>Back</button></h2>;
const CompanyPage = () => <h2>Company<button onClick={ () => store.dispatch(goBack()) }>Back</button></h2>;
const NotFound    = () => <h2>404</h2>;

const render = translations => {
  ReactDOM.render(
    <div>
      <Provider store={ store }>
        <LanguageProvider messages={ translations }>
          <ConnectedRouter history={ history }>
            <App hideHeader hideFooter>
              <div>
                <Switch>
                  <Route exact path="/"  component={ HomePage } />
                  <Route path="/index"   component={ HomePage } />
                  <Route path="/about"   component={ AboutPage } />
                  <Route path="/company" component={ CompanyPage } />
                  <Route component={ NotFound } />
                </Switch>
              </div>
            </App>
          </ConnectedRouter>
        </LanguageProvider>
      </Provider>
      { process.env.NODE_ENV !== "production" ? <DevTools store={ store }/> : null }
    </div>,
    document.getElementById('app')
  );
};


// Hot reloadable translation json files
if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept('./sources/i18n', () => {
    render(translations);
  });
}

/*
if (!window.Intl) {
  (new Promise(resolve => { resolve(import('intl')) }))
    .then(() => Promise.all([
      import('intl/locale-data/jsonp/en.js'),
      import('intl/locale-data/jsonp/ru.js'),
    ]))
    .then(() => render(translations))
    .catch(err => { throw err });
} else {
  render(translations);
}*/

if (!window.Intl) {
  import('intl')
  .then(() => Promise.all([
    import('intl/locale-data/jsonp/en.js'),
    import('intl/locale-data/jsonp/ru.js'),
  ]))
  .then(() => render(translations))
  .catch(err => { throw err });
} else {
  render(translations);
}

if (process.env.NODE_ENV !== 'production') {
  // according this issue https://github.com/garbles/why-did-you-update/issues/45
  let createClass = React.createClass;
  Object.defineProperty(React, 'createClass', {
    set: nextCreateClass => { createClass = nextCreateClass }
  });
  // eslint-disable-next-line global-require
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
}