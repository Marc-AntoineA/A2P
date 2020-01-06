'using strict';

import React, { Component } from 'react';

import { Container, Button, Card, Alert, ButtonToolbar, ProgressBar, Spinner } from 'react-bootstrap';
import Handlebars  from 'handlebars';
import { Redirect } from 'react-router-dom';
import 'react-accessible-accordion/dist/fancy-example.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faExclamationTriangle, faEdit, faCheck, faSpinner, faTimes, faEnvelope, faAngleRight, faThumbsUp, faFrown } from '@fortawesome/free-solid-svg-icons';

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
      redirectPath: '',
      loadingProcess: true
    };
    this.getProcessData = this.getProcessData.bind(this);
    this.editStep = this.editStep.bind(this);
    this.scheduleItw = this.scheduleItw.bind(this);
    this.updateArchive = this.updateArchive.bind(this);
    this.isItwSelected = this.isItwSelected.bind(this);
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
    this.getProcessData();
  }

  getProcessData() {
    if (!this.props.user.token || !this.props.user.id) return;

    const user = this.props.user;
    ApiRequests.getProcess(user).then((process) => {
      this.setState((prevState) => {
        prevState.process = process;
        prevState.loadingProcess = false;
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

  scheduleItw(e) {
    this.setState((prevState) => {
      prevState.redirectPath = '/interview/';
      return prevState;
    });
    e.stopPropagation();
  }

  isItwSelected() {
    if (this.state.process.interviewSlot)
      return 'validated';
    return 'todo';
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
      }
  }

  getResultSymbol(status) {
    switch(status) {
      case 'todo':
        return faEdit;
      case 'pending':
        return faSpinner;
      case 'validated':
        return faCheck;
      case 'rejected':
        return faTimes;
      default:
        throw new Error(`getResultSymbol(${status}) is undefined`);
    }
  }

  getProgressVariant(status) {
    switch(status) {
      case 'todo':
        return 'info';
      case 'pending':
        return 'warning';
      case 'validated':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        throw new Error(`getResultSymbol(${status}) is undefined`);
    }
  }

  updateArchive() {
    ApiRequests.putArchive(this.props.user, this.state.process.archived ? 'unarchive' : 'archive')
    .then((response) => {
      this.props.handleModal(response.message, 'Success');
      this.getProcessData();
    })
    .catch((error) => {
      this.props.handleError(error.message ? error.message : error.toString());
    }).catch((error) => {
      this.props.handleError(error.toString());
    });
  }

  render() {
    const personalData = this.state.process;
    const loading = this.state.loadingProcess;


    // Main block for interested applicants before the deadline
    const deadlineBox = (
      <Alert variant='warning'>
        <FontAwesomeIcon className='status-icon' icon={faExclamationTriangle} />{ this.deadlineTemplate({ deadline: this.getDeadline() })}
      </Alert>
    );

    const date = new Date(this.state.process.interviewSlot ? this.state.process.interviewSlot.begin : undefined);

    const itwCard = (
      <Card className={'step-card ' + this.isItwSelected()} onClick={ this.scheduleItw }>
      <Card.Body>
      <Card.Title>
      <span className='step-nb'>Interview:</span> Schedule your interview!
      </Card.Title>
      <span className='step-explanation'>
      <FontAwesomeIcon className='status-icon' icon={this.getResultSymbol(this.isItwSelected())} />
      {
        this.state.process.interviewSlot ?
        "Your interview is scheduled on "
          +  date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
          + ' at ' + date.toLocaleTimeString('en-GB')
        :
        TEXTS.SUMMARY_VIEW.ICONS_DESCRIPTIONS.TODO_ICON_DESCRIPTION
      }
      </span>
      </Card.Body>
      <div className='answer-button'>
      <FontAwesomeIcon className='edit-button' icon={faAngleRight} />
      </div>
      </Card>
    );

    const steps = this.state.process.process === undefined ? []
    : this.state.process.process.steps.map((step, index) => {
      return (
        <Card key={ index } className={'step-card ' + step.status } data-index={ index } onClick={ this.editStep }>
        <Card.Body>
        <Card.Title>
        <span className='step-nb'>Step { index + 1 }:</span> { step.label }
        </Card.Title>
        <span className='step-explanation'>
        <FontAwesomeIcon className='status-icon' icon={this.getResultSymbol(step.status)} />
        { step.status === 'pending' ? TEXTS.SUMMARY_VIEW.ICONS_DESCRIPTIONS.PENDING_ICON_DESCRIPTION : '' }
        { step.status === 'validated' ? TEXTS.SUMMARY_VIEW.ICONS_DESCRIPTIONS.VALIDATED_ICON_DESCRIPTION : '' }
        { step.status === 'todo' ? TEXTS.SUMMARY_VIEW.ICONS_DESCRIPTIONS.TODO_ICON_DESCRIPTION : '' }
        { step.status === 'rejected' ? TEXTS.SUMMARY_VIEW.ICONS_DESCRIPTIONS.REJECTED_ICON_DESCRIPTION : '' }
        </span>
        </Card.Body>
        <div className='answer-button'>
        <FontAwesomeIcon className='edit-button' icon={faAngleRight} />
        </div>
        </Card>
      );
    });

    const stepsProgress = this.state.process.process ? this.state.process.process.steps.map((step, index) => {
      return (
        <ProgressBar animated striped variant={this.getProgressVariant(step.status)} now={100/(1 + this.state.process.process.steps.length)}
        key={index} label={`Step ${index + 1}`}/>
      );
    }) : [];

    const interestedBlock = (
      <div id='process'>
        <p>{ TEXTS.SUMMARY_VIEW.WELCOME_DESCRIPTION }</p>
        { deadlineBox}
        <ProgressBar>
          {
            this.state.process.process ?
            <ProgressBar animated striped variant={this.getProgressVariant(this.isItwSelected())} now={100/(1 + this.state.process.process.steps.length)} label={'Interview'}/>
            :
            ''
          }
          { stepsProgress }
        </ProgressBar>
        { itwCard }
        { steps }
      </div>
    );

    // Not interested applicants
    const notInterestedBlock = (
      <p>
        { TEXTS.SUMMARY_VIEW.NO_MORE_INTERESTED }
      </p>
    )

    // After the deadline

    // Accepted/rejected applicants
    const resultsBox = (
      <div>
        { this.state.process.status === 'accepted' ?
            <Alert variant='success'>
              <FontAwesomeIcon className='status-icon' icon={faThumbsUp} />{ TEXTS.SUMMARY_VIEW.RESULTS_BOX.ACCEPTED }
            </Alert>
          :
          ''
        }
        { this.state.process.status === 'rejected' ?
            <Alert variant='danger'>
              <FontAwesomeIcon className='status-icon' icon={faFrown} />{ TEXTS.SUMMARY_VIEW.RESULTS_BOX.REJECTED }
            </Alert>
          :
          ''
        }
      </div>
    );

    const mainComponent = (
      <div>
        <Header user={ this.props.user }/>
        <Container>
          { loading ? <div className='center'><Spinner animation="border" variant="danger" /></div> : '' }
          { !loading ? <h2> {this.welcomeTemplate({ name: personalData.name })} </h2> : ''}
          { !loading && this.state.process.status !== 'pending' ? resultsBox : '' }
          { !loading && this.state.process.status === 'pending' && !this.state.process.archived  ? interestedBlock : '' }
          { !loading && this.state.process.status === 'pending' && this.state.process.archived  ? notInterestedBlock : '' }
          <ButtonToolbar className='button-toolbar'>
            { !loading && this.state.process.status === 'pending'?
              <Button variant="danger" size="lg" onClick={this.updateArchive}>
                {this.state.process.archived ? 'Apply again !' : 'Archive my Application'}
              </Button>
              :
              ''
            }
            <Button variant="secondary" size="lg" href={'mailto:' + TEXTS.FOOTER.EMAIL}>
              <FontAwesomeIcon className='status-icon' icon={faEnvelope} />
              A question ? Contact us
            </Button>
          </ButtonToolbar>
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
