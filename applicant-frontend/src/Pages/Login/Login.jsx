'using strict';

import React, { Component } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import Handlebars  from 'handlebars';

import './styles.css';
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import { postLogin, postForgotPassword } from '../../Providers/ApiRequests.js';
import Input from '../../Components/Input/Input.jsx';

const TEXTS = require('../../static.json');

class Login extends Component {
  constructor(props) {
   console.log(props)
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
      const forgotPasswordTemplate = Handlebars.compile(TEXTS.SUCCESS_MESSAGES.FORGOT_PASSWORD);
      this.props.handleModal(forgotPasswordTemplate({ mailAddress: this.state.mail.trim() }), 'Success');
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
              <Container  style={{
                padding: "36px",
                paddingBottom: "24px",
                border: "1px solid #e8e9e9",
                width: "475px",
                marginRight: "auto",
                marginLeft: "auto"
            }}>
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
                    <Button size='lg' onClick={ this.login } variant="primary" block>
                      { TEXTS.LOGIN_VIEW.SUBMIT_BUTTON }
                    </Button>
                    {/* <Button size='lg' onClick={ this.forgotPassword } variant="dark" block>
                      { TEXTS.LOGIN_VIEW.FORGOT_PASSWORD_BUTTON }
                    </Button> */}
                    <p style ={{textAlign:"end"}}>
                        Forgot
                        <Link to="/forgot-password" className="text-primery">
                          {" "}
                           Password?
                      </Link> 
                    </p>
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
