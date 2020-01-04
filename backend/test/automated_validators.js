'using strict'

const assert = require('assert');

const validators = require('../validators/automated').validators;

describe('Automated validators', function() {

  describe('minWords', function() {
    describe('#notEnoughWords', function() {
      it('Two words is not enough with limit 3', function() {
        assert.rejects(() => validators['MIN_WORDS'].function('two words', { minWords: 3 }));
      });
    });
    describe('#noOption', function() {
      it('No error when no value is specified', function() {
        assert.doesNotReject(() => validators['MIN_WORDS'].function('two words', {}));
      });
    });
    describe('#enoughWords', function() {
      it('Three words is enough with limit 3', function() {
        assert.doesNotReject(() => validators['MIN_WORDS'].function('three fucking words', { minWords: 3 }));
      });
    });
  });

  describe('codePen', function() {
    describe('#noValidCodePenWebsite', function() {
      it('google.fr is not a valid url', function() {
        assert.rejects(() => validators['CODE_PEN'].function('https://google.fr'));
      });
    });
    describe('#validCodePenWebsiteUrl', function() {
      it('https://codepen.io/marc-antoinea/pen/qggWPP is  a valid url', function() {
        assert.doesNotReject(() => validators['CODE_PEN'].function('https://codepen.io/marc-antoinea/pen/qggWPP'));
      });
    });
  });

});
