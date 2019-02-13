'using strict';

import React, { Component } from 'react';

import Input from '../../Components/Input/Input.jsx';

class Question extends Component {
  render() {
    const data = this.props.data;

    return (
      <div>
        <label htmlFor={ data.id }>{ data.label }</label>
        <Input id={ data. id} type={ data.type }></Input>
      </div>
    );
  }
}

export default Question;
