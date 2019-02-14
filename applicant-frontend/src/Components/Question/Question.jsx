'using strict';

import React, { Component } from 'react';

import Input from '../../Components/Input/Input.jsx';

import './styles.css';

class Question extends Component {
  render() {
    const data = this.props.data;

    return (
      <div>
        <label className='question-label' htmlFor={ data.id }>{ data.label }</label>
        <Input id={ data. id} type={ data.type } data={ data }></Input>
      </div>
    );
  }
}

export default Question;
