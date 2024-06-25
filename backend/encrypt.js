//Dependencies
const bcrypt = require("bcrypt");
const saltRounds = 10; //level of layers for encryption from 1 to 50 (more layers require more computation)



function encryption(password) {
  return bcrypt.hash(password, saltRounds);
}

function compareHashes(password, hashed) {
  return bcrypt.compare(password, hashed);
}

module.exports.encryption = encryption;
module.exports.compareHashes=compareHashes;
