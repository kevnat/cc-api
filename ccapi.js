//Importing axios library
const axios = require("axios");

//creating axios config called API
//TO DO: parameterize all values
const API = axios.create({
    baseURL: "https://fts.cardconnect.com:6443/cardconnect/rest",
    timeout: 1000,
    auth: {
        username: 'testing',
        password: 'testing123'
      }
  });
//   const merchid = "496160873888";
  //configuring the merchid to be used. could probably go into 'data' within config.
const config = {
    merchid: "496160873888",
    account:"4444333322221111",
    expiry: "0822",
    amount: "100",
    retref: "285474105992",
    capture: "Y"
};

//test function to see validate credentials
//
/*
function testConnect() {
    API.get(
        ""
    )
    .then(function(response) {
        console.log(response.data);
    })
    .catch(function(error){
        console.log(error);
    });  
}

testConnect();

*/
class Auth {
    constructor(merchid, cardnum, expiry, amount, capture) {
        this.account = cardnum;
        this.expiry = expiry;
        this.amount = amount;
        this.merchid = merchid;
        this.capture = capture;
    };
    runAuth() {
        //TO DO: parameterize URL
        API.put('/auth', {
            account: this.account,
            expiry: this.expiry,
            amount: this.amount, 
            merchid: this.merchid,
            capture: this.capture
        })
        .then(function(response){
            // console.log(response.data);
            let authResp = response.data;
            console.log("CVV Response: " + authResp.cvvresp); //e.g 'X' 
            function insertAuth(authResp){
                console.log("recording auth...");
                    console.log("Authorization Response: " + authResp.resptext); //Approval or Declined
                    //setup object that will be written to database
                         let authRecord = 
                         {
                            merchid : authResp.merchid,
                            respstat : authResp.respstat,
                            retref : authResp.retref,
                            resptext : authResp.resptext,
                            cvvresp : authResp.cvvresp,
                            amount : authResp.amount
                         };
                         console.log(authRecord);
                    //insert the record into database
                    console.log("auth recorded");
                    //add logic to validate the auth upon an error...maybe?
                    return authRecord;
            }

            //passing auth resp to insertAuth function
            //TO DO: write record to database
            insertAuth(authResp);
            //trying to export the authRecord
            // insertAuth(authResp), (authRecord) => {
            //     console.log(authRecord);
            // });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}


class Void {
    constructor(merchid, retref) {
        this.merchid = merchid;
        this.retref = retref;
        // this.amount = amount; //if omitted, full amount will be voided
    };
    runVoid() {
        API.put('/void', {
            merchid: this.merchid,
            retref: this.retref 
        })
        .then(function(response){
            console.log(response.data);
            // { authcode: 'REVERS',
            // respproc: 'FNOR',
            // amount: '0.00',
            // resptext: 'Approval',
            // currency: 'USD',
            // retref: '285439205004',
            // respstat: 'A',
            // respcode: '00',
            // merchid: '496160873888' }
            
            //find retref by id and update:  
                // respstat to voided
                // amount to 0.00

        })
        .catch(function(error){
            console.log(error);
        })
    }
}

class Refund {
    constructor(merchid, retref) {
        this.merchid = merchid;
        this.retref = retref;
        this.amount = amount; //if omitted, full amount will be voided
    };
    runRefund() {
        API.put('/refund', {
            merchid: this.merchid,
            retref: this.retref 
        })
        .then(function(response){
            console.log(response.data);
        })
        .catch(function(error){
            console.log(error);
        })
    }
}

// destructuring properties of 'config' object into different variables
const { merchid, account, expiry, amount, retref, capture } = config; 
console.log("config loaded");

//INSTATIATING AND CALLING RUN* FUNCTIONS
//instatiate the auth class by passing the required parameters
//calling the runAuth function... 
//
let newAuth = new Auth( merchid, account, expiry, amount, capture);
newAuth.runAuth();

let newVoid = new Void( merchid, retref );
newVoid.runVoid();

let newRefund = new Refund ( merchid, retref );
newRefund.runRefund();


// export the config and classess for refactoring later
// export {config, Auth, Void};