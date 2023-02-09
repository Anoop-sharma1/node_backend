const db = require('config/db');

// helper functions
async function getUser(id) {
  const user = await db.User.findByPk(id);
  return user;
}

async function getUserByEmail(email) {
  const user = await db.User.findOne({ where: { email: email } });
  return user;
}

function omitPassword(user) {
  const { password, ...userWithoutpassword } = user;
  return userWithoutpassword;
}

module.exports = {
  getUser,
  omitPassword,
  getUserByEmail
};

