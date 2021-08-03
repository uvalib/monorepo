const defaults = {
    devMode: false,
    dummyMode: false
};

export class Sirsi {
    #authtoken;
    #user;
    #config;
    #host;
    #fillholdpath;
    #lastfillhold;
    
    constructor(config) {        
        this.#config = {...defaults, ...config};
        this.devMode = this.#config.devMode;
        this.dummyMode = this.#config.dummyMode;
    }

    // Getters/Setters
    set devMode(val) {
        if (!!(val)) {
            console.error("dev mode is true but there is no dev mode for this currently!!!");
        } else {
            console.info("dev mode is false");
            this.#host = "https://qmo3jwybkg.execute-api.us-east-1.amazonaws.com";
            this.#fillholdpath = "/production/library/fillholdreader/";
        }
    }

    get authenticated() {
        return !!(this.#authtoken);
    }

    authorize(userid, password){
        return (this.authenticated)?
            // If we have a token we are authorized already, just return the token in an empty promise
            Promise.resolve(this.#authtoken):
            (this.dummyMode)?
                // Just make up something and return it in a promise
                Promise.resolve({sessionToken: "55555555559"})
                .then(data=>{
                    this.#user - data;
                    this.#authtoken = data.sessionToken;
                    return this.#authtoken;
                }):
                // Get an auth token if we don't already have one
                fetch('https://qmo3jwybkg.execute-api.us-east-1.amazonaws.com/production/library/fillholdreader/555', {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        userid: userid,
                        password: password,
                        action: "auth"
                    }
                }).then(res=>res.json())
                .then(data=>{
                    this.#user = data;
                    this.#authtoken = data.sessionToken;
                    console.info(`auth token: ${this.#authtoken}`);
                    console.info(this.#user);
                    return this.#authtoken;
                });
            
    }

    fillhold(barcode, override=false) {
        let url = `https://qmo3jwybkg.execute-api.us-east-1.amazonaws.com/production/library/fillholdreader/${barcode}`;
        let now = new Date();
        let headers = { sessiontoken: this.#authtoken };
        if (override) headers.override="OK";
        return (!this.authenticated)?
            Promise.resolve({timestamp: now, hold: {error_messages:["not authenticated"]} }):
            (!this.dummyMode)?
                fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: headers
                }).then(res=>res.json())
                .then(data=>{
                    data.timestamp = now;
                    this.#lastfillhold = data;
                    return data;
                }):
                ( barcode === 'error' )?
                    Promise.resolve({
                        "timestamp": now,
                        "hold": {
                            "error_messages": [
                                "No hold for this item."
                            ],
                            "title": "Interview with Walter N. Ridley [videorecording] / April 10, 1989",
                            "author": "Ridley, Walter Nathaniel, 1910-1996.",
                            "item_id": "X032396510"
                        }
                    }):
                    ( barcode === "override"  && !override)?
                        Promise.resolve({"hold":{"error_messages":[{"code":"itemHasMultiplePieces","message":"This item has multiple pieces."}],"title":"The Oxford handbook of philosophy and literature","author":"Eldridge, Richard Thomas, 1953-","item_id":"X030566353","user_full_name":"LEO COPY","user_id":"999999462","pickup_library":"LEO"},"user":{"Message":"User with external user id 999999462 was not found."}}):
                        Promise.resolve({
                            timestamp: now,
                            hold:{
                            "error_messages": [],
                            "title": "Developmental cascades : building the infant mind",
                            "author": "Oakes, Lisa M., 1963- author.",
                            "item_id": "X032591695",
                            "user_full_name": "Reighart, Renee Allison",
                            "user_id": "rar6u",
                            "pickup_location": "CLEMONS"
                        },user:{"UserName":"rar6u","ExternalUserId":"rar6u","LastName":"Reighart","FirstName":"Renee","SSN":"","Status":"Faculty","EMailAddress":"rar6u@virginia.edu","Phone":"434-555-5555","Department":"Library","NVTGC":"ILL","NotificationMethod":"Electronic","DeliveryMethod":"Hold for Pickup","LoanDeliveryMethod":"Hold for Pickup","LastChangedDate":"2018-11-06T10:20:39","AuthorizedUsers":"","Cleared":"Yes","Web":true,"Address":"","Address2":"","City":"","State":"","Zip":"","Site":null,"ExpirationDate":"2019-11-06T10:20:39","Number":"","UserRequestLimit":0,"Organization":"","Fax":"Dept","ShippingAcctNo":null,"ArticleBillingCategory":"","LoanBillingCategory":"","Country":"Ivy Cottage","SAddress":null,"SAddress2":null,"SCity":null,"SState":null,"SZip":null,"SCountry":null,"RSSID":"1149","AuthType":"Default","UserInfo1":"Library","UserInfo2":null,"UserInfo3":null,"UserInfo4":null,"UserInfo5":null,"MobilePhone":null}});
    }

}