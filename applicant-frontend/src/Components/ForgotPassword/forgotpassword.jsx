import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Handlebars  from 'handlebars';
import { postForgotPassword } from '../../Providers/ApiRequests.js';
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import logo from '../../Components/Header/logo.jpg';
import './forgotpassword.css';

const TEXTS = require('../../static.json');

// const API_PATH = require('../../settings.json').API_PATH;

class ForgotPassword extends Component {
    constructor(props){
        super(props)
    this.state = {
        email: "",
        message: "",
        error: ""
    };
    }
    // forgotPassword = e => {
    //     e.preventDefault();
    //     this.setState({ message: "", error: "" });
    //     forgotPassword(this.state.email).then(data => {
    //         if (data.error) {
    //             this.setState({ error: data.error });
    //         } else {
    //             this.setState({ message: data.message });
    //         }
    //     });
    // };
   forgotPassword = (email) => {
    postForgotPassword({ email: this.state.email.trim() })
    .then((response) => {
      const forgotPasswordTemplate = Handlebars.compile(TEXTS.SUCCESS_MESSAGES.FORGOT_PASSWORD);
      this.props.handleModal(forgotPasswordTemplate({ mailAddress: this.state.email.trim() }), 'Success');
    })
    .catch((error) => {
      this.props.handleModal(error.message ? error.message : error.toString(), 'Error');
    });
  }
  
    render() {
        return (
             <>
             <Header />
            <div className="forgotpassword-wrapper">
                <h1>
           <Link  to="/login">
              <img src={logo} alt="SHA" className="forgotpassword-header-image"/>
           </Link>
          </h1>
                <h2 className="mt-3 mb-3">Rest Password </h2>
                <h4 className="mt-3 mb-3">To reset your password, enter your email below and submit. An email will be sent to you with instructions about how to complete the process.
              </h4>

                {this.state.message && (
                    <h4 className="bg-success">{this.state.message}</h4>
                )}
                {this.state.error && (
                    <h4 className="bg-warning">{this.state.error}</h4>
                )}

                <form>
                    <div className="form-group mt-5">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Your email address"
                            value={this.state.email}
                            name="email"
                            onChange={e =>
                                this.setState({
                                    email: e.target.value,
                                    message: "",
                                    error: ""
                                })
                            }
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={this.forgotPassword}
                        className="btn btn-raised btn-success"
                    >
                        Reset password
                    </button>
                </form>
            </div>
            <Footer version={this.props.version}/>
            </>
        );
    }
}

export default ForgotPassword;