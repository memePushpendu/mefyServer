'use strict';
const Composer = require('../lib/composer.js');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const bizNetworkConnection = new BusinessNetworkConnection();
const cardName = "admin@mefy";

module.exports = function (UserPharmacy) {
  // Composer.restrictModelMethods(UserPharmacy);

  /** add remote hook  **/

  UserPharmacy.beforeRemote('create', function (context, user, next) {
    let userID = context.args.data.phoneNumber;
    let pharmacy = context.args.data.tradeLicenseId;
    context.args.data.recordId = pharmacy + '-' + userID + '-' + context.args.data.role;
    // context.args.data.date = Date.now();
    // context.args.data.publisherId = context.req.accessToken.userId;
    next();
  });

  UserPharmacy.observe('loaded', function (context, next) {
    let pharmacyID = context.data.tradeLicenseId.split("#")[1];
    bizNetworkConnection.connect(cardName)
      .then((result) => {
        bizNetworkConnection.getAssetRegistry('io.mefy.pharmacy.Pharmacy')
          .then((assetRegistry) => {
            return assetRegistry.get(pharmacyID);
          }).then(function (pharmacy) {
            // pharmacy.address
            let cPharmacy = {
              "$class": "io.mefy.pharmacy.Pharmacy",
              "tradeLicenseId": pharmacy.tradeLicenseId,
              "address": {
                "$class": "io.mefy.pharmacy.Address",
                "street": pharmacy.address.street,
                "city": pharmacy.address.city,
                "country": pharmacy.address.country,
                "zipcode": pharmacy.address.zipcode,
              },
              "pharmacyName": pharmacy.pharmacyName,
              "primaryContact": pharmacy.primaryContact,
              "alternateContact": pharmacy.alternateContact,
              "email": pharmacy.email,
              "gstNo": pharmacy.gstNo,
              "degreeFile": pharmacy.degreeFile,
              "drugLicense": pharmacy.drugLicense,
              "tradeLicense": pharmacy.tradeLicense
            }
            context.data.pharmacy = cPharmacy;
            next();
          });
      }).catch((error) => {
        next();
        console.log(error);
      });
  });

};
