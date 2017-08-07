import React from 'react';
import PropTypes from 'prop-types';
import './app.scss'

const Header = () => null
const Footer = () => null

export default class App extends React.Component {
  static propTypes = {
    children:    PropTypes.node,
    hideHeader:  PropTypes.bool,
    hideFooter:  PropTypes.bool,
    hideSidebar: PropTypes.bool,
  }

  static defaultProps = {
    hideHeader:  false,
    hideFooter:  false,
    hideSidebar: false,
  }

  render() {
    return (
      <div className='app'>
        { this.props.hideHeader ? <Header /> : null }
        { React.Children.toArray(this.props.children) }
        { this.props.hideFooter ? <Footer /> : null }
      </div>
    );
  }
}