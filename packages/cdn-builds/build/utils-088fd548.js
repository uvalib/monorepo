import{x as t}from"./lit-element-b1a1c7e4.js";function e(t){const e=t.match(/(\d+):(\d+)(am|pm)/i);if(e){const t=e[1],r=e[2],o=e[3].toLowerCase();return"00"===r?`${t}${o}`:`${t}:${r}${o}`}return t}function r(t){return t.replace("24hours","24 Hours").replace("ByApp","By Appt")}function o(o){return o.hours?o.hours.map((r=>t`
      ${e(r.from)} - ${e(r.to)}
    `)):o.status?r(o.status):""}function n(o){if(o&&o.hours&&o.hours.rawDates){const n=o.hours,s=Object.values(n.rawDates)[0];if(s.hours)return s.hours.map((r=>t`
        ${e(r.from)} - ${e(r.to)}
      `));if(s.status)return r(s.status)}return""}function s(t,e){return new Date(t).toLocaleDateString("en-US",[{weekday:"long",month:"long",day:"numeric",timeZone:"UTC"},{month:"short",day:"numeric",timeZone:"UTC"},{weekday:"short",timeZone:"UTC"}][e])}function u(t){return t.sort(((t,e)=>(t.title?t.title:"")>(e.title?e.title:"")?1:-1))}export{u as a,n as b,o as p,s};
