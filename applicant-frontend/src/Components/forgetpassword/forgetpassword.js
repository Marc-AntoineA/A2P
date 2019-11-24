import React, {Component} from 'react';
import { forgotPassword } from "../../Providers/auth";
import Header from '../../Components/Header/Header.jsx'
import Footer from '../../Components/Footer/Footer.jsx'

class ForgotPassword extends Component {
    constructor(props){
        console.log(props)
        super(props)
    this.state = {
        email: "",
        message: "",
        error: ""
    };
    }
    forgotPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });
        forgotPassword(this.state.email).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message });
            }
        });
    };
  
    render() {
        return (
             <>
             <Header />
            <div className="container"
            style={{
                padding: "36px",
                paddingBottom: "24px",
                border: "1px solid #e8e9e9",
                width: "475px",
                marginRight: "auto",
                marginLeft: "auto"
            }}>
                <h1 style ={{textAlign:"center"}}>Social Hackers Academy </h1>
                <h2 className="mt-5 mb-5">Rest Password </h2>
                <h4 className="mt-5 mb-5">To reset your password, enter your email below and submit. An email will be sent to you with instructions about how to complete the process.
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