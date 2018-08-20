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

    /** SHOW MEDICINEID AND PHARMACYDATA ON GETTING LIST */
    Pharmacyitem.observe('loaded', function (context, next) {
        const Pharmacy = app.models.Pharmacy;
        const MedicineMaster = app.models.MedicineMaster;

        //  FETCH PHARMACY DETAILS   


        Pharmacy.find({ where: { tradeLicenseId: context.data.pharmacyId.includes('#') ? context.data.pharmacyId.split('#')[1] : context.data.pharmacyId } }, function (err, pharmacy) {
            console.log('lkx', pharmacy)
            // if (pharmacy.length != 0) {
            let pharmaData = {
                "$class": "io.mefy.pharmacy.Pharmacy",
                "tradeLicenseId": pharmacy[0].tradeLicenseId,
                "address": {
                    "$class": "io.mefy.pharmacy.Address",
                    "street": pharmacy[0].address.street,
                    "city": pharmacy[0].address.city,
                    "country": pharmacy[0].address.country,
                    "zipcode": pharmacy[0].address.zipcode
                },
                "pharmacyName": pharmacy[0].pharmacyName,
                "primaryContact": pharmacy[0].primaryContact,
                "alternateContact": pharmacy[0].alternateContact,
                "email": pharmacy[0].email,
                "gstNo": pharmacy[0].gstNo,
                "degreeFile": pharmacy[0].degreeFile,
                "drugLicense": pharmacy[0].drugLicense,
                "tradeLicense": pharmacy[0].tradeLicense
                // }
            }
            context.data.pharmacyId = pharmaData;
            MedicineMaster.find({ where: { medicineId: context.data.medicineId.includes('#') ? context.data.medicineId.split('#')[1] : context.data.medicineId } }, function (err, medicine) {
                console.log('!!!', medicine);
                let medicineData = {
                    "$class": "io.mefy.pharmacy.MedicineMaster",
                    "medicineId": medicine[0].medicineId,
                    "name": medicine[0].name,
                    "form": medicine[0].form,
                    "rxname": medicine[0].rxname,
                    "description": medicine[0].description,
                    "manufacturer": (medicine[0].manufacturer),

                    "drugtype": (medicine[0].drugtype),

                    "condition": medicine[0].condition,
                    "precaution": medicine[0].precaution,
                    "direction": medicine[0].direction,
                    "strength": medicine[0].strength,
                    "unit": medicine[0].unit,
                    "quantity": medicine[0].quantity,
                    "substitute": medicine[0].substitute,
                    "gstrate": medicine[0].gstrate
                    // }
                }
                context.data.medicineId = medicineData;
                next();

            });

        })

        // pharmaInfo(context.data.pharmacyId.includes('#') ? context.data.pharmacyId.split('#')[1] : context.data.pharmacyId).then(function (response) {
        //     context.data.pharmacyId = response;
        //     medicineInfo(context.data.medicineId.includes('#') ? context.data.medicineId.split('#')[1] : context.data.medicineId).then(function (response) {
        //         console.log(response)
        //         context.data.medicineId = response;
        //         next();
        //     }).catch(function (err) {
        //         var err = new Error(err);
        //         err.statusCode = 404;
        //         next(err);
        //     })

        // }).catch(function (err) {
        //     var err = new Error(err);
        //     err.statusCode = 404;
        //     next(err);
        // })


    });


    /************************************************* */

    //    GET PHARMA DATA
    function pharmaInfo(pharma) {
        console.log('vlvvvv', pharma)
        const Pharmacy = app.models.Pharmacy;
        return new Promise((resolve, reject) => {
            Pharmacy.find({ where: { tradeLicenseId: pharma } }, function (err, pharmacy) {
                console.log('lkx', pharmacy)
                if (pharmacy.length != 0) {
                    let pharmaData = {
                        "$class": "io.mefy.pharmacy.Pharmacy",
                        "tradeLicenseId": pharmacy[0].tradeLicenseId,
                        "address": {
                            "$class": "io.mefy.pharmacy.Address",
                            "street": pharmacy[0].address.street,
                            "city": pharmacy[0].address.city,
                            "country": pharmacy[0].address.country,
                            "zipcode": pharmacy[0].address.zipcode
                        },
                        "pharmacyName": pharmacy[0].pharmacyName,
                        "primaryContact": pharmacy[0].primaryContact,
                        "alternateContact": pharmacy[0].alternateContact,
                        "email": pharmacy[0].email,
                        "gstNo": pharmacy[0].gstNo,
                        "degreeFile": pharmacy[0].degreeFile,
                        "drugLicense": pharmacy[0].drugLicense,
                        "tradeLicense": pharmacy[0].tradeLicense
                    }

                    resolve(pharmaData)
                }
                else { reject('fgjfngk') }
            })
        })

    };

    //MEDIICNE INFO
    function medicineInfo(med) {
        console.log('dedwded', med)
        const MedicineMaster = app.models.MedicineMaster;
        return new Promise((resolve, reject) => {
            MedicineMaster.find({ where: { medicineId: med } }, function (err, medicine) {
                console.log('!!!', medicine);

                if (medicine.length != 0) {
                    console.log(JSON.parse(medicine[0].drugtype))
                    let medicineData = {
                        "$class": "io.mefy.pharmacy.MedicineMaster",
                        "medicineId": medicine[0].medicineId,
                        "name": medicine[0].name,
                        "form": medicine[0].form,
                        "rxname": medicine[0].rxname,
                        "description": medicine[0].description,
                        "manufacturer": medicine[0].manufacturer,

                        "drugtype": medicine[0].drugtype,

                        "condition": medicine[0].condition,
                        "precaution": medicine[0].precaution,
                        "direction": medicine[0].direction,
                        "strength": medicine[0].strength,
                        "unit": medicine[0].unit,
                        "quantity": medicine[0].quantity,
                        "substitute": medicine[0].substitute,
                        "gstrate": medicine[0].gstrate
                    }
                    resolve(medicineData);
                } else {
                    reject('fjgkfbnjkk')
                }


            });
        })
    };


};

// { '$class': 'io.mefy.pharmacy.Manufacturer',
//        gstin: '123',
//        name: 'manufacturer 1',
//        address: [Object],
//        contactName: '23423434',
//        contactNumber: '23434' },
