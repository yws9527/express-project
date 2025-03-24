const crypto = require('crypto');
const { SALT } = require('../config/config.default');


const md5 = function (password, salt = SALT) {
  const saltPassword = password + ':' + salt;
  const _md5 = crypto.createHash('md5');
  const result = _md5.update(saltPassword).digest('hex');
  return result;
}

md5.compare = function (password, hash, salt = SALT) {
  return md5(password, salt) === hash;
}

module.exports = md5

