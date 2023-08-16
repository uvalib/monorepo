import{x as t}from"./lit-element-b1a1c7e4.js";function r(t){const r=t.match(/(\d+):(\d+)(am|pm)/i);if(r){const t=r[1],e=r[2],o=r[3].toLowerCase();return"00"===e?`${t}${o}`:`${t}:${e}${o}`}return t}function e(t){return t.replace("24hours","24 Hours").replace("ByApp","By Appt")}function o(o){return o.hours?o.hours.map((e=>t`
      ${r(e.from)} - ${r(e.to)}
    `)):o.status?e(o.status):""}function n(o){if(o&&o.hours&&o.hours.rawDates){const n=o.hours,s=Object.values(n.rawDates)[0];if(s&&s.hours)return s.hours.map((e=>t`
        ${r(e.from)} - ${r(e.to)}
      `));if(s&&s.status)return e(s.status)}return""}function s(t,r){return new Date(t).toLocaleDateString("en-US",[{weekday:"long",month:"long",day:"numeric",timeZone:"UTC"},{month:"short",day:"numeric",timeZone:"UTC"},{weekday:"short",timeZone:"UTC"}][r])}export{n as a,o as p,s};
