import { LitState, stateVar } from 'lit-element-state';

class UvalibCatalogLightState extends LitState {
    static get stateVars() {
        return {
            searching:false,
            basicSearch:true,
            hasresults:false,
            iskiosk:false,
            authorizing:false,
            userSearched:false,
            rawQueryString:"",
            pools:null,
            ready:false
        };
    }
}

export const catalogState = new UvalibCatalogLightState();