'using strict';

import React, { Component } from 'react';

import Header from '../../Components/Header/Header.jsx';
import { withRouter } from "react-router-dom";

import history from '../../history';

class Summary extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.user === undefined || this.props.user.id === "") {
      history.push('/');
      return;
    }
  }

  render() {
    return (
      <div>
        <Header/>
        <main>
          <h3>My summary</h3>
        </main>
      </div>
    );
  }
}

export default withRouter(Summary);
