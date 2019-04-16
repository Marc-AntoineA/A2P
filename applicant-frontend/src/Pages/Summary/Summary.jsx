'using strict';

import React, { Component } from 'react';

import { Container, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import 'react-accessible-accordion/dist/fancy-example.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEye, faExclamationTriangle, faEdit } from '@fortawesome/free-solid-svg-icons';

import Header from '../../Components/Header/Header.jsx';
import history from '../../history';
import ApiRequests from '../../Providers/ApiRequests';
import './styles.css';
import Moment from 'moment';

class Summary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      process: {}
    };
    this.getProcessData = this.getProcessData.bind(this);
  }

  getDeadline() {
    if (!this.state.process.process) return '';

    const value = this.state.process.process.deadline;
    const m = Moment(value);
    return m.format('DD/MM/YY, h:mm a');
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
    const user = this.props.user;
    ApiRequests.getProcess(user).then((process) => {
      this.setState((prevState) => {
        prevState.process = process;
        console.log(process);
        return prevState;
      });
    }).catch((error) => {
      this.props.handleError(error.toString());
    });
  }

  editStep(e) {
    const target = e.currentTarget;
    const index = target.dataset.index;
    history.push('/step/' + index);
    e.stopPropagation();
  }

  getActionSymbol(status) {
      switch (status) {
        case 'todo':
          return faEdit;
        case 'pending':
          return faEye;
        case 'validated':
          return faEye;
        case 'rejected':
          return faEdit;
        default:
          throw new Error(`getActionSymbol(${status}) is undefined`);
        break;
      }
  }

  render() {
    const personalData = this.state.process;
    const steps = this.state.process.process === undefined ? []
      : this.state.process.process.steps.map((step, index) => {
        return (
          <li key={ index } className={'step-element ' + step.status}>
              <span>
                <FontAwesomeIcon className='edit-button' data-index={ index } onClick={ this.editStep }
                  icon={this.getActionSymbol(step.status)} />
               { step.label }
              </span>
          </li>
        );
    });

    return (
      <div>
        <Header/>
        <Container>
          <h2>Your Progress { personalData.name }</h2>
          <div className='warning-box'>
            <FontAwesomeIcon icon={faExclamationTriangle} />Deadline { this.getDeadline() }
          </div>
          <div id='process'>
            <ol className='steps-list'>
              { steps }
            </ol>
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(Summary);
