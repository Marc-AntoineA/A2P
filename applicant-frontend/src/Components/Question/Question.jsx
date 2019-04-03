'using strict';

import React, { Component } from 'react';
import Input from '../../Components/Input/Input.jsx';

import './styles.css';

class Question extends Component {

  constructor(props) {
      super(props);
      this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  handleChangeValue(value) {
    this.props.onChange(this.props.questionIndex, value);
  }

  render() {
    const data = this.props.data;
    return (
      <div>
        <label className='question-label' htmlFor={ data.id }>{ data.label }{data.mandatory ? '*' : ''}</label>
        <Input
          id={ data. id}
          type={ data.type }
          data={ data }
          onChange={this.handleChangeValue}>
        </Input>
      </div>
    );
  }
}

export default Question;
