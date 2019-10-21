'using strict';

import React, { Component } from 'react';

import { Container, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import Handlebars  from 'handlebars';
import { Redirect } from 'react-router-dom';
import 'react-accessible-accordion/dist/fancy-example.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEye, faExclamationTriangle, faEdit } from '@fortawesome/free-solid-svg-icons';

import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import ApiRequests from '../../Providers/ApiRequests';
import './styles.css';
import Moment from 'moment';

const TEXTS = require('../../static.json');

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
    this.welcomeTemplate = Handlebars.compile(TEXTS.SUMMARY_VIEW.WELCOME_MESSAGE);
    this.deadlineTemplate = Handlebars.compile(TEXTS.SUMMARY_VIEW.DEADLINE_TEXT);
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
      this.props.handleError(error.message ? error.message : error.toString());
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
          <li key={ index } className={'step-element ' + step.status} data-index={ index } onClick={ this.editStep }>
              <span>
                <FontAwesomeIcon className='edit-button'
                  icon={this.getActionSymbol(step.status)} />
               { step.label }
              </span>
          </li>
        );
    });

    const resultsBox = (
      <div className={'results-box ' + this.state.process.status}>
        { this.state.process.status === 'validated' ? TEXTS.SUMMARY_VIEW.RESULTS_BOX.ACCEPTED : TEXTS.SUMMARY_VIEW.RESULTS_BOX.REJECTED }
      </div>
    );

    const helpBox = (
      <div className='help-box'>
        <h3>Some help</h3>
        { TEXTS.SUMMARY_VIEW.HELP_NOTE }
        <ul className='help-list'>
          <li>
            <span className='small-icon-box todo'>2</span>{ TEXTS.SUMMARY_VIEW.ICONS_DESCRIPTIONS.TODO_ICON_DESCRIPTION }
          </li>
          <li>
            <span className='small-icon-box pending'>...</span>{ TEXTS.SUMMARY_VIEW.ICONS_DESCRIPTIONS.PENDING_ICON_DESCRIPTION }
          </li>
          <li>
            <span className='small-icon-box validated'>&#x2713;</span>{ TEXTS.SUMMARY_VIEW.ICONS_DESCRIPTIONS.VALIDATED_ICON_DESCRIPTION }
          </li>
          <li>
            <span className='small-icon-box rejected'>&#x2715;</span>{ TEXTS.SUMMARY_VIEW.ICONS_DESCRIPTIONS.REJECTED_ICON_DESCRIPTION }
          </li>
        </ul>
      </div>
    );

    const deadlineBox = (
      <div className='warning-box'>
        <FontAwesomeIcon icon={faExclamationTriangle} />{ this.deadlineTemplate({ deadline: this.getDeadline() })}
      </div>
    );

    const summary = (
      <div id='process'>
        <ol className='steps-list'>
          { steps }
        </ol>
      </div>
    );

    const mainComponent = (
      <div>
        <Header user={ this.props.user }/>
        <Container>
          <h2>{ this.welcomeTemplate({ name: personalData.name }) }</h2>
          <p>{ TEXTS.SUMMARY_VIEW.WELCOME_DESCRIPTION }</p>
          { this.state.process.status !== 'pending' ? resultsBox : '' }
          { this.state.process.status === 'pending' ? deadlineBox : '' }
          { this.state.process.status === 'pending' ? helpBox : '' }
          { this.state.process.status === 'pending' ? summary : '' }
        </Container>
        <Footer version={this.props.version}/>
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
