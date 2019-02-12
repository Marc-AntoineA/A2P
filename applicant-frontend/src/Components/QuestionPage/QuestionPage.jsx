'using strict';

import React, { Component } from 'react';

import Question from '../../Components/Question/Question.jsx';

class QuestionPage extends Component {

  componentDidMount() {
    console.log(this.props.data);
  }

  render() {
    const data = this.props.data;

    let questions = [];
    data.questions.forEach((question) => {
      questions.push(<Question data={ question }></Question>);
    });

    return (
      <div>
        <h2>{ data.label }</h2>
        <p>{ data.caption }</p>
        { questions }
      </div>
    );
  }
}

export default QuestionPage;
