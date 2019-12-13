'using strict';

import React, { Component } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
// import Handlebars  from 'handlebars';

import './styles.css';
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import { postLogin } from '../../Providers/ApiRequests.js';
import Input from '../../Components/Input/Input.jsx';
import logo from '../../Components/Header/logo.jpg';


const TEXTS = require('../../static.json');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'mail': '',
      'password': '',
      'isLogged': false
    };
    this.login = this.login.bind(this);
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
        <>{
          this.state.isLogged ?
            <Redirect to='/summary'/>
            :
            <div>
              <Header/>
              <Container className="wrapper">
         <h1>
           <Link className="login-header-link" to="/login">
            <img src={logo} alt="SHA" className="login-header-image"/>
           </Link>
          </h1>
            <h2>{ TEXTS.LOGIN_VIEW.TITLE }</h2>
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
                    <Button className="submitButton" size='lg' onClick={ this.login } variant="primary" block>
                      { TEXTS.LOGIN_VIEW.SUBMIT_BUTTON }
                    </Button>
                  </Form.Group>
                  <Form.Group className='right-aligned'>
                    <Form.Label><Link to="/forgot-password">{ TEXTS.LOGIN_VIEW.FORGOT_PASSWORD_BUTTON }</Link>
                    </Form.Label>
                  </Form.Group>
                </Form>
              </Container>
              <Footer version={this.props.version}/>
            </div>
          }
      </>
    );
  }
}

export default Login;
