import { html, css, LitElement } from 'lit';
import '@uvalib/uvalib-account/src/UvalibAccountAppOld.js';
import { getDatabase, ref, child, get, orderByChild, equalTo, query } from "firebase/database";

export class UvalibData extends LitElement {

  static get properties() {
    return {
    };
  }

  get(path) {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, path)).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val()
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  /* get by child with key value */
  getByChildKey(path, key, value) {
    return get( query( ref(getDatabase(), 'forms'), orderByChild(key), equalTo(value) ) ).then((snapshot) => {
          if (snapshot.exists()) {
            return Object.values( snapshot.val() )[0]
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
  }

  constructor() {
    super();
  }

}
