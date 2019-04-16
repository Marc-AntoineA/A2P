'using strict';

import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';

import Header from '../../Components/Header/Header.jsx';
import { postLogin } from '../../Providers/ApiRequests.js';
import Input from '../../Components/Input/Input.jsx';
import history from '../../history';

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
  componentWillMount() {
    this.props.handleLogin(undefined);
  }

  login() {
    postLogin({mail: this.state.mail, password: this.state.password}).then((response) => {
      if (response.status === 200) {
        response.json().then((responseJson) => this.props.handleLogin(responseJson));
        return;
      }
      response.json().then((responseJson) => {
        const errorMessage = responseJson.error.message;
        this.props.handleError(errorMessage);
      })
    }).catch((err) => {
      this.props.handleError(err);
    });
  }

  handleChangeMail(value) {
    this.setState((prevState) => {
      prevState.mail = value;
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
            <Form.Group controlId="formGroupEmail" className="input-group mb-3">
              <Form.Label>Email address</Form.Label>
              <Input id='0' type='inline' onChange={ this.handleChangeMail }
                className='form-control' placeholder='Your email'>
              </Input>
            </Form.Group>
            <Form.Group controlId="formGroupPassword" className='input-group mb-3'>
              <Form.Label>Password</Form.Label>
              <Input id='1' type='password' onChange={ this.handleChangePassword }
                className='form-control'></Input>
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
