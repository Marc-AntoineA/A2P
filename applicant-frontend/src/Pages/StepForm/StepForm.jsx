'using strict';

import React, { Component } from 'react';

import Header from '../../Components/Header/Header.jsx';
import QuestionPage from '../../Components/QuestionPage/QuestionPage.jsx';
import ApiRequests from '../../Providers/ApiRequests.js';
import history from '../../history';
import './styles.css';

import { Button, ProgressBar, Modal } from 'react-bootstrap';
import { withRouter } from "react-router-dom";

class StepForm extends Component {
  constructor(props) {
    super(props);

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.checkCurrentRequiredQuestions = this.checkCurrentRequiredQuestions.bind(this);

    this.state = {
      'submissionRunning': false,
      'currentPage': 1,
      'step': [],
      'mandatoryFailed': false // to display in red mandatory questions failed
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
          this.props.handleError(err.toString());
        });
      } else {
        ApiRequests.getStepForm(this.props.user, this.props.index).then((step) => {
          this.setState((prevState) => {
            prevState.step = step;
            return prevState;
          });
        }).catch((err) => {
          this.props.handleError(err.toString());
        });
      }
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentDidMount() {
    this.getFormData();
  }

  componentWillUnmount() {
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
    if (!this.checkCurrentRequiredQuestions()) {
      this.props.handleError('Please answer the mandatory questions');
      return;
    }
    this.setState((prevState) => {
      prevState.mandatoryFailed = false;
      prevState.currentPage++;
      return prevState;
    });
  }

  previousPage() {
    if (this.state.currentPage === 1) return;
    this.setState((prevState) => {
      prevState.currentPage--;
      prevState.mandatoryFailed = false;
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

  checkCurrentRequiredQuestions() {
    const currentPage = this.state.step[this.state.currentPage - 1];
    const questions = currentPage.questions;
    console.log(questions);
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      const question = questions[questionIndex];
      if (!question.mandatory) continue;
      if (question.answer === '' || question.answer === -1) {
        this.setState((prevState) => {
          prevState.mandatoryFailed = true;
          return prevState;
        });
        return false;
      }
    }
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
          mandatoryFailed={ this.state.mandatoryFailed }
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
