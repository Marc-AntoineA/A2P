'using strict';

import React, { Component } from 'react';

import Header from '../../Components/Header/Header.jsx';
import { withRouter } from 'react-router-dom';
import history from '../../history';
import ApiRequests from '../../Providers/ApiRequests';

class Summary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      process: {}
    };
    this.getProcessData = this.getProcessData.bind(this);
  }

  componentDidMount() {
    console.log(this.props.user);
    const user = this.props.user;
    if (user === undefined || user.token === undefined) {
      history.push('/');
      return;
    }
    this.getProcessData();
  }

  getProcessData() {
    const id = this.props.user.id;
    ApiRequests.getProcess(id).then((process) => {
      console.log(process);
      this.setState((prevState) => {
        prevState.process = process;
        return prevState;
      });
    }).catch((err) => {
      this.props.handleError(err);
    });

  }

  render() {
    const personalData = this.state.process;
    const steps = this.state.process.steps === undefined ? [] : this.state.process.steps.map((step) => (<li>step.label</li>));

    return (
      <div>
        <Header/>
        <main>
          <h3>Your Process Advancement</h3>
          <div id='personal-data'>
            <h4> Your personal information</h4>
            <ul>
              <li>Your name: { personalData.name }</li>
              <li>Your mail address: { personalData.mailAddress }</li>
              <li>Your phone number: { personalData.phoneNumber }</li>
              <li>Your status: { personalData.status }</li>
            </ul>
          </div>
          <div id='process'>
            <ul>{steps}</ul>
          </div>
        </main>
      </div>
    );
  }
}

export default withRouter(Summary);
