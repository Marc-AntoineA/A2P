'using strict';

import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import './styles.css';

class Header extends Component {
  render() {
    return (
      <header>
        <Navbar className="header" bg="light">
          <Navbar.Brand href="/">
            <img className='logo' src='/logo.jpg' alt='Logo Social Hackers Academy'/>
          </Navbar.Brand>
        </Navbar>
      </header>
    );
  }
}

export default Header;
