import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { resetPassword } from "../../Providers/auth";
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import logo from '../../Components/Header/logo.jpg';
import './resetpassword.css';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            message: "",
            error: ""
        };
    }

    resetPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });
        resetPassword({
            newPassword: this.state.newPassword,
            resetPasswordLink: this.props.match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message, newPassword: "" });
            }
        });
    };

    render() {
        return (
            <>
            <Header />
            <div className="resetpassword-wrapper">  
                 <h1>
                    <Link  to="/reset">
                        <img src={logo} alt="SHA" className="resetpassword-header-image"/>
                    </Link>
                </h1>
                <h2 className="mt-3 mb-3">Reset your Password</h2> 
               
                {this.state.message && (
                    <h4 className="bg-success">{this.state.message}</h4>
                )}
                {this.state.error && (
                    <h4 className="bg-warning">{this.state.error}</h4>
                )}

                <form>
                    <div className="form-group mt-3 mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Your new password"
                            value={this.state.newPassword}
                            name="newPassword"
                            onChange={e =>
                                this.setState({
                                    newPassword: e.target.value,
                                    message: "",
                                    error: ""
                                })
                            }
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={this.resetPassword}
                        className="btn btn-raised btn-primary"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
            <Footer />
            </>
        );
    }
}

export default ResetPassword;