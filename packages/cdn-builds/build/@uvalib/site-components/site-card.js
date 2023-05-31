import{h as s,F as a,c as e,g as t,f as o,i as r,j as i,p as l,s as c}from"../../SiteStyleMapping-f1ccf68c.js";import{e as n}from"../../elevation-63298dfb.js";import{d}from"../../display-058af2ce.js";import{f as h,S as p}from"../../match-media-stylesheet-behavior-575be983.js";let g=class extends a{};const b=(s,a)=>e`
        ${d("block")} :host {
            --elevation: 4;
            display: block;
            contain: content;
            height: var(--card-height, 100%);
            width: var(--card-width, 100%);
            box-sizing: border-box;
            background: ${t};
            border-radius: calc(${o} * 1px);
            ${n}
        }
    `.withBehaviors(h(e`
                :host {
                    forced-color-adjust: none;
                    background: ${p.Canvas};
                    box-shadow: 0 0 0 1px ${p.CanvasText};
                }
            `));const m=class extends g{connectedCallback(){super.connectedCallback();const s=r(this);s&&t.setValueFor(this,(a=>i.getValueFor(a).evaluate(a,t.getValueFor(s))))}}.compose({baseName:"card",baseClass:g,template:(a,e)=>s`
    <slot></slot>
`,styles:b});l().withPrefix("site").register(m({styles:(s,a)=>e`
                ${c}
                ${b()}
                :host {
                    padding: 10px;
                    --fill-color: var(--uva-grey-lightest, lightgrey) !important;
                }
            `}));
