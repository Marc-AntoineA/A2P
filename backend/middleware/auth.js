'using strict';
const jwt = require('jsonwebtoken');
const TOKEN_RANDOM_SECRET = require('../settings.json').TOKEN_RANDOM_SECRET;

module.exports = function(superviser) {
  return ((req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, TOKEN_RANDOM_SECRET);
      if (superviser !== decodedToken.superviser)
        throw 'Invalid token';
      const userId = decodedToken.userId;
      if ((req.body.userId && req.body.userId !== userId)
        || (req.params.userId && req.params.userId !== userId)
        || (req.params.applicantId && req.params.applicantId !== userId)) {
        throw 'Invalid token';
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({
        error: { message: 'Invalid request' }
      });
    }
  });
};
