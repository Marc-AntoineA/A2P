'using strict';

import React, { Component } from 'react';

import { Navbar } from 'react-bootstrap';

class Header extends Component {
  render() {
    return (
      <header>
        <Navbar bg="light">
          <Navbar.Brand href="#home">Social Hackers Academy</Navbar.Brand>
        </Navbar>
      </header>
    );
  }
}

export default Header;
