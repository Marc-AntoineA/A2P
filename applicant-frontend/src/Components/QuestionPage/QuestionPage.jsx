'using strict';

import React, { Component } from 'react';

import Question from '../../Components/Question/Question.jsx';
import './styles.css';

class QuestionPage extends Component {

  constructor(props) {
    super(props);
    this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  handleChangeValue(questionId, value) {
    this.props.onChange(questionId, value);
  }

  componentDidMount() {
    console.log(this.props.data);
  }

  render() {
    const data = this.props.data;

    const questions = [];
    data.questions.forEach((question) => {
      questions.push(
        <Question
          key={ question.id }
          data={ question }
          onChange={this.handleChangeValue}>
        </Question>);
    });

    return (
      <div className={this.props.hidden ? 'hidden' : ''}>
        <h2>{ data.label }</h2>
        <p>{ data.caption }</p>
        { questions }
      </div>
    );
  }
}

export default QuestionPage;
