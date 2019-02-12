'using strict';

import React, { Component } from 'react';

class Question extends Component {
  render() {
    const data = this.props.data;
    return (
      <div>
        <h3>{ data.label }</h3>
        <p>{ data.caption }</p>
        <input type="text"></input>
      </div>
    );
  }
}

export default Question;
