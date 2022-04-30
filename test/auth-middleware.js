const expect = require('chai').expect;

const authMiddleware = require('../middleware/auth-check');

it('should throw an error if no authorization header is present', function() {
  const req = {
    get: function(headerName) {
      return null;
    }
  };
  expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
    'Not authenticated.'
  );
});
