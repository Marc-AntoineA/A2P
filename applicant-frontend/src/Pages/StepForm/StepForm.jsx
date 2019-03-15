'using strict';

import React, { Component } from 'react';

import Header from '../../Components/Header/Header.jsx';
import QuestionPage from '../../Components/QuestionPage/QuestionPage.jsx';
import ApiRequests from '../../Providers/ApiRequests.js';
import history from '../../history';
import './styles.css';

import { Button, ProgressBar, Modal } from 'react-bootstrap';
import { withRouter } from "react-router-dom";

// TODO do this for tests only
const EXAMPLE_DATA = require('../../dataExamples/step1.json');

class StepForm extends Component {
  constructor(props) {
    super(props);

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.getFormData = this.getFormData.bind(this);

    this.state = {
      'submissionRunning': false,
      'currentPage': 1,
      'step': []
    };
  }

  getFormData() {
    if (this.props.index === undefined) {
      ApiRequests.getSigninForm().then((step) => {
          this.setState((prevState) => {
            prevState.step = step;
            return prevState;
          });
        }).catch((err) => {
          this.props.handleError(err);
        });
      } else {
        ApiRequests.getStepForm(this.props.user, this.props.index).then((step) => {
          this.setState((prevState) => {
            prevState.step = step;
            return prevState;
          });
        }).catch((err) => {
          this.props.handleError(err);
        });
      }
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentDidMount() {
    this.getFormData();
  }

  componentWillUnMount() {
      document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowRight')
      this.nextPage();
    if (e.key === 'ArrowLeft')
      this.previousPage();
  }

  nextPage() {
    if (this.state.currentPage >= this.state.step.length) return;
    this.setState((prevState) => {
      prevState.currentPage++;
      return prevState;
    });
  }

  previousPage() {
    if (this.state.currentPage === 1) return;
    this.setState((prevState) => {
      prevState.currentPage--;
      return prevState;
    });
  }

  handleChangeValue(pageIndex, questionIndex, value) {
    this.setState((prevState) => {
      if (prevState.step.length < pageIndex) return prevState;
      if (prevState.step[pageIndex].questions.length < questionIndex) return prevState;
      prevState.step[pageIndex].questions[questionIndex].answer = value;
      return prevState;
    });
  }

  // TODO
  checkRequiredQuestions() {
    return true;
  }

  // TODO
  submitForm() {
    const promise = this.props.index === undefined ?
      ApiRequests.postSigninForm(this.state.step)
      : ApiRequests.putStepForm(this.props.user, this.props.index, this.state.step);

    promise.then(response => {
      if (response.status === 201 || response.status === 204) {
        history.push('/summary');
        return;
      }
      response.json().then((responseJson) => {
        const errorMessage = responseJson.error.message;
        this.props.handleError(errorMessage);
      });
    }).catch((err) => {
      this.props.handleError(err);
    });
  }

  render() {
    const pages = [];
    this.state.step.forEach((page, index) => {
      pages.push(
        <QuestionPage
          key={ page.id }
          pageIndex={ index }
          data={ page }
          hidden={ index + 1 !== this.state.currentPage }
          onChange={this.handleChangeValue}>
        </QuestionPage>);
    });

    return (
      <div>
        <Header/>
        <ProgressBar animated
          now={ this.state.currentPage }
          max= { pages.length }
          label={`${this.state.currentPage}/${pages.length}`}>
        </ProgressBar>
        <main>
          { pages }
          {this.state.currentPage !== 1 ?
            <Button className='float-left' onClick={ this.previousPage }>Previous</Button> : ''}
          {this.state.currentPage !== pages.length ?
            <Button className='float-right' onClick={ this.nextPage }>Next</Button> : ''}
          {this.state.currentPage === pages.length ?
            <Button
              onClick={ this.submitForm }
              size='lg'
              variant='success'>
              Submit
            </Button>
            : ''
          }
        </main>
      </div>
    );
  }
}

export default withRouter(StepForm);
