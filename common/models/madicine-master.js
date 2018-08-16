'use strict';
const Composer = require('../lib/composer.js');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const bizNetworkConnection = new BusinessNetworkConnection();
const cardName = "admin@mefy";
var app = require('../../server/server');

module.exports = function (Medicinemaster) {


  /** generate medicine id */
  Medicinemaster.beforeRemote('create', function (context, user, next) {
    const Manufacturer = app.models.Manufacturer;
    let date = new Date();
    var milliSeconds = Date.parse(date);
    let responsedata;
    Manufacturer.exists(context.args.data.manufacturer, function (err, exists) {
      if (exists) {
        if (context.args.data.rxname.includes(' ')) {
          responsedata = context.args.data.manufacturer + '-' + context.args.data.rxname.replace(/ +/g, "") + '-' + milliSeconds;
        }
        else {
          responsedata = context.args.data.manufacturer + '-' + context.args.data.rxname + '-' + milliSeconds;
        }
        context.args.data.medicineId = responsedata;
        next();
      }
      else {
        next();
      }
    })
  })

  /*** */


  // /****************** AUTO INCREMENTING MEDICINE ID *****************************************************/
  // Medicinemaster.observe('before save', function (ctx, next) {

  //   console.log('9999 :::::', ctx.instance)
  //   // if (!ctx.isNewInstance) {
  //   //   debug('id is already set, returning', ctx.data);
  //   //   return next();
  //   // }

  //   Medicinemaster.findOrCreate({ where: { medicineId: '56' } }, { $inc: { value: 1 } }).then(function (instance) {
  //     //here instance is an array, first element the instance, second element created flag
  //     console.log('+++++++++line21::', instance)
  //   })
  //     .catch(function (err) {
  //       console.log('line 24::', err)
  //     });


  //   // [['_id', 'asc']], { $inc: { value: 1 } }, { new: true }, function (err, rec) {
  //   //   if (err) {
  //   //     console.err(err);
  //   //   } else {
  //   //     if (ctx.instance) {
  //   //       ctx.instance.id = rec.value.value;
  //   //     } else {
  //   //       ctx.data.id = rec.value.value;
  //   //     }
  //   //   }
  //   //   next();
  //   // });
  // });
  // /*************************************************************************************************** */


  /** SHOW DETAILS OF DRUG AND MANUFACTURER WHILE GETTING MEDICINE MASTER LIST */
  Medicinemaster.observe('loaded', function (context, next) {
    let drugtypeId;
    let manufGstNo;
    const DrugType = app.models.DrugType;
    const Manufacturer = app.models.Manufacturer;
    if (context.data.drugtype.includes('#')) {
      drugtypeId = context.data.drugtype.split("#")[1];
    }
    else {
      drugtypeId = context.data.drugtype;
    }
    if (context.data.manufacturer.includes('#')) {
      manufGstNo = context.data.manufacturer.split('#')[1];
    }
    else {
      manufGstNo = context.data.manufacturer;
    }
    /** FETCHING DRUGS DETIAL */

    DrugType.find({ where: { typeId: drugtypeId } }, function (err, drugs) {

      let drugdata = {
        "$class": "io.mefy.pharmacy.DrugType",
        "typeId": drugs[0].typeId,
        "type": drugs[0].type,
        "description": drugs[0].description
      }
      context.data.drugtype = drugdata;

      /** FETCHING MANUFACTURER DETAILS */
      Manufacturer.find({ where: { gstin: manufGstNo } }, function (err, manufacturer) {

        if (manufacturer.length != 0) {
          let manufdata = {
            "$class": "io.mefy.pharmacy.Manufacturer",
            "gstin": manufacturer[0].gstin,
            "name": manufacturer[0].name,
            "address": {
              "$class": "io.mefy.pharmacy.Address",
              "street": manufacturer[0].address.street,
              "city": manufacturer[0].address.city,
              "country": manufacturer[0].address.country,
              "zipcode": manufacturer[0].address.zipcode
            },
            "contactName": manufacturer[0].contactName,
            "contactNumber": manufacturer[0].contactNumber
          }
          context.data.manufacturer = manufdata;
        }

        next();
      })
    });


    // bizNetworkConnection.connect(cardName)
    //   .then((result) => {
    //     bizNetworkConnection.getAssetRegistry('io.mefy.pharmacy.DrugType')
    //       .then((assetRegistry) => {
    //         return assetRegistry.get(drugtypeId);
    //       }).then(function (drug) {
    //         let drugdata = {
    //           "$class": "io.mefy.pharmacy.DrugType",
    //           "typeId": drug.typeId,
    //           "type": drug.type,
    //           "description": drug.description
    //         }
    //         context.data.drugtype = drugdata;
    //         next();
    //       });
    //   }).catch((error) => {
    //     next();
    //     console.log('err' + error);
    //   });
  });

  /** */

};
