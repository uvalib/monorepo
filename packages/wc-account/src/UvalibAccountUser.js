import { LitElement } from 'lit';
import { UvalibAccountAuth } from './UvalibAccountAuth.js';
//
import "@uvalib/uvalib-data/uvalib-data.js";

export class UvalibAccountUser extends UvalibAccountAuth {

  static get properties() {
    return {...super.properties, ...{
      userData: { type: Object },
      requestDetails: { type: Object },
      libStaff: { type: Boolean, reflect: true },
      contactInfo: { type: Object }
    }};
  }

  constructor() {
    super();
  }

  connectedCallback(){
    super.connectedCallback();
    this.db = document.createElement('uvalib-data');
    this.shadowRoot.appendChild( this.db );
  }

  updated(changedProps) {
    super.updated(changedProps);
    if ( changedProps.has('userData') ) {
      this._dispatchEvent('userData', { userData: this.userData });
      this._updateContactInfo();
    }
    if ( changedProps.has('contactInfo') ) {
      this._dispatchEvent('contactInfo', { contactInfo: this.contactInfo });
    }
  }

  _signedIn(){
    super._signedIn();
    this._getUserRecord();
  }

  _getUserRecord(){
    this.db.get(`users/${this.user.uid}`).then(user => this.userData = user);
/*
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${this.user.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        this.userData = snapshot.val()
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
*/    
  }

  _updateContactInfo(){
    let userData = this.userData;
    let contactInfo = {computing_id: '', name: '', email: '', phone: '', affiliation: '', department_school: '', processed_dept_school: ''};
    if ( userData && userData.LDAP ) {
      var prefName, prefEmail, status, deptSchool;
      contactInfo.computing_id = userData.LDAP.uid;
      contactInfo.name = userData.LDAP.givenName + ' ' + userData.LDAP.sn;
      contactInfo.email = userData.LDAP.preferredemailaddress || userData.LDAP.mail || "";
      contactInfo.affiliation = userData.LDAP.edupersonprimaryaffiliation || 
                                userData.LDAP.uvaPersonIAMAffiliation ||
                                userData.LDAP.edupersonaffiliation ||
                                "";    
      if (contactInfo.affiliation.includes('student')) {
        if (userData.LDAP.uvaRegistrarSchool) {
          contactInfo.department_school = this._stripInitialDeptCode(this._getPrimaryDepartment(userData.LDAP.edupersonprimaryaffiliation,this.userData.LDAP.uvaRegistrarSchool));
          contactInfo.processed_dept_school = this._processDepartmentSchool(contactInfo.department_school);
        } else if (userData.LDAP.uvaDisplayDepartment) {
          contactInfo.department_school = this._stripInitialDeptCode(this._getPrimaryDepartment(userData.LDAP.edupersonprimaryaffiliation,userData.LDAP.uvaDisplayDepartment));
          contactInfo.processed_dept_school = this._processDepartmentSchool(this._getPrimaryDepartment(userData.LDAP.edupersonprimaryaffiliation,userData.LDAP.uvaDisplayDepartment));
        } else if (userData.LDAP.uvaOracleDeptName) {
          contactInfo.department_school = this._stripInitialDeptCode(userData.LDAP.uvaOracleDeptName);
          contactInfo.processed_dept_school = this._processDepartmentSchool(userData.LDAP.uvaOracleDeptName);
        }
        contactInfo.phone = (userData.LDAP.mobile) ? userData.LDAP.mobile : '';
      } else {
        if (userData.LDAP.uvaDisplayDepartment) {
          contactInfo.department_school = this._stripInitialDeptCode(this._getPrimaryDepartment(userData.LDAP.edupersonprimaryaffiliation,userData.LDAP.uvaDisplayDepartment));
          contactInfo.processed_dept_school = this._processDepartmentSchool(this._getPrimaryDepartment(userData.LDAP.edupersonprimaryaffiliation,userData.LDAP.uvaDisplayDepartment));
        } else if (userData.LDAP.uvaOracleDeptName) {
          contactInfo.department_school = this._stripInitialDeptCode(userData.LDAP.uvaOracleDeptName);
          contactInfo.processed_dept_school = this._processDepartmentSchool(userData.LDAP.uvaOracleDeptName);
        }
        if (userData.LDAP.telephoneNumber) {
          contactInfo.phone = userData.LDAP.telephoneNumber;
        } else if (userData.LDAP.mobile) {
          contactInfo.phone = userData.LDAP.mobile;
        }
      }
    }
    this.contactInfo = contactInfo;
  }

  _stripInitialDeptCode(ldapValue) {
    // Strip out that initial code at the start of the department
    return ldapValue.replace(/^[A-Z0-9]{2}:/,'');
  }

  _getPrimaryDepartment(affiliation,depts) {
    if (Array.isArray(depts)) {
      if (affiliation === "staff" || affiliation === "faculty") {
        return this._getArrayEntry(depts.filter(dept => dept.startsWith("E")));
      } else if (affilation === "student") {
        var d = depts.filter(dept => dept.startsWith("U")); // uva student
        if (d.length < 1) { // wise student?
          d = depts.filter(dept => dept.startsWith("W"));
        }
        return this._getArrayEntry(d);
      } else {
        return depts[0];
      }
    } else {
      return depts;
    }
  }

  _processDepartmentSchool(ldapValue) {
    var dept = this._stripInitialDeptCode(ldapValue);
    // Modified to use new community LDAP values to best align to Library departments...
    if (dept.indexOf('AR-') > -1) {
      if (dept.indexOf('Arch History') > -1) dept = 'Architectural History';
      if (dept.indexOf('Landscape') > -1) dept = 'Landscape Architecture';
      if (dept.indexOf('AR-') > -1) dept = 'Architecture';
    } else if (dept.indexOf('AS-') > -1) {
      if (dept.indexOf('African') > -1) dept = 'African-American and African Studies';
      if (dept.indexOf('Biol ') > -1) dept = 'Biology';
      if ((dept.indexOf('E Asian') > -1) || (dept.indexOf('East Asian') > -1)) dept = 'East Asian';
      if ((dept.indexOf('English') > -1) || (dept.indexOf('Writing') > -1) || (dept.indexOf('Literary History') > -1)) dept = 'English';
      if (dept.indexOf('French') > -1) dept = 'French';
      if (dept.indexOf('German') > -1) dept = 'German';
      if (dept.indexOf('MidEast') > -1) dept = 'Middle Eastern and South Asian';
      if (dept.indexOf('Physics') > -1) dept = 'Physics';
      if ((dept.indexOf('Politics') > -1) || (dept.indexOf('Political') > -1)) dept = 'Politics';
      if (dept.indexOf('Religion ') > -1) dept = 'Religious Studies';
      if (dept.indexOf('Slavic') > -1) dept = 'Slavic';
      if (dept.indexOf('Spanish') > -1) dept = 'Spanish, Italian, and Portuguese';
      if (dept.indexOf('Women') > -1) dept = 'Women, Gender, & Sexuality';
      if (dept.indexOf('AS-') > -1) dept = dept.replace(/^AS-/,''); // necessary for getting Biology, Chemistry, etc.
    } else if (dept.indexOf('BA-') > -1) {
      dept = 'Batten School';
    } else if (dept.indexOf('MC-') > -1) {
      dept = 'Commerce';
    } else if (dept.indexOf('CU-') > -1) {
      dept = 'Education';
    } else if (dept.indexOf('EN-') > -1) {
      if (dept.indexOf('Biomed ') > -1) dept = 'Biomedical Engineering';
      if (dept.indexOf('Chem ') > -1) dept = 'Chemical Engineering';
      if (dept.indexOf('Environment') > -1) dept = 'Civil and Environmental Engineering';
      if (dept.indexOf('Comp Science') > -1) dept = 'Computer Science';
      if (dept.indexOf('Elec/Comp') > -1) dept = 'Electrical and Computer Engineering';
      if (dept.indexOf('Mat Sci') > -1) dept = 'Materials Science and Engineering';
      if (dept.indexOf('Mech/Aero') > -1) dept = 'Mechanical and Aerospace Engineering';
      if (dept.indexOf('Society') > -1) dept = 'Science, Technology and Society';
      if (dept.indexOf('EN-') > -1) dept = 'Engineering';
    } else if (dept.indexOf('LB-') > -1) {
      dept = 'Library';
    }
    return dept;
  }

}
