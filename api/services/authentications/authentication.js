var jwt = require('jsonwebtoken')
var config = require('./userKey')

jwtToken = (req, res, next) => {

  const token = req.headers['authorization'] 
  
  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];    
  }
  if (token !== null) {
    jwt.verify(token, config.secret, (err, authData) => {
      if (err) return res.sendStatus(403)
      req.authData = authData
      next()
    });
  }
};

module.exports = jwtToken

