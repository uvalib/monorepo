import{x as t}from"./query-assigned-elements-23ba9e4f.js";function e(e){return e.hours?e.hours.map((e=>t`
        ${e.from} - ${e.to}
      `)):e.status?e.status.replace("24hours","24 Hours"):""}function r(e){if(e&&e.hours&&e.hours.rawDates){const r=e.hours,o=Object.values(r.rawDates)[0];if(o.hours)return o.hours.map((e=>t`
          ${e.from} - ${e.to}
        `));if(o.status)return o.status.replace("24hours","24 Hours")}return""}function o(t,e){return new Date(t).toLocaleDateString("en-US",[{weekday:"long",month:"long",day:"numeric",timeZone:"UTC"},{month:"short",day:"numeric",timeZone:"UTC"},{weekday:"short",timeZone:"UTC"}][e])}function s(t){return t.sort(((t,e)=>(t.title?t.title:"")>(e.title?e.title:"")?1:-1))}export{s as a,r as b,e as p,o as s};
