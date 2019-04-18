'using strict';

import React, { Component } from 'react';
import './styles.css';

import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';

import { Container } from 'react-bootstrap';

const TEXTS = require('../../texts.json');

class PrivacyPolicy extends Component {
  render() {
    return (
      <div>
        <Header user={ this.props.user }></Header>
        <Container>
          <h2 className='centered-title'>Privacy Policy</h2>
          <p>
          If you require any more information or have any questions about our privacy policy, please feel free to contact us by email at { TEXTS.FOOTER.EMAIL }.<br/>

          At socialhackersacademy.org we consider the privacy of our visitors to be extremely important. This privacy policy document describes in detail the types of personal information is collected and recorded by { TEXTS.HOSTING } and how we use it.
          </p>
          <h3>Cookies and Web Beacons</h3>
          <p>
            { TEXTS.HOSTING } does not use cookies.
          </p>

          <h3>Consent</h3>
          <p>
            By using our website, you hereby consent to our privacy policy and agree to its terms.
          </p>
        </Container>
        <Footer version={this.props.version}/>
      </div>
    );
  }
}

export default PrivacyPolicy;
