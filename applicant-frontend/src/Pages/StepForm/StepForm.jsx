'using strict';

import React, { Component } from 'react';

import Header from '../../Components/Header/Header.jsx';
import QuestionPage from '../../Components/QuestionPage/QuestionPage.jsx';

// TODO do this for tests only
const data = require('../../dataExamples/step1.json');

class StepForm extends Component {
  constructor(props) {
    super(props);
    console.log(data);
  }

  render() {
    return (
      <div>
        <Header/>
        <div>
          <QuestionPage data={data[0]}></QuestionPage>
          <QuestionPage data={data[1]}></QuestionPage>
          <QuestionPage data={data[2]}></QuestionPage>
        </div>
      </div>
    );
  }
}

export default StepForm;
