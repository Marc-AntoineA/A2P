'using strict';

import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Container } from 'react-bootstrap';

import Handlebars  from 'handlebars';

import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import Input from '../../Components/Input/Input.jsx';
import logo from '../../Components/Header/logo.jpg';
import './styles.css';

import { postForgotPassword } from '../../Providers/ApiRequests.js';
const TEXTS = require('../../static.json');

class ForgotPassword extends Component {

    constructor(props){
      super(props)
      this.state = {
          email: ""
      };

      this.forgotPassword = this.forgotPassword.bind(this);
      this.setEmail = this.setEmail.bind(this);
    }

   forgotPassword(email) {
    postForgotPassword({ mail: this.state.email.trim() })
    .then((response) => {
      const forgotPasswordTemplate = Handlebars.compile(TEXTS.SUCCESS_MESSAGES.FORGOT_PASSWORD);
      this.props.handleModal(forgotPasswordTemplate({ mailAddress: this.state.email.trim() }), 'Success');
    })
    .catch((error) => {
      this.props.handleModal(error.message ? error.message : error.toString(), 'Error');
    });
  }

  setEmail(value) {
    this.setState((prevState) => { prevState.email = value; return prevState });
  }

  render() {
      return (
       <>
        <Header/>
          <div className="forgotpassword-wrapper">
            <h1>
             <Link  to="/login">
                <img src={logo} alt="SHA" className="header-image"/>
             </Link>
            </h1>
            <h2 className="mt-3 mb-3">Reset Password </h2>
            <p className="mt-3 mb-3">{ TEXTS.FORGOT_PASSWORD_VIEW.DESCRIPTION}</p>

            <Form>
              <Form.Group controlId="formGroupEmail" className="input-group mb-3">
                <Form.Label>Your email address</Form.Label>
                <Input id='0' type='email' onChange={this.setEmail}
                  className='form-control' placeholder='Your email'>
                </Input>
              </Form.Group>
              <Form.Group>
                <Button className="submitButton" size='lg' onClick={ this.forgotPassword } variant="primary" block>
                    Change your password
                </Button>
              </Form.Group>
              <Form.Group className='right-aligned'>
              </Form.Group>
            </Form>
          </div>
          <Footer version={this.props.version}/>
          </>
      );
  }
}

export default ForgotPassword;