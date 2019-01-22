var _ = require('lodash');
var crypto = require('crypto');

/** @module User */
module.exports = {
  attributes: {
    username: {
      type: 'string',
      unique: true,
      index: true
    },
    email: {
      type: 'string',
      unique: true,
      index: true,
      isEmail: true
    },
    passports: {
      collection: 'Passport',
      via: 'user'
    },
    gravatarUrl: {
      type: 'string'
    }
    // toJSON: function () {
    //   var user = this.toObject();
    //   delete user.password;
    //   return user;
    // }
  },

  beforeCreate: function (user, next) {
    if (_.isEmpty(user.username)) {
      user.username = user.email;
    }
    if (_.isEmpty(user.gravatarUrl)) {
      var md5 = crypto.createHash('md5');
      md5.update(this.email || '');
      user.gravatarUrl = 'https://gravatar.com/avatar/' + md5.digest('hex');
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
