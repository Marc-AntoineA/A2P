'using strict';

import React, { Component } from 'react';

import Header from '../../Components/Header/Header.jsx';
import QuestionPage from '../../Components/QuestionPage/QuestionPage.jsx';
import './styles.css';

import { Button, ProgressBar } from 'react-bootstrap';

// TODO do this for tests only
const data = require('../../dataExamples/step1.json');

class StepForm extends Component {
  constructor(props) {
    super(props);

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);

    this.state = {
      'submissionRunning': false,
      'currentPage': 1,
      'answers': {}
    };
  }

  componentWillMount(){
      document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnMount(){
      document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowRight')
      this.nextPage();
    if (e.key === 'ArrowLeft')
      this.previousPage();
  }

  nextPage() {
    if (this.state.currentPage === data.length) return;
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

  submitForm() {
    console.log(this.state.answers);
  }

  render() {
    const pages = [];
    data.forEach((page, index) => {
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
