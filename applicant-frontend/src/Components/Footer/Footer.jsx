'using strict';

import React, { Component } from 'react';
import './styles.css';
import { Container, Row, Col } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faMapMarkerAlt, faEnvelope, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fab);

const TEXTS = require('../../texts.json').FOOTER;

class Footer extends Component {
  render() {
    return (
      <footer>
        <Container>
          <Row>
            <Col dangerouslySetInnerHTML={{ __html: TEXTS.FIRST_COLUMN }}>
            </Col>
            <Col>
              <ul>
                { TEXTS.EMAIL ? <li><FontAwesomeIcon className='footer-icon' icon={faEnvelope} /> {TEXTS.EMAIL }</li> : '' }
                { TEXTS.PHONE_NUMBER ? <li><FontAwesomeIcon className='footer-icon' icon={faMobileAlt} /> { TEXTS.PHONE_NUMBER }</li> : '' }
                { TEXTS.ADRESS ? <li><FontAwesomeIcon className='footer-icon' icon={faMapMarkerAlt} /> { TEXTS.ADRESS }</li> : '' }
                <li><FontAwesomeIcon className='footer-icon' icon={faUserSecret} /><a href='/privacy-policy/'>Privacy Policy</a></li>
              </ul>
              <div className='social-media-box'>
                {
                  TEXTS.YOUTUBE ?
                  <a href={TEXTS.YOUTUBE} target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon className='social-media-icon' icon={['fab', 'youtube']}/>
                  </a>
                  :
                  ''
                }
                {
                  TEXTS.FACEBOOK ?
                  <a href={TEXTS.FACEBOOK} target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon className='social-media-icon' icon={['fab', 'facebook']}/>
                  </a>
                  :
                  ''
                }
                {
                  TEXTS.INSTAGRAM ?
                  <a href={TEXTS.INSTAGRAM} target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon className='social-media-icon' icon={['fab', 'instagram']}/>
                  </a>
                  :
                  ''
                }
                {
                  TEXTS.LINKEDIN ?
                  <a href={TEXTS.LINKEDIN} target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon className='social-media-icon' icon={['fab', 'linkedin']}/>
                  </a>
                  :
                  ''
                }
                {
                  TEXTS.GITHUB ?
                  <a href={TEXTS.GITHUB} target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon className='social-media-icon' icon={['fab', 'github']}/>
                  </a>
                  :
                  ''
                }
                {
                  TEXTS.TWITTER ?
                  <a href={TEXTS.TWITTER} target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon className='social-media-icon' icon={['fab', 'twitter']}/>
                  </a>
                  :
                  ''
                }
              </div>
            </Col>
            <Col>
              Platform developed by <a href='https://socialhackersacademy.org/' target='_blank' rel='noopener noreferrer'> Social Hackers Academy </a> under
              <a href='https://github.com/Marc-AntoineA/A2P/blob/master/LICENSE' target='_blank' rel='noopener noreferrer'> MIT Licence </a>
              (Source code <a href='https://github.com/Marc-AntoineA/A2P' target='_blank' rel='noopener noreferrer'>
                <FontAwesomeIcon className='social-media-icon' icon={['fab', 'github']}/>
              </a>).<br/>
              Version {this.props.version}
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }
}

export default Footer;
