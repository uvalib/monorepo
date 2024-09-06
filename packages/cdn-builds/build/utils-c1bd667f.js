import{x as t}from"./property-4490ebb8.js";function r(t){const r=t.match(/(\d+):(\d+)(am|pm)/i);if(r){const t=r[1],o=r[2],e=r[3].toLowerCase();return"00"===o?`${t}${e}`:`${t}:${o}${e}`}return t}function o(t){return t.replace("24hours","24 Hours").replace("ByApp","By Appt")}function e(e){return e.hours?e.hours.map((o=>t`
      ${r(o.from)} - ${r(o.to)}
    `)):e.status?o(e.status):""}function n(e){if(e&&e.hours&&e.hours.rawDates){const n=e.hours,s=Object.values(n.rawDates)[0];if(s&&s.hours)return s.hours.map((o=>t`
        ${r(o.from)} - ${r(o.to)}
      `));if(s&&s.status)return o(s.status)}return""}function s(t,r){return new Date(t).toLocaleDateString("en-US",[{weekday:"long",month:"long",day:"numeric",timeZone:"UTC"},{month:"short",day:"numeric",timeZone:"UTC"},{weekday:"short",timeZone:"UTC"}][r])}export{n as a,e as p,s};
