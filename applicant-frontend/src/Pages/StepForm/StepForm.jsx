'using strict';

import React, { Component } from 'react';

import Header from '../../Components/Header/Header.jsx';
import QuestionPage from '../../Components/QuestionPage/QuestionPage.jsx';
import './styles.css';

import { Button, ProgressBar } from 'react-bootstrap';
import ApiRequests from '../../Providers/ApiRequests.js';

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
      'answers': {},
      'data': []
    };
  }

  getFormData() {
    console.log(this.props);
    if (this.props.user.username === "" || this.props.user.token === "") {
      ApiRequests.getSigninForm()
        .then((data) => {
          this.setState((prevState) => {
            prevState.data = data;
            return prevState;
          });
        }).catch((err) => {
          this.props.handleError(err);
        });
      } else {
        this.setState((prevState) => {
          prevState.data = EXAMPLE_DATA;
          return prevState;
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
    if (this.state.currentPage >= this.state.data.length) return;
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

  handleChangeValue(questionId, value) {
    console.log("New answer: ", questionId, value);
    this.setState((prevState) => {
      prevState.answers[questionId] = value;
    });
  }

  // TODO
  checkRequiredQuestions() {
    return true;
  }
  // TODO
  submitForm() {
    if (this.checkRequiredQuestions()) {
      // TODO
      console.log('OK');
    } else {
      // TODO
      console.log('NOT OK');
    }
    // TODO handle if no users
    ApiRequests.postSigninForm(this.state.answers);
    console.log(this.state.answers);
  }

  render() {
    const pages = [];
    this.state.data.forEach((page, index) => {
      pages.push(
        <QuestionPage
          key={ page.id }
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

export default StepForm;
