import{h as e,F as s,_ as t,a,o as c,c as o,u as i,e as d,C as r,E as h,f as l,m as n,B as b,I as p,Z as k,P as $,$ as u,g,x as m,n as x,t as y,v as w,U as f,G as v,J as H,V as j,Q as T,W as F,p as O,s as S}from"../../SiteStyleMapping-f1ccf68c.js";import{d as C}from"../../display-058af2ce.js";import{d as L,h as N}from"../../size-3ecfc7b7.js";import{s as _,o as z,l as E,m as G}from"../../focus-03f3e890.js";import{f as A,S as B}from"../../match-media-stylesheet-behavior-575be983.js";import{D as I}from"../../direction-382fdb04.js";import{C as M}from"../../form-associated-e5fa19d4.js";class P extends s{}class V extends(M(P)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class D extends V{constructor(){super(),this.initialValue="on",this.keypressHandler=e=>{if(!this.readOnly)switch(e.key){case E:case z:this.checked=!this.checked}},this.clickHandler=e=>{this.disabled||this.readOnly||(this.checked=!this.checked)},this.proxy.setAttribute("type","checkbox")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly),this.readOnly?this.classList.add("readonly"):this.classList.remove("readonly")}checkedChanged(e,s){super.checkedChanged(e,s),this.checked?this.classList.add("checked"):this.classList.remove("checked")}}t([a({attribute:"readonly",mode:"boolean"})],D.prototype,"readOnly",void 0),t([c],D.prototype,"defaultSlottedNodes",void 0);const J=(e,s)=>o`
        :host([hidden]) {
            display: none;
        }

        ${C("inline-flex")} :host {
            align-items: center;
            outline: none;
            font-family: ${i};
            margin: calc(${d} * 1px) 0;
            ${""} user-select: none;
        }

        :host([disabled]) {
            opacity: ${r};
        }

        :host([disabled]) .label,
        :host([readonly]) .label,
        :host([readonly]) .switch,
        :host([disabled]) .switch {
            cursor: ${L};
        }

        .switch {
            position: relative;
            outline: none;
            box-sizing: border-box;
            width: calc(${N} * 1px);
            height: calc((${N} / 2 + ${d}) * 1px);
            background: ${h};
            border-radius: calc(${l} * 1px);
            border: calc(${n} * 1px) solid ${b};
        }

        .switch:hover {
            background: ${p};
            border-color: ${k};
            cursor: pointer;
        }

        host([disabled]) .switch:hover,
        host([readonly]) .switch:hover {
            background: ${p};
            border-color: ${k};
            cursor: ${L};
        }

        :host(:not([disabled])) .switch:active {
            background: ${$};
            border-color: ${u};
        }

        :host(:${G}) .switch {
            box-shadow: 0 0 0 2px ${g}, 0 0 0 4px ${m};
        }

        .checked-indicator {
            position: absolute;
            top: 5px;
            bottom: 5px;
            background: ${x};
            border-radius: calc(${l} * 1px);
            transition: all 0.2s ease-in-out;
        }

        .status-message {
            color: ${x};
            cursor: pointer;
            font-size: ${y};
            line-height: ${w};
        }

        :host([disabled]) .status-message,
        :host([readonly]) .status-message {
            cursor: ${L};
        }

        .label {
            color: ${x};
            margin-inline-end: calc(${d} * 2px + 2px);
            font-size: ${y};
            line-height: ${w};
            cursor: pointer;
        }

        .label__hidden {
            display: none;
            visibility: hidden;
        }

        ::slotted([slot="checked-message"]),
        ::slotted([slot="unchecked-message"]) {
            margin-inline-start: calc(${d} * 2px + 2px);
        }

        :host([aria-checked="true"]) .checked-indicator {
            background: ${f};
        }

        :host([aria-checked="true"]) .switch {
            background: ${v};
            border-color: ${v};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:hover {
            background: ${H};
            border-color: ${H};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
            background: ${j};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active {
            background: ${T};
            border-color: ${T};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active .checked-indicator {
            background: ${F};
        }

        :host([aria-checked="true"]:${G}:not([disabled])) .switch {
            box-shadow: 0 0 0 2px ${g}, 0 0 0 4px ${m};
        }

        .unchecked-message {
            display: block;
        }

        .checked-message {
            display: none;
        }

        :host([aria-checked="true"]) .unchecked-message {
            display: none;
        }

        :host([aria-checked="true"]) .checked-message {
            display: block;
        }
    `.withBehaviors(A(o`
            .checked-indicator,
            :host(:not([disabled])) .switch:active .checked-indicator {
                forced-color-adjust: none;
                background: ${B.FieldText};
            }
            .switch {
                forced-color-adjust: none;
                background: ${B.Field};
                border-color: ${B.FieldText};
            }
            :host(:not([disabled])) .switch:hover {
                background: ${B.HighlightText};
                border-color: ${B.Highlight};
            }
            :host([aria-checked="true"]) .switch {
                background: ${B.Highlight};
                border-color: ${B.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover,
            :host(:not([disabled])) .switch:active {
                background: ${B.HighlightText};
                border-color: ${B.Highlight};
            }
            :host([aria-checked="true"]) .checked-indicator {
                background: ${B.HighlightText};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
                background: ${B.Highlight};
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host(:${G}) .switch {
                border-color: ${B.Highlight};
                box-shadow: 0 0 0 2px ${B.Field}, 0 0 0 4px ${B.FieldText};
            }
            :host([aria-checked="true"]:${G}:not([disabled])) .switch {
                box-shadow: 0 0 0 2px ${B.Field}, 0 0 0 4px ${B.FieldText};
            }
            :host([disabled]) .checked-indicator {
                background: ${B.GrayText};
            }
            :host([disabled]) .switch {
                background: ${B.Field};
                border-color: ${B.GrayText};
            }
        `),new I(o`
                .checked-indicator {
                    left: 5px;
                    right: calc(((${N} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    left: calc(((${N} / 2) + 1) * 1px);
                    right: 5px;
                }
            `,o`
                .checked-indicator {
                    right: 5px;
                    left: calc(((${N} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    right: calc(((${N} / 2) + 1) * 1px);
                    left: 5px;
                }
            `)),Q=D.compose({baseName:"switch",template:(s,t)=>e`
    <template
        role="switch"
        aria-checked="${e=>e.checked}"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        tabindex="${e=>e.disabled?null:0}"
        @keypress="${(e,s)=>e.keypressHandler(s.event)}"
        @click="${(e,s)=>e.clickHandler(s.event)}"
        class="${e=>e.checked?"checked":""}"
    >
        <label
            part="label"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${_("defaultSlottedNodes")}></slot>
        </label>
        <div part="switch" class="switch">
            <slot name="switch">${t.switch||""}</slot>
        </div>
        <span class="status-message" part="status-message">
            <span class="checked-message" part="checked-message">
                <slot name="checked-message"></slot>
            </span>
            <span class="unchecked-message" part="unchecked-message">
                <slot name="unchecked-message"></slot>
            </span>
        </span>
    </template>
`,styles:J,switch:'\n        <span class="checked-indicator" part="checked-indicator"></span>\n    '});O().withPrefix("site").register(Q({styles:(e,s)=>[S,J()]}));
