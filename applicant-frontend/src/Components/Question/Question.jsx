'using strict';

import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';

class Question extends Component {
  render() {
    return (
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://s2.qwant.com/thumbr/0x380/4/e/a020d745e1b479e2a4d5fd0c54dbc216a35624e5f065522e35d00678127ac9/dark-back-drop-clipart-1.jpg?u=http%3A%2F%2Fworldartsme.com%2Fimages%2Fdark-back-drop-clipart-1.jpg&q=0&b=1&p=0&a=1"
          alt="Third slide"
          height="100px"
        />
        <Carousel.Caption>
          <h3>New Caption</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    );
  }
}

export default Question;
