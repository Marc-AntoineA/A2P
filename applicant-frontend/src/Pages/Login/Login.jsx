'using strict';

import React, { Component } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import './styles.css';
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import { postLogin } from '../../Providers/ApiRequests.js';
import Input from '../../Components/Input/Input.jsx';

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
    postLogin({mail: this.state.mail, password: this.state.password})
    .then((response) => {
      this.props.handleLogin(response)
      .then(() => {
        this.setState((prevState) => {
          prevState.isLogged = true; 
          return prevState;
        });
      });
    }).catch((error) => {
      this.props.handleError(error.message ? error.message : error.toString());
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
                  <Button className='big' onClick={ this.login } variant="primary">
                    Submit
                  </Button>
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
