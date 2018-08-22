'use strict';
const Composer = require('../lib/composer.js');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const bizNetworkConnection = new BusinessNetworkConnection();
const cardName = "admin@mefy";
var app = require('../../server/server');

module.exports = function (Medicinemaster) {


  /** generate medicine id */
  Medicinemaster.beforeRemote('create', function (context, user, next) {
    let date = new Date();
    var milliSeconds = Date.parse(date);
    let responsedata;
    //  PROMISE FOR DRUG TYPE CHECKING
    checkdrug(context.args.data.drugtype).then(function (result) {
      // PROMISE FOR MANUFACTURER CHECKING
      checkmanuf(context.args.data.manufacturer).then(function (response) {
        console.log('both exists')
        // GENERATING MEDICINE ID IF DRUG AND MANUFACTURER EXIST
        context.args.data.medicineId = context.args.data.manufacturer + '-' + ((context.args.data.rxname.includes(' ')) ? (context.args.data.rxname.replace(/ +/g, "")) : (context.args.data.rxname)) + '-' + milliSeconds;
        next();
      })
        // THROWING ERROR
        .catch(function (err) {
          var err = new Error(err);
          err.statusCode = 404;
          next(err);
        })
    })
      // THROWING ERROR
      .catch(function (err) {
        var err = new Error(err);
        err.statusCode = 404;
        next(err);
      })

  })

  /*********************************************************************** */

  /***CHECK THE EXISTENCE OF THAT DRUG TYPE */
  function checkdrug(drug) {
    const DrugType = app.models.DrugType;
    return new Promise((resolve, reject) => {
      DrugType.find({ where: { typeId: drug } }, function (err, exists) {

        if (exists.length != 0) {
          resolve(true);
        }
        else {
          reject('DRUG TYPE WITH THIS ID DOESNOT EXISTS!');
        }
      })
    })

  }

  /**CHECK THE EXISTENCE OF MANUFACTURER */
  function checkmanuf(manuf) {
    const Manufacturer = app.models.Manufacturer;
    return new Promise((resolve, reject) => {
      Manufacturer.exists(manuf, function (err, exists) {

        if (exists) {
          resolve(true);
        }
        else {
          reject('MANUFACTURER  WITH THIS ID DOESNOT EXISTS!');
        }
      })
    })

  }



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
    const DrugType = app.models.DrugType;
    const Manufacturer = app.models.Manufacturer;

    /** FETCHING DRUGS DETIAL */
    DrugType.find({ where: { typeId: context.data.drugtype.includes('#') ? context.data.drugtype.split('#')[1] : context.data.DrugType } }, function (err, drugs) {
      context.data.drugtype = drugs[0];
      /** FETCHING MANUFACTURER DETAILS */
      Manufacturer.find({ where: { gstin: context.data.manufacturer.includes('#') ? context.data.manufacturer.split('#')[1] : context.data.manufacturer } }, function (err, manufacturer) {
        context.data.manufacturer = manufacturer[0];
        // console.log(context.data.substitute)
        //         for (const subs of manufacturer[0].substitute) {
        //           Medicinemaster.find({ where: { medicineId: subs.split('#')[1] } }, function (err, instances) {
        // console.log(instances);
        //           })
        //         }
        next();
      })
    });

  });

  /** */
  async function ProcessArray(array) {
    console.log('INSIDE PROCESS ARRAY', array)
    let x;
    for (const subs of array) {
      console.log(subs)
      await logs(subs);
      console.log('AFTER PROCESS ARRAY AWAIT')
      x.push(a)
      return x;
    }

  }

  async function logs(item) {
    console.log('INSIDE LOGS FUNCTION', item);

    await Medicinemaster.find({ where: { medicineId: item.split('#')[1] } }, function (err, medicine) {
      console.log('INSIDE MEDICINE FIND METHOD', medicine)
      return (medicine)
      // resolve('jyotijyoti');
    })
    // await substitutedata(item);
    console.log('AFTER LOGS FUNCTION')
  }


  async function substitutedata(item) {
    console.log('INSIDE SUBSTITIUE FUNCTION', item.split('#')[1])

    // return new Promise((resolve) => {
    // resolve('lllllllllllllllllllllllll')
    Medicinemaster.find({ where: { medicineId: item.split('#')[1] } }, function (err, medicine) {
      console.log('INSIDE MEDICINE FIND METHOD', medicine)
      return (medicine)
      // resolve('jyotijyoti');
    })
    // })
  }
};
