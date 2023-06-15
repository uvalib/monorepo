import{h as e,F as s,_ as t,a,o as c,c as o,r as i,e as d,B as r,C as h,f as l,s as n,z as b,G as k,Y as p,N as $,Z as u,g,w as m,n as x,t as y,u as w,T as f,E as v,I as H,U as T,P as j,V as F,p as O}from"../../fast-design-system-d046069d.js";import{d as z}from"../../display-058af2ce.js";import{d as N,h as C}from"../../size-b693d30e.js";import{s as L,o as S,l as _,m as B}from"../../focus-3563f905.js";import{f as E,S as G}from"../../match-media-stylesheet-behavior-575be983.js";import{D as I}from"../../direction-00084adb.js";import{C as P}from"../../form-associated-0ae06292.js";class V extends s{}class A extends(P(V)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class D extends A{constructor(){super(),this.initialValue="on",this.keypressHandler=e=>{if(!this.readOnly)switch(e.key){case _:case S:this.checked=!this.checked}},this.clickHandler=e=>{this.disabled||this.readOnly||(this.checked=!this.checked)},this.proxy.setAttribute("type","checkbox")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly),this.readOnly?this.classList.add("readonly"):this.classList.remove("readonly")}checkedChanged(e,s){super.checkedChanged(e,s),this.checked?this.classList.add("checked"):this.classList.remove("checked")}}t([a({attribute:"readonly",mode:"boolean"})],D.prototype,"readOnly",void 0),t([c],D.prototype,"defaultSlottedNodes",void 0);const M=D.compose({baseName:"switch",template:(s,t)=>e`
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
            <slot ${L("defaultSlottedNodes")}></slot>
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
`,styles:(e,s)=>o`
        :host([hidden]) {
            display: none;
        }

        ${z("inline-flex")} :host {
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
            cursor: ${N};
        }

        .switch {
            position: relative;
            outline: none;
            box-sizing: border-box;
            width: calc(${C} * 1px);
            height: calc((${C} / 2 + ${d}) * 1px);
            background: ${h};
            border-radius: calc(${l} * 1px);
            border: calc(${n} * 1px) solid ${b};
        }

        .switch:hover {
            background: ${k};
            border-color: ${p};
            cursor: pointer;
        }

        host([disabled]) .switch:hover,
        host([readonly]) .switch:hover {
            background: ${k};
            border-color: ${p};
            cursor: ${N};
        }

        :host(:not([disabled])) .switch:active {
            background: ${$};
            border-color: ${u};
        }

        :host(:${B}) .switch {
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
            cursor: ${N};
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
            background: ${T};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active {
            background: ${j};
            border-color: ${j};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active .checked-indicator {
            background: ${F};
        }

        :host([aria-checked="true"]:${B}:not([disabled])) .switch {
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
    `.withBehaviors(E(o`
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
            :host(:${B}) .switch {
                border-color: ${G.Highlight};
                box-shadow: 0 0 0 2px ${G.Field}, 0 0 0 4px ${G.FieldText};
            }
            :host([aria-checked="true"]:${B}:not([disabled])) .switch {
                box-shadow: 0 0 0 2px ${G.Field}, 0 0 0 4px ${G.FieldText};
            }
            :host([disabled]) .checked-indicator {
                background: ${G.GrayText};
            }
            :host([disabled]) .switch {
                background: ${G.Field};
                border-color: ${G.GrayText};
            }
        `),new I(o`
                .checked-indicator {
                    left: 5px;
                    right: calc(((${C} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    left: calc(((${C} / 2) + 1) * 1px);
                    right: 5px;
                }
            `,o`
                .checked-indicator {
                    right: 5px;
                    left: calc(((${C} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    right: calc(((${C} / 2) + 1) * 1px);
                    left: 5px;
                }
            `)),switch:'\n        <span class="checked-indicator" part="checked-indicator"></span>\n    '});O().withPrefix("site").register(M({}));
