'use strict';

const Composer = require('../lib/composer.js');
var app = require('../../server/server');
module.exports = function (Pharmacy) {
  // Composer.restrictModelMethods(Pharmacy);

  /** custom remote methods **/

  /** 
   * 
   *  This remote method is used to get all the details of the pharmacy 
   * 
   **/

  /** custom remote method **/
  Pharmacy.getDetails = function (pharmacy, cb) {

    /** this will be final return object on response **/
    let returnObject = {
      pharmacy: {},
      users: []
    };
    let pharmacyID = pharmacy; // pharmacy id 
    const UserPharmacy = app.models.UserPharmacy; // accessing user pharmacy model
    Pharmacy.find({ where: { tradeLicenseId: pharmacyID } }, function (err, pharmacyDetails) {
      returnObject.pharmacy = pharmacyDetails[0];  // pharmacy details without users 
      UserPharmacy.find({ where: { pharmacy: "resource:io.mefy.pharmacy.Pharmacy#" + pharmacyID }, fields: { user: true, role: true } }, function (err, users) {
        // all the users against a pharmacy

        //append those users to return objects
        joinUsers(users)
          .then(function (data) {
            returnObject.users = data;
            cb(null, returnObject);
          });
      });
    });
  }

  /**************************************************************************************************/
  /**==============================================================================================**/

  function getUser(user) {
    return new Promise((resolve) => {
      const User = app.models.User;
      User.find({ where: { phoneNumber: user.user.split("#")[1] } }, function (err, detailUser) {
        resolve(detailUser[0]);
      });
    })
  }

  async function processUser(user) {
    return await getUser(user);
  }

  async function appendUsers(users) {
    let allusers = [];
    for (const user of users) {
      let duser = await processUser(user.toObject());
      let sdata = { name: '', phoneNumber: '', role: '', $class: 'io.mefy.pharmacy.User' };
      sdata.name = duser.name;
      sdata.phoneNumber = user.toObject().user.split("#")[1];
      sdata.role = user.toObject().role;
      allusers.push(sdata);
    }
    return await allusers;
  }

  function joinUsers(users) {
    return new Promise((resolve) => {
      let data = appendUsers(users);
      resolve(data);
    });
  }

  /**************************************************************************************************/
  /**==============================================================================================**/

  Pharmacy.remoteMethod('getDetails', {
    accepts: { arg: 'pharmacy', type: 'string' },
    returns: { arg: 'response', type: 'any' },
    http: { path: '/details', verb: 'get' }
  });

};
