'using strict';

import React, { Component } from 'react';

class Input extends Component {
  render() {
    const props = this.props;
    console.log(props);
    let input = (<div>MISTAKE</div>);
    switch (props.type) {
      case 'text':
        return <textarea></textarea>
      case 'inline':
        return <input id={props.id} type='text'></input>;
      case 'dateOfBirth': // TODO
        return <input id={props.id} type='text'></input>;
      case 'email': // TODO
        return <input id={props.id} type='email'></input>;
      case 'phone': // TODO
        return <input id={props.id} type='tel'></input>;
      case 'radio':
        const choices = [];
        this.props.data.choices.forEach((choice) => {
          choices.push(
            <label>{ choice }
              <input type="checkbox"/>
            </label>);
        });
        return (<div>{ choices }</div>);
    }
    console.log(input);
    return (<div> mistake </div>);
  }
}

export default Input;
