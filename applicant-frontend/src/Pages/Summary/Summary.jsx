'using strict';

import React, { Component } from 'react';

import { Container, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import 'react-accessible-accordion/dist/fancy-example.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEye, faExclamationTriangle, faEdit } from '@fortawesome/free-solid-svg-icons';

import Header from '../../Components/Header/Header.jsx';
import ApiRequests from '../../Providers/ApiRequests';
import './styles.css';
import Moment from 'moment';

class Summary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      process: {},
      redirectPath: null
    };
    this.getProcessData = this.getProcessData.bind(this);
    this.editStep = this.editStep.bind(this);
  }

  componentWillMount() {
    if (!this.props.user.token || !this.props.user.id) {
      this.setState((prevState) => {
        prevState.redirectPath = '/login';
      });
    }
  }

  getDeadline() {
    if (!this.state.process.process) return '';
    const value = this.state.process.process.deadline;
    const m = Moment(value);
    return m.format('DD/MM/YY, h:mm a');
  }

  componentDidMount() {
    const user = this.props.user;
    this.getProcessData();
  }

  getProcessData() {
    if (!this.props.user.token || !this.props.user.id) return;

    const user = this.props.user;
    ApiRequests.getProcess(user).then((process) => {
      this.setState((prevState) => {
        prevState.process = process;
        return prevState;
      });
    }).catch((error) => {
      this.props.handleError(error.toString());
    });
  }

  editStep(e) {
    const target = e.currentTarget;
    const index = target.dataset.index;
    this.setState((prevState) => {
      prevState.redirectPath = '/step/' + index;
      return prevState;
    });
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

    const mainComponent = (
      <div>
        <Header user={ this.props.user }/>
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

    const redirect = (
      <Redirect to={this.state.redirectPath} />
    );

    return (
      <div>
      {
        this.state.redirectPath ?
        redirect
        :
        mainComponent
      }
      </div>
    );
  }
}

export default Summary;
