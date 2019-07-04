'using strict';

import React, { Component } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import './styles.css';
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import { postLogin, postForgotPassword } from '../../Providers/ApiRequests.js';
import Input from '../../Components/Input/Input.jsx';

const TEXTS = require('../../static.json')

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'mail': '',
      'password': '',
      'isLogged': false
    };
    this.login = this.login.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.handleChangeMail = this.handleChangeMail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  componentWillMount() {
    this.props.handleLogin(undefined);
  }

  login() {
    postLogin({mail: this.state.mail.trim(), password: this.state.password})
    .then((response) => {
      this.props.handleLogin(response)
      .then(() => {
        this.setState((prevState) => {
          prevState.isLogged = true; 
          return prevState;
        });
        this.props.handleModal(TEXTS.SUCCESS_MESSAGES.LOGGED_IN, 'Success');
      });
    }).catch((error) => {
      this.props.handleModal(error.message ? error.message : error.toString());
    });
  }

  forgotPassword() {
    postForgotPassword({ mail: this.state.mail.trim() })
    .then((response) => {
      this.props.handleModal(TEXTS.SUCCESS_MESSAGES.FORGOT_PASSWORD, 'Success');
    })
    .catch((error) => {
      this.props.handleModal(error.message ? error.message : error.toString(), 'Error');
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
        <div>{
          this.state.isLogged ?
            <Redirect to='/summary'/>
            :
            <div>
              <Header/>
              <Container>
                <h2>Login</h2>
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
                  <Form.Group>
                    <Button size='lg' onClick={ this.login } variant="primary" block>
                      Submit
                    </Button>
                    <Button size='lg' onClick={ this.forgotPassword } variant="dark" block>
                      Forgot Password
                    </Button>
                  </Form.Group>
                </Form>
              </Container>
              <Footer version={this.props.version}/>
            </div>
          }
      </div>
    );
  }
}

export default Login;
