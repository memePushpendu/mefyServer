const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const bizNetworkConnection = new BusinessNetworkConnection();
const cardName = "admin@mefy";
bizNetworkConnection.connect(cardName)
    .then((result) => {
        // this.businessNetworkDefinition = result;
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });