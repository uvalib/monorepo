import{A as t,h as n,a8 as a}from"./SiteStyleMapping-51203cca.js";class e{constructor(t,n){this.target=t,this.propertyName=n}bind(t){t[this.propertyName]=this.target}unbind(){}}function s(n){return new t("fast-ref",e,n)}class o{handleStartContentChange(){this.startContainer.classList.toggle("start",this.start.assignedNodes().length>0)}handleEndContentChange(){this.endContainer.classList.toggle("end",this.end.assignedNodes().length>0)}}const r=(t,a)=>n`
    <span
        part="end"
        ${s("endContainer")}
        class=${t=>a.end?"end":void 0}
    >
        <slot name="end" ${s("end")} @slotchange="${t=>t.handleEndContentChange()}">
            ${a.end||""}
        </slot>
    </span>
`,d=(t,a)=>n`
    <span
        part="start"
        ${s("startContainer")}
        class="${t=>a.start?"start":void 0}"
    >
        <slot
            name="start"
            ${s("start")}
            @slotchange="${t=>t.handleStartContentChange()}"
        >
            ${a.start||""}
        </slot>
    </span>
`;function h(t,...n){const e=a.locate(t);n.forEach((n=>{Object.getOwnPropertyNames(n.prototype).forEach((a=>{"constructor"!==a&&Object.defineProperty(t.prototype,a,Object.getOwnPropertyDescriptor(n.prototype,a))}));a.locate(n).forEach((t=>e.push(t)))}))}n`
    <span part="end" ${s("endContainer")}>
        <slot
            name="end"
            ${s("end")}
            @slotchange="${t=>t.handleEndContentChange()}"
        ></slot>
    </span>
`,n`
    <span part="start" ${s("startContainer")}>
        <slot
            name="start"
            ${s("start")}
            @slotchange="${t=>t.handleStartContentChange()}"
        ></slot>
    </span>
`;export{o as S,h as a,r as e,s as r,d as s};
