import{h as e,F as s,a as t,o as a,c,r as o,e as i,B as d,C as r,f as h,s as l,z as n,G as b,Y as k,N as p,Z as $,g as u,w as g,n as m,t as x,u as y,T as w,E as f,I as v,U as H,P as T,V as j,p as F}from"../../fast-design-system-b703147e.js";import{d as O}from"../../display-058af2ce.js";import{d as z,h as C}from"../../size-720798a2.js";import{s as N,o as L,l as S,m as _}from"../../focus-20c16bb0.js";import{f as E,S as G}from"../../match-media-stylesheet-behavior-575be983.js";import{D as B}from"../../direction-88bcdd2b.js";import{_ as I}from"../../tslib.es6-6ae91544.js";import{C as P}from"../../form-associated-e5f30f6f.js";class V extends s{}class A extends(P(V)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class D extends A{constructor(){super(),this.initialValue="on",this.keypressHandler=e=>{if(!this.readOnly)switch(e.key){case S:case L:this.checked=!this.checked}},this.clickHandler=e=>{this.disabled||this.readOnly||(this.checked=!this.checked)},this.proxy.setAttribute("type","checkbox")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly),this.readOnly?this.classList.add("readonly"):this.classList.remove("readonly")}checkedChanged(e,s){super.checkedChanged(e,s),this.checked?this.classList.add("checked"):this.classList.remove("checked")}}I([t({attribute:"readonly",mode:"boolean"})],D.prototype,"readOnly",void 0),I([a],D.prototype,"defaultSlottedNodes",void 0);const M=D.compose({baseName:"switch",template:(s,t)=>e`
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
            <slot ${N("defaultSlottedNodes")}></slot>
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
`,styles:(e,s)=>c`
        :host([hidden]) {
            display: none;
        }

        ${O("inline-flex")} :host {
            align-items: center;
            outline: none;
            font-family: ${o};
            margin: calc(${i} * 1px) 0;
            ${""} user-select: none;
        }

        :host([disabled]) {
            opacity: ${d};
        }

        :host([disabled]) .label,
        :host([readonly]) .label,
        :host([readonly]) .switch,
        :host([disabled]) .switch {
            cursor: ${z};
        }

        .switch {
            position: relative;
            outline: none;
            box-sizing: border-box;
            width: calc(${C} * 1px);
            height: calc((${C} / 2 + ${i}) * 1px);
            background: ${r};
            border-radius: calc(${h} * 1px);
            border: calc(${l} * 1px) solid ${n};
        }

        .switch:hover {
            background: ${b};
            border-color: ${k};
            cursor: pointer;
        }

        host([disabled]) .switch:hover,
        host([readonly]) .switch:hover {
            background: ${b};
            border-color: ${k};
            cursor: ${z};
        }

        :host(:not([disabled])) .switch:active {
            background: ${p};
            border-color: ${$};
        }

        :host(:${_}) .switch {
            box-shadow: 0 0 0 2px ${u}, 0 0 0 4px ${g};
        }

        .checked-indicator {
            position: absolute;
            top: 5px;
            bottom: 5px;
            background: ${m};
            border-radius: calc(${h} * 1px);
            transition: all 0.2s ease-in-out;
        }

        .status-message {
            color: ${m};
            cursor: pointer;
            font-size: ${x};
            line-height: ${y};
        }

        :host([disabled]) .status-message,
        :host([readonly]) .status-message {
            cursor: ${z};
        }

        .label {
            color: ${m};
            margin-inline-end: calc(${i} * 2px + 2px);
            font-size: ${x};
            line-height: ${y};
            cursor: pointer;
        }

        .label__hidden {
            display: none;
            visibility: hidden;
        }

        ::slotted([slot="checked-message"]),
        ::slotted([slot="unchecked-message"]) {
            margin-inline-start: calc(${i} * 2px + 2px);
        }

        :host([aria-checked="true"]) .checked-indicator {
            background: ${w};
        }

        :host([aria-checked="true"]) .switch {
            background: ${f};
            border-color: ${f};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:hover {
            background: ${v};
            border-color: ${v};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
            background: ${H};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active {
            background: ${T};
            border-color: ${T};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active .checked-indicator {
            background: ${j};
        }

        :host([aria-checked="true"]:${_}:not([disabled])) .switch {
            box-shadow: 0 0 0 2px ${u}, 0 0 0 4px ${g};
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
    `.withBehaviors(E(c`
            .checked-indicator,
            :host(:not([disabled])) .switch:active .checked-indicator {
                forced-color-adjust: none;
                background: ${G.FieldText};
            }
            .switch {
                forced-color-adjust: none;
                background: ${G.Field};
                border-color: ${G.FieldText};
            }
            :host(:not([disabled])) .switch:hover {
                background: ${G.HighlightText};
                border-color: ${G.Highlight};
            }
            :host([aria-checked="true"]) .switch {
                background: ${G.Highlight};
                border-color: ${G.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover,
            :host(:not([disabled])) .switch:active {
                background: ${G.HighlightText};
                border-color: ${G.Highlight};
            }
            :host([aria-checked="true"]) .checked-indicator {
                background: ${G.HighlightText};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
                background: ${G.Highlight};
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host(:${_}) .switch {
                border-color: ${G.Highlight};
                box-shadow: 0 0 0 2px ${G.Field}, 0 0 0 4px ${G.FieldText};
            }
            :host([aria-checked="true"]:${_}:not([disabled])) .switch {
                box-shadow: 0 0 0 2px ${G.Field}, 0 0 0 4px ${G.FieldText};
            }
            :host([disabled]) .checked-indicator {
                background: ${G.GrayText};
            }
            :host([disabled]) .switch {
                background: ${G.Field};
                border-color: ${G.GrayText};
            }
        `),new B(c`
                .checked-indicator {
                    left: 5px;
                    right: calc(((${C} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    left: calc(((${C} / 2) + 1) * 1px);
                    right: 5px;
                }
            `,c`
                .checked-indicator {
                    right: 5px;
                    left: calc(((${C} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    right: calc(((${C} / 2) + 1) * 1px);
                    left: 5px;
                }
            `)),switch:'\n        <span class="checked-indicator" part="checked-indicator"></span>\n    '});F().withPrefix("site").register(M({}));
