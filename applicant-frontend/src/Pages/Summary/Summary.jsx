'using strict';

import React, { Component } from 'react';

import Header from '../../Components/Header/Header.jsx';

class Summary extends Component {
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

export default Summary;
