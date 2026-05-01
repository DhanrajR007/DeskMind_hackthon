const md5 = require('md5');
 const getAvatar = (email) => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};
module.exports = { getAvatar };