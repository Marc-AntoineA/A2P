'using strict';

import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { resetPassword } from "../../Providers/auth";
import { Button, Form, Container } from 'react-bootstrap';
import Input from '../../Components/Input/Input.jsx';
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import logo from '../../Components/Header/logo.jpg';
import './styles.css';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
        };

        this.resetPassword = this.resetPassword.bind(this);
        this.setPassword = this.setPassword.bind(this);
    }

    resetPassword(e) {
        e.preventDefault();
        this.setState({ message: "", error: "" });
        resetPassword({
            newPassword: this.state.newPassword,
            resetPasswordLink: this.props.match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                this.props.handleModal(data.error, 'Error');
            } else {
                console.log(data.message);
                this.props.handleModal(data.message, 'Success');
            }
        });
    }

    setPassword(value) {
        this.setState(prevState => { prevState.newPassword = value; return prevState });
    }

    render() {
        return (
            <>
            <Header />
            <div className="single-box-form">
                <h1>
                    <Link  to="/">
                        <img src={logo} alt="SHA" className="header-image"/>
                    </Link>
                </h1>
                <h2 className="mt-3 mb-3">Reset your password</h2>

                <Form>
                  <Form.Group controlId="formGroupEmail" className="input-group mb-3">
                    <Form.Label className='red-label'>Your new password</Form.Label>
                    <Input id='0' type='password' onChange={this.setPassword}
                      className='form-control' placeholder='Your new password'>
                    </Input>
                  </Form.Group>
                  <Form.Group>
                    <Button className="submit-button btn btn-danger round-button" size='lg' onClick={ this.resetPassword } variant="primary" block>
                        Change your password
                    </Button>
                  </Form.Group>
                  <Form.Group className='right-aligned'>
                  </Form.Group>
                </Form>
            </div>
            <Footer />
            </>
        );
    }
}

export default ResetPassword;
