import { LitState, stateVar } from 'lit-element-state';
import { Item } from '@uvalib/data-models/lib/item.js';

class UvalibCatalogLightState extends LitState {
    static get stateVars() {
        return Object.fromEntries( Object.keys(this._stateVars).map(key=>[key,this._stateVars[key].default]) );
    }
    static get _stateVars() {
        return {
            searching:{default:false},
            basicSearch:{default:true, push:true},
            hasresults:{default:false, push:true},
            iskiosk:{default:false},
            authorizing:{default:false},
            userSearched:{default:false, push:true},
            rawQueryString:{default:"", push:true},
            pools:{default:null},
            ready:{default:false},
            hasFocusedItem:{default:false, push:true},
            focusedItem:{default:null, push:true, make:(i)=>new Item(i) }
        };
    }

    replaceState() {
        let vars = this.constructor._stateVars;
        history.replaceState(
            Object.fromEntries( Object.keys(vars).filter(k=>vars[k].push).map(p=>[p,this[p]]) )
//            Object.fromEntries( this.constructor.pushVars.map(prop=>[prop,this[prop]]) )
            , ""
        );
    }

    pushState() {
        let vars = this.constructor._stateVars;
        history.pushState(
            Object.fromEntries( Object.keys(vars).filter(k=>vars[k].push).map(p=>[p,this[p]]) )
//            Object.fromEntries( this.constructor.pushVars.map(propKey=>[propKey,this[propKey]]) )
            , ""
        );
    }

    constructor() {
        super();
        let vars = this.constructor._stateVars;
        window.onpopstate = function(event) {
            Object.keys(vars).filter(k=>vars[k].push).forEach(key=>{
                this[key] = vars[key].make && event.state[key]? 
                    vars[key].make(event.state[key]):
                    event.state[key];
            });
//            this.constructor.pushVars.forEach(propKey=>this[propKey]=event.state[propKey]);
        }.bind(this);
    }
}

export const catalogState = new UvalibCatalogLightState();