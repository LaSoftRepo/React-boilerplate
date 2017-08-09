
/* High order component (HOC) for conditional redirection
 * Arguments:
 *
 *  conditionFunction {function}
 *  pathnameToRoute {string}
 *  replaceHistory {boolean}
 *  Component {React.Component}
 *
 *  redirect(conditionFunction, pathnameToRoute, overwriteHistory)(Component)
 *
 * Example of usage for Component:
 *
 *  import { ifUserNotAuthorize } from './credentials';
 *
 *  @redirect(ifUserNotAuthorize, '/login')
 *  class SomeContainer extends React.Component {
 *    constructor(props) {
 *      super(props);
 *    }
 *  }
 *
 * for render function:
 *
 *  const SomeRestrictedContainer = redirect(ifUserNotAuthorize)((props) => <div></div>));
 *
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace, push } from 'react-router-redux';
import reactHOC from 'react-hoc';
import moize from 'moize';

const redirect = (condition, toPath = '/login', overwrite = true) =>
  reactHOC(WrappedComponent =>
    @connect(({ router }) => ({ router }))
    class extends Component {
      componentWillMount() {
        this.checkCondition(this.props);
      }

      componentWillReceiveProps(nextProps) {
        if (nextProps.router.location !== this.props.router.location) {
          this.checkCondition(nextProps);
        }
      }

      checkCondition(params) {
        if (toPath && toPath.startsWith('/')) {
          if (condition()) {
            // TODO check if /login router exists
            if (overwrite) {
              params.dispatch(replace({ pathname: toPath }));
            } else {
              params.dispatch(push({ pathname: toPath }));
            }
          }
        } else {
          console.warn(`redirect: Invalid pathname "${ toPath }". Path should starts with slash "/"`);
        }
      }

      render() {
        return <WrappedComponent { ...this.props } />
      }
    }
  )

export default moize(redirect, { maxSize: 20 });