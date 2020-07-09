var _ = require('lodash');
var crypto = require('crypto');

/** @module User */
module.exports = {
  attributes: {
    id: {
      type: 'number',
      autoIncrement: true
    },
    username: {
      type: 'string',
      unique: true
    },
    email: {
      type: 'string',
      unique: true,
      isEmail: true
    },
    passports: {
      collection: 'Passport',
      via: 'user'
    }
  },

  beforeCreate: function (user, next) {
    if (_.isEmpty(user.username)) {
      user.username = user.email;
    }
    next();
  },

  /**
   * Register a new User with a passport
   */
  register: function (user) {
    return new Promise(function (resolve, reject) {
      sails.services.passport.protocols.local.createUser(user, function (error, created) {
        if (error) return reject(error);

        resolve(created);
      });
    });
  }
};
