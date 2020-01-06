'using strict';

import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import './styles.css';
import logo from './logo.jpg';

class Header extends Component {
  render() {
    return (
      <header>
        <Navbar className="header" bg="light">
          <Navbar.Brand href="/">
            <img className='logo' src={logo} alt='Logo Social Hackers Academy'/>
          </Navbar.Brand>
          {
            this.props.user && this.props.user.token && this.props.user.id ?
            <Nav.Link className='big-link' href='/'>
              Home
            </Nav.Link>
            :
            ''
          }
          <Navbar.Collapse className="justify-content-end">
            { this.props.user && this.props.user.token && this.props.user.id ?
              <Nav.Link className='big-link' href="/login">
              Sign Out
              <FontAwesomeIcon className='signout-icon' size='lg' icon={faSignOutAlt}/>
              </Nav.Link>
              :
              <Nav.Link className='big-link' href="/login">
              Sign In
              <FontAwesomeIcon className='signout-icon' size='lg' icon={faSignInAlt}/>
              </Nav.Link>
            }
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
  }
}

export default Header;
