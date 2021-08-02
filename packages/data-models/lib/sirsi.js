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

    fillhold(barcode) {
        let url = `https://qmo3jwybkg.execute-api.us-east-1.amazonaws.com/production/library/fillholdreader/${barcode}`;
        return (!this.authenticated)?
            Promise.resolve({error_messages:["not authenticated"]}):
            (this.dummyMode)?
                Promise.resolve({hold:{
                    "error_messages": [],
                    "title": "Developmental cascades : building the infant mind",
                    "author": "Oakes, Lisa M., 1963- author.",
                    "item_id": "X032591695",
                    "user_full_name": "Reighart, Renee Allison",
                    "user_id": "rar6u",
                    "pickup_location": "CLEMONS"
                  },user:{
                      
                  }}):
                fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        sessiontoken: this.#authtoken
                    }
                }).then(res=>res.json())
                .then(data=>{
                    this.#lastfillhold = data;
                    return data;
                });
    }

}