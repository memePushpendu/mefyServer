
module.exports = function () {
    this.BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
    this.bizNetworkConnection = new BusinessNetworkConnection();
    this.cardName = "admin@mefy";

    /** Connect fabric sdk to communicate with hyperledger **/
    this.connect = function () {
        return new Promise(function (resolve, reject) {
            bizNetworkConnection.connect(cardName)
                .then((result) => {
                    // this.businessNetworkDefinition = result;
                    resolve(result);
                    console.log(result);
                }).catch((error) => {
                    reject(error);
                    console.log(error);
                });
        });
    }

    /** disconnect fabric sdk **/
    this.disconnect = function () {
        bizNetworkConnection.disconnect();
    }

}