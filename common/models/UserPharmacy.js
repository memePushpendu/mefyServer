'use strict';
const Composer = require('../lib/composer.js');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const bizNetworkConnection = new BusinessNetworkConnection();
const cardName = "admin@mefy";
var app = require('../../server/server');

module.exports = function (UserPharmacy) {
  // Composer.restrictModelMethods(UserPharmacy);

  /** add remote hook  **/

  UserPharmacy.beforeRemote('create', function (context, user, next) {
    let userID = context.args.data.user;
    let pharmacy = context.args.data.pharmacy;
    context.args.data.recordId = pharmacy + '-' + userID + '-' + context.args.data.role;
    // context.args.data.date = Date.now();
    // context.args.data.publisherId = context.req.accessToken.userId;
    next();
  });

  UserPharmacy.observe('loaded', function (context, next) {

    let pharmacyID;
    if (context.data.pharmacy.includes('#')) {
      pharmacyID = context.data.pharmacy.split("#")[1];
    }
    else {
      pharmacyID = context.data.pharmacy;
    }

    console.log(pharmacyID);
    const Pharmacy = app.models.Pharmacy;

    Pharmacy.find({ where: { tradeLicenseId: pharmacyID } }, function (err, pharmacies) {
      console.log(pharmacies);
      context.data.pharmacy = pharmacies;
      next();
    });

  });


  /** custom remote method **/
  UserPharmacy.byUser = function (phonenumber, cb) {
    let user = "resource:io.mefy.pharmacy.User#" + phonenumber;
    UserPharmacy.find({ where: { user: user } }, function (err, pharmacies) {
      console.log(pharmacies);
      cb(null, pharmacies);
    });
  }

  UserPharmacy.remoteMethod('byUser', {
    accepts: { arg: 'phonenumber', type: 'string' },
    returns: { arg: 'pharmacies', type: 'any' },
    http: { path: '/user', verb: 'get' }
  });


  /** count user pharmacy **/
  /** custom remote method **/
  UserPharmacy.countByUser = function (phonenumber, cb) {
    let user = "resource:io.mefy.pharmacy.User#" + phonenumber;
    UserPharmacy.find({ where: { user: user } }, function (err, pharmacies) {
      cb(null, pharmacies.length);
    });
  }

  UserPharmacy.remoteMethod('countByUser', {
    accepts: { arg: 'phonenumber', type: 'string' },
    returns: { arg: 'count', type: 'any' },
    http: { path: '/countbyuser', verb: 'get' }
  });


};
