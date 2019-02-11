'using strict';

import React, { Component } from 'react';

import Header from '../../Components/Header/Header.jsx';

import { Button, Form } from 'react-bootstrap';

class Login extends Component {
  render() {
    return (
      <div>
        <Header/>
        <Form>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Button href='/summary' variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default Login;
