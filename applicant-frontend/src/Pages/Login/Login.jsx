'using strict';

import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';

import Header from '../../Components/Header/Header.jsx';
import { postLogin } from '../../Providers/ApiRequests.js';
import Input from '../../Components/Input/Input.jsx';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'mail': '',
      'password': ''
    };
    this.login = this.login.bind(this);
    this.handleChangeMail = this.handleChangeMail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  login() {
    postLogin({mail: this.state.mail, password: this.state.password}).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }

  handleChangeMail(value) {
    this.setState((prevState) => {
      prevState.password = value;
      return prevState;
    });
  }

  handleChangePassword(value) {
    this.setState((prevState) => {
      prevState.password = value;
      return prevState;
    });
  }

  render() {
    return (
      <div>
        <Header/>
        <main>
          <Form>
            <Form.Group controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Input id='0' type='inline' onChange={ this.handleChangeMail } placeholder='Your email'>
              </Input>
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Input id='1' type='password' onChange={ this.handleChangePassword }></Input>
            </Form.Group>
            <Button onClick={ this.login } variant="primary">
              Submit
            </Button>
          </Form>
          </main>
      </div>
    );
  }
}

export default Login;
