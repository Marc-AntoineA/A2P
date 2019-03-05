'using strict';

import React, { Component } from 'react';
import './styles.css';

import Header from '../../Components/Header/Header.jsx';

import { Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class Welcome extends Component {
  render() {
    return (
      <div>
        <Header></Header>
        <main>
          <h2>Welcome Page</h2>
          <div>
            <Button href='/signin' variant='success' block>Apply now</Button>
            <Button href='/login' variant='info' block>Already registered</Button>
          </div>
        </main>
      </div>
    );
  }
}

export default Welcome;
