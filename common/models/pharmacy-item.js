'use strict';
var app = require('../../server/server');

module.exports = function (Pharmacyitem) {

    /**** PHARMACY ITEM CREATION  */
    Pharmacyitem.beforeRemote('create', function (context, user, next) {
        let date = new Date();
        var milliSeconds = Date.parse(date);
        //   PHARMACY EXISTENCE      
        checkPharmcay(context.args.data.pharmacyId).then(function (result) {
            // MEDICINE EXISTENCE
            checkMedicine(context.args.data.medicineId).then(function (response) {
                context.args.data.itemId = context.args.data.medicineId + '-' + milliSeconds + '-' + context.args.data.pharmacyId;
                next();
            })
                .catch(function (err) {
                    var err = new Error(err);
                    err.statusCode = 404;
                    next(err);
                })
        })
            .catch(function (err) {
                var err = new Error(err);
                err.statusCode = 404;
                next(err);
            })
    });


    // CHECK PHARMACY EXISTENCE
    function checkPharmcay(pharma) {
        const Pharmacy = app.models.Pharmacy;
        return new Promise((resolve, reject) => {
            Pharmacy.exists(pharma, function (err, exists) {

                if (exists) {
                    resolve(true);
                }
                else {
                    reject('PHAMRACY  WITH THIS ID DOESNOT EXISTS!');
                }
            })
        })
    }

    // CHECK MEDICINE EXISTENCE
    function checkMedicine(medicine) {
        const MedicineMaster = app.models.MedicineMaster;
        return new Promise((resolve, reject) => {
            MedicineMaster.exists(medicine, function (err, exists) {
                if (exists) {
                    resolve(true);
                }
                else {
                    reject('MEDICNE DOESNOT EXIST!')
                }
            })
        })
    }
};
