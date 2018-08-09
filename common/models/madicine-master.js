'use strict';
const Composer = require('../lib/composer.js');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const bizNetworkConnection = new BusinessNetworkConnection();
const cardName = "admin@mefy";


module.exports = function(Medicinemaster) {


    Medicinemaster.observe('loaded', function (context, next) {
        let drugtypeId;
        drugtypeId = context.data.drugtype.split("#")[1];
        bizNetworkConnection.connect(cardName)
          .then((result) => {
            bizNetworkConnection.getAssetRegistry('io.mefy.pharmacy.DrugType')
              .then((assetRegistry) => {
                  console.log('asset registry',assetRegistry)
                return assetRegistry.get(drugtypeId);
              }).then(function (drug) {
                let drugdata = {
                  "$class": "io.mefy.pharmacy.DrugType",
                  "typeId":drug.typeId,
                  "type":drug.type,
                 "description":drug.description
                }
                context.data.drugtype = drugdata;
                next();
              });
          }).catch((error) => {
            next();
            console.log('err'+error);
          });
      });
    

};
