import{s}from"../../SiteStyleMapping-3f0e5ae7.js";import{h as a,F as e,c as t,g as o,f as r,i,j as l,p as c}from"../../fast-design-system-b703147e.js";import{e as n}from"../../elevation-63298dfb.js";import{d}from"../../display-058af2ce.js";import{f as h,S as p}from"../../match-media-stylesheet-behavior-575be983.js";import"../../tslib.es6-6ae91544.js";let m=class extends e{};const g=(s,a)=>t`
        ${d("block")} :host {
            --elevation: 4;
            display: block;
            contain: content;
            height: var(--card-height, 100%);
            width: var(--card-width, 100%);
            box-sizing: border-box;
            background: ${o};
            border-radius: calc(${r} * 1px);
            ${n}
        }
    `.withBehaviors(h(t`
                :host {
                    forced-color-adjust: none;
                    background: ${p.Canvas};
                    box-shadow: 0 0 0 1px ${p.CanvasText};
                }
            `));const b=class extends m{connectedCallback(){super.connectedCallback();const s=i(this);s&&o.setValueFor(this,(a=>l.getValueFor(a).evaluate(a,o.getValueFor(s))))}}.compose({baseName:"card",baseClass:m,template:(s,e)=>a`
    <slot></slot>
`,styles:g});c().withPrefix("site").register(b({styles:(a,e)=>t`
                ${s}
                ${g()}
                :host {
                    padding: 10px;
                    --fill-color: var(--uva-grey-lightest, lightgrey) !important;
                }
            `}));
