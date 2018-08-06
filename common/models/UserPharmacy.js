'use strict';
const Composer = require('../lib/composer.js');
module.exports = function (UserPharmacy) {
  // Composer.restrictModelMethods(UserPharmacy);
  /** add remote hook  **/
  UserPharmacy.beforeRemote('create', function (context, user, next) {
    let userID = context.args.data.user.split("#")[1];
    let pharmacy = context.args.data.pharmacy.split("#")[1];
    context.args.data.recordId = pharmacy+'-'+userID+'-'+context.args.data.role;
    // context.args.data.date = Date.now();
    // context.args.data.publisherId = context.req.accessToken.userId;
    next();
  });
};
