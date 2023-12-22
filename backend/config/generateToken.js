const jwt = require('jsonwebtoken');

const generateToken = (id) => {

  return jwt.sign({id},"secret",{
    expiresIn: '2h',
  });
}

module.exports = generateToken;