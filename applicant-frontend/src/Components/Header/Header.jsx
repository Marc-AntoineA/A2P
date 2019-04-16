'using strict';

import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './styles.css';

class Header extends Component {
  render() {
    return (
      <header>
        <Navbar className="header" bg="light">
          <Navbar.Brand href="/">
            <img className='logo' src='/logo.jpg' alt='Logo Social Hackers Academy'/>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            { this.props.user && this.props.user.token && this.props.user.id ?
              <Nav.Link href="/login">Logout</Nav.Link>
              :
              ''
            }
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
  }
}

export default Header;
