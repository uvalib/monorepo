import{h as o,F as e,_ as t,a,o as r,O as n,c as i,u as c,t as s,v as l,r as h,n as p,f as d,e as u,d as $,m as b,a3 as g,a5 as f,x,w as m,G as v,U as y,J as k,V as w,Q as T,W as C,K as L,a2 as B,a4 as H,a6 as E,N as F,R as j,T as S,C as N,p as G,s as I}from"./SiteStyleMapping-51203cca.js";import{h as M,d as R}from"./size-468cfd3b.js";import{d as z}from"./display-058af2ce.js";import{s as A,m as P}from"./focus-030c5e12.js";import{f as D,S as O}from"./match-media-stylesheet-behavior-575be983.js";import{r as U,s as V,e as q,a as K,S as _}from"./apply-mixins-fe151c16.js";import{F as J}from"./form-associated-b8833a72.js";import{A as Q}from"./aria-global-43630e0f.js";class W extends e{}class X extends(J(W)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}let Y=class extends X{constructor(){super(...arguments),this.handleClick=o=>{var e;this.disabled&&(null===(e=this.defaultSlottedContent)||void 0===e?void 0:e.length)<=1&&o.stopPropagation()},this.handleSubmission=()=>{if(!this.form)return;const o=this.proxy.isConnected;o||this.attachProxy(),"function"==typeof this.form.requestSubmit?this.form.requestSubmit(this.proxy):this.proxy.click(),o||this.detachProxy()},this.handleFormReset=()=>{var o;null===(o=this.form)||void 0===o||o.reset()},this.handleUnsupportedDelegatesFocus=()=>{var o;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(null===(o=this.$fastController.definition.shadowOptions)||void 0===o?void 0:o.delegatesFocus)&&(this.focus=()=>{this.control.focus()})}}formactionChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formAction=this.formaction)}formenctypeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formEnctype=this.formenctype)}formmethodChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formMethod=this.formmethod)}formnovalidateChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formNoValidate=this.formnovalidate)}formtargetChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formTarget=this.formtarget)}typeChanged(o,e){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type),"submit"===e&&this.addEventListener("click",this.handleSubmission),"submit"===o&&this.removeEventListener("click",this.handleSubmission),"reset"===e&&this.addEventListener("click",this.handleFormReset),"reset"===o&&this.removeEventListener("click",this.handleFormReset)}validate(){super.validate(this.control)}connectedCallback(){var o;super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.handleUnsupportedDelegatesFocus();const e=Array.from(null===(o=this.control)||void 0===o?void 0:o.children);e&&e.forEach((o=>{o.addEventListener("click",this.handleClick)}))}disconnectedCallback(){var o;super.disconnectedCallback();const e=Array.from(null===(o=this.control)||void 0===o?void 0:o.children);e&&e.forEach((o=>{o.removeEventListener("click",this.handleClick)}))}};t([a({mode:"boolean"})],Y.prototype,"autofocus",void 0),t([a({attribute:"form"})],Y.prototype,"formId",void 0),t([a],Y.prototype,"formaction",void 0),t([a],Y.prototype,"formenctype",void 0),t([a],Y.prototype,"formmethod",void 0),t([a({mode:"boolean"})],Y.prototype,"formnovalidate",void 0),t([a],Y.prototype,"formtarget",void 0),t([a],Y.prototype,"type",void 0),t([r],Y.prototype,"defaultSlottedContent",void 0);class Z{}t([a({attribute:"aria-expanded"})],Z.prototype,"ariaExpanded",void 0),t([a({attribute:"aria-pressed"})],Z.prototype,"ariaPressed",void 0),K(Z,Q),K(Y,_,Z);class oo{constructor(o,e,t){this.propertyName=o,this.value=e,this.styles=t}bind(o){n.getNotifier(o).subscribe(this,this.propertyName),this.handleChange(o,this.propertyName)}unbind(o){n.getNotifier(o).unsubscribe(this,this.propertyName),o.$fastController.removeStyles(this.styles)}handleChange(o,e){o[e]===this.value?o.$fastController.addStyles(this.styles):o.$fastController.removeStyles(this.styles)}}const eo=i`
    ${z("inline-flex")} :host {
        font-family: ${c};
        outline: none;
        font-size: ${s};
        line-height: ${l};
        height: calc(${M} * 1px);
        min-width: calc(${M} * 1px);
        background-color: ${h};
        color: ${p};
        border-radius: calc(${d} * 1px);
        fill: currentcolor;
        cursor: pointer;
    }

    .control {
        background: transparent;
        height: inherit;
        flex-grow: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: baseline;
        padding: 0 calc((10 + (${u} * 2 * ${$})) * 1px);
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        border: calc(${b} * 1px) solid transparent;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font-weight: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    :host(:hover) {
        background-color: ${g};
    }

    :host(:active) {
        background-color: ${f};
    }

    .control:${P} {
        border-color: ${x};
        box-shadow: 0 0 0 calc((${m} - ${b}) * 1px) ${x} inset;
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    .start,
    .content,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
    }

    .control.icon-only {
        padding: 0;
        line-height: 0;
    }

    ::slotted(svg) {
        ${""} width: 16px;
        height: 16px;
        pointer-events: none;
    }

    .start {
        margin-inline-end: 11px;
    }

    .end {
        margin-inline-start: 11px;
    }
`.withBehaviors(D(i`
            :host .control {
              background-color: ${O.ButtonFace};
              border-color: ${O.ButtonText};
              color: ${O.ButtonText};
              fill: currentColor;
            }

            :host(:hover) .control {
              forced-color-adjust: none;
              background-color: ${O.Highlight};
              color: ${O.HighlightText};
            }

            .control:${P} {
              forced-color-adjust: none;
              background-color: ${O.Highlight};
              border-color: ${O.ButtonText};
              box-shadow: 0 0 0 calc((${m} - ${b}) * 1px) ${O.ButtonText} inset;
              color: ${O.HighlightText};
            }

            .control:hover,
            :host([appearance="outline"]) .control:hover {
              border-color: ${O.ButtonText};
            }

            :host([href]) .control {
                border-color: ${O.LinkText};
                color: ${O.LinkText};
            }

            :host([href]) .control:hover,
            :host([href]) .control:${P}{
              forced-color-adjust: none;
              background: ${O.ButtonFace};
              border-color: ${O.LinkText};
              box-shadow: 0 0 0 1px ${O.LinkText} inset;
              color: ${O.LinkText};
              fill: currentColor;
            }
        `)),to=i`
    :host([appearance="accent"]) {
        background: ${v};
        color: ${y};
    }

    :host([appearance="accent"]:hover) {
        background: ${k};
        color: ${w};
    }

    :host([appearance="accent"]:active) .control:active {
        background: ${T};
        color: ${C};
    }

    :host([appearance="accent"]) .control:${P} {
        box-shadow: 0 0 0 calc((${m} - ${b}) * 1px) ${x} inset,
            0 0 0 calc((${m} + ${b}) * 1px) ${L} inset;
    }
`.withBehaviors(D(i`
            :host([appearance="accent"]) .control {
                forced-color-adjust: none;
                background: ${O.Highlight};
                color: ${O.HighlightText};
            }

            :host([appearance="accent"]) .control:hover,
            :host([appearance="accent"]:active) .control:active {
                background: ${O.HighlightText};
                border-color: ${O.Highlight};
                color: ${O.Highlight};
            }

            :host([appearance="accent"]) .control:${P} {
                border-color: ${O.Highlight};
                box-shadow: 0 0 0 calc(${m} * 1px) ${O.HighlightText} inset;
            }

            :host([appearance="accent"][href]) .control{
                background: ${O.LinkText};
                color: ${O.HighlightText};
            }

            :host([appearance="accent"][href]) .control:hover {
                background: ${O.ButtonFace};
                border-color: ${O.LinkText};
                box-shadow: none;
                color: ${O.LinkText};
                fill: currentColor;
            }

            :host([appearance="accent"][href]) .control:${P} {
                border-color: ${O.LinkText};
                box-shadow: 0 0 0 calc(${m} * 1px) ${O.HighlightText} inset;
            }
        `));i`
    :host([appearance="hypertext"]) {
        font-size: inherit;
        line-height: inherit;
        height: auto;
        min-width: 0;
        background: transparent;
    }

    :host([appearance="hypertext"]) .control {
        display: inline;
        padding: 0;
        border: none;
        box-shadow: none;
        border-radius: 0;
        line-height: 1;
    }

    :host a.control:not(:link) {
        background-color: transparent;
        cursor: default;
    }
    :host([appearance="hypertext"]) .control:link,
    :host([appearance="hypertext"]) .control:visited {
        background: transparent;
        color: ${B};
        border-bottom: calc(${b} * 1px) solid ${B};
    }

    :host([appearance="hypertext"]:hover),
    :host([appearance="hypertext"]) .control:hover {
        background: transparent;
        border-bottom-color: ${H};
    }

    :host([appearance="hypertext"]:active),
    :host([appearance="hypertext"]) .control:active {
        background: transparent;
        border-bottom-color: ${E};
    }

    :host([appearance="hypertext"]) .control:${P} {
        border-bottom: calc(${m} * 1px) solid ${x};
        margin-bottom: calc(calc(${b} - ${m}) * 1px);
    }
`.withBehaviors(D(i`
            :host([appearance="hypertext"]:hover) {
                background-color: ${O.ButtonFace};
                color: ${O.ButtonText};
            }
            :host([appearance="hypertext"][href]) .control:hover,
            :host([appearance="hypertext"][href]) .control:active,
            :host([appearance="hypertext"][href]) .control:${P} {
                color: ${O.LinkText};
                border-bottom-color: ${O.LinkText};
                box-shadow: none;
            }
        `));const ao=i`
    :host([appearance="lightweight"]) {
        background: transparent;
        color: ${B};
    }

    :host([appearance="lightweight"]) .control {
        padding: 0;
        height: initial;
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    :host([appearance="lightweight"]:hover) {
        background: transparent;
        color: ${H};
    }

    :host([appearance="lightweight"]:active) {
        background: transparent;
        color: ${E};
    }

    :host([appearance="lightweight"]) .content {
        position: relative;
    }

    :host([appearance="lightweight"]) .content::before {
        content: "";
        display: block;
        height: calc(${b} * 1px);
        position: absolute;
        top: calc(1em + 4px);
        width: 100%;
    }

    :host([appearance="lightweight"]:hover) .content::before {
        background: ${H};
    }

    :host([appearance="lightweight"]:active) .content::before {
        background: ${E};
    }

    :host([appearance="lightweight"]) .control:${P} .content::before {
        background: ${p};
        height: calc(${m} * 1px);
    }
`.withBehaviors(D(i`
            :host([appearance="lightweight"]) .control:hover,
            :host([appearance="lightweight"]) .control:${P} {
                forced-color-adjust: none;
                background: ${O.ButtonFace};
                color: ${O.Highlight};
            }
            :host([appearance="lightweight"]) .control:hover .content::before,
            :host([appearance="lightweight"]) .control:${P} .content::before {
                background: ${O.Highlight};
            }

            :host([appearance="lightweight"][href]) .control:hover,
            :host([appearance="lightweight"][href]) .control:${P} {
                background: ${O.ButtonFace};
                box-shadow: none;
                color: ${O.LinkText};
            }

            :host([appearance="lightweight"][href]) .control:hover .content::before,
            :host([appearance="lightweight"][href]) .control:${P} .content::before {
                background: ${O.LinkText};
            }
        `)),ro=i`
    :host([appearance="outline"]) {
        background: transparent;
        border-color: ${v};
    }

    :host([appearance="outline"]:hover) {
        border-color: ${k};
    }

    :host([appearance="outline"]:active) {
        border-color: ${T};
    }

    :host([appearance="outline"]) .control {
        border-color: inherit;
    }

    :host([appearance="outline"]) .control:${P} {
        box-shadow: 0 0 0 calc((${m} - ${b}) * 1px) ${x} inset;
        border-color: ${x};
    }
`.withBehaviors(D(i`
            :host([appearance="outline"]) .control {
                border-color: ${O.ButtonText};
            }
            :host([appearance="outline"]) .control:${P} {
              forced-color-adjust: none;
              background-color: ${O.Highlight};
              border-color: ${O.ButtonText};
              box-shadow: 0 0 0 calc((${m} - ${b}) * 1px) ${O.ButtonText} inset;
              color: ${O.HighlightText};
              fill: currentColor;
            }
            :host([appearance="outline"][href]) .control {
                background: ${O.ButtonFace};
                border-color: ${O.LinkText};
                color: ${O.LinkText};
                fill: currentColor;
            }
            :host([appearance="outline"][href]) .control:hover,
            :host([appearance="outline"][href]) .control:${P} {
              forced-color-adjust: none;
              border-color: ${O.LinkText};
              box-shadow: 0 0 0 1px ${O.LinkText} inset;
            }
        `)),no=i`
    :host([appearance="stealth"]) {
        background: ${F};
    }

    :host([appearance="stealth"]:hover) {
        background: ${j};
    }

    :host([appearance="stealth"]:active) {
        background: ${S};
    }
`.withBehaviors(D(i`
            :host([appearance="stealth"]),
            :host([appearance="stealth"]) .control {
                forced-color-adjust: none;
                background: ${O.ButtonFace};
                border-color: transparent;
                color: ${O.ButtonText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:hover) .control {
                background: ${O.Highlight};
                border-color: ${O.Highlight};
                color: ${O.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:${P}) .control {
                background: ${O.Highlight};
                box-shadow: 0 0 0 1px ${O.Highlight};
                color: ${O.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]) .control {
                color: ${O.LinkText};
            }

            :host([appearance="stealth"][href]:hover) .control,
            :host([appearance="stealth"][href]:${P}) .control {
                background: ${O.LinkText};
                border-color: ${O.LinkText};
                color: ${O.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]:${P}) .control {
                forced-color-adjust: none;
                box-shadow: 0 0 0 1px ${O.LinkText};
            }
        `));function io(o,e){return new oo("appearance",o,e)}const co=(o,e)=>i`
        :host([disabled]),
        :host([disabled]:hover),
        :host([disabled]:active) {
            opacity: ${N};
            background-color: ${h};
            cursor: ${R};
        }

        ${eo}
    `.withBehaviors(D(i`
                :host([disabled]),
                :host([disabled]) .control,
                :host([disabled]:hover),
                :host([disabled]:active) {
                    forced-color-adjust: none;
                    background-color: ${O.ButtonFace};
                    border-color: ${O.GrayText};
                    color: ${O.GrayText};
                    cursor: ${R};
                    opacity: 1;
                }
            `),io("accent",i`
                :host([appearance="accent"][disabled]),
                :host([appearance="accent"][disabled]:hover),
                :host([appearance="accent"][disabled]:active) {
                    background: ${v};
                }

                ${to}
            `.withBehaviors(D(i`
                        :host([appearance="accent"][disabled]) .control,
                        :host([appearance="accent"][disabled]) .control:hover {
                            background: ${O.ButtonFace};
                            border-color: ${O.GrayText};
                            color: ${O.GrayText};
                        }
                    `))),io("lightweight",i`
                :host([appearance="lightweight"][disabled]:hover),
                :host([appearance="lightweight"][disabled]:active) {
                    background-color: transparent;
                    color: ${B};
                }

                :host([appearance="lightweight"][disabled]) .content::before,
                :host([appearance="lightweight"][disabled]:hover) .content::before,
                :host([appearance="lightweight"][disabled]:active) .content::before {
                    background: transparent;
                }

                ${ao}
            `.withBehaviors(D(i`
                        :host([appearance="lightweight"].disabled) .control {
                            forced-color-adjust: none;
                            color: ${O.GrayText};
                        }

                        :host([appearance="lightweight"].disabled)
                            .control:hover
                            .content::before {
                            background: none;
                        }
                    `))),io("outline",i`
                :host([appearance="outline"][disabled]),
                :host([appearance="outline"][disabled]:hover),
                :host([appearance="outline"][disabled]:active) {
                    background: transparent;
                    border-color: ${v};
                }

                ${ro}
            `.withBehaviors(D(i`
                        :host([appearance="outline"][disabled]) .control {
                            border-color: ${O.GrayText};
                        }
                    `))),io("stealth",i`
                :host([appearance="stealth"][disabled]),
                :host([appearance="stealth"][disabled]:hover),
                :host([appearance="stealth"][disabled]:active) {
                    background: ${F};
                }

                ${no}
            `.withBehaviors(D(i`
                        :host([appearance="stealth"][disabled]) {
                            background: ${O.ButtonFace};
                        }

                        :host([appearance="stealth"][disabled]) .control {
                            background: ${O.ButtonFace};
                            border-color: transparent;
                            color: ${O.GrayText};
                        }
                    `))));class so extends Y{constructor(){super(...arguments),this.appearance="neutral"}defaultSlottedContentChanged(o,e){const t=this.defaultSlottedContent.filter((o=>o.nodeType===Node.ELEMENT_NODE));1===t.length&&t[0]instanceof SVGElement?this.control.classList.add("icon-only"):this.control.classList.remove("icon-only")}}t([a],so.prototype,"appearance",void 0);const lo=so.compose({baseName:"button",baseClass:Y,template:(e,t)=>o`
    <button
        class="control"
        part="control"
        ?autofocus="${o=>o.autofocus}"
        ?disabled="${o=>o.disabled}"
        form="${o=>o.formId}"
        formaction="${o=>o.formaction}"
        formenctype="${o=>o.formenctype}"
        formmethod="${o=>o.formmethod}"
        formnovalidate="${o=>o.formnovalidate}"
        formtarget="${o=>o.formtarget}"
        name="${o=>o.name}"
        type="${o=>o.type}"
        value="${o=>o.value}"
        aria-atomic="${o=>o.ariaAtomic}"
        aria-busy="${o=>o.ariaBusy}"
        aria-controls="${o=>o.ariaControls}"
        aria-current="${o=>o.ariaCurrent}"
        aria-describedby="${o=>o.ariaDescribedby}"
        aria-details="${o=>o.ariaDetails}"
        aria-disabled="${o=>o.ariaDisabled}"
        aria-errormessage="${o=>o.ariaErrormessage}"
        aria-expanded="${o=>o.ariaExpanded}"
        aria-flowto="${o=>o.ariaFlowto}"
        aria-haspopup="${o=>o.ariaHaspopup}"
        aria-hidden="${o=>o.ariaHidden}"
        aria-invalid="${o=>o.ariaInvalid}"
        aria-keyshortcuts="${o=>o.ariaKeyshortcuts}"
        aria-label="${o=>o.ariaLabel}"
        aria-labelledby="${o=>o.ariaLabelledby}"
        aria-live="${o=>o.ariaLive}"
        aria-owns="${o=>o.ariaOwns}"
        aria-pressed="${o=>o.ariaPressed}"
        aria-relevant="${o=>o.ariaRelevant}"
        aria-roledescription="${o=>o.ariaRoledescription}"
        ${U("control")}
    >
        ${V(e,t)}
        <span class="content" part="content">
            <slot ${A("defaultSlottedContent")}></slot>
        </span>
        ${q(e,t)}
    </button>
`,styles:co,shadowOptions:{delegatesFocus:!0}});G().withPrefix("site").register(lo({styles:(o,e)=>i`
                ${I}
                ${co()}
                :host {
                    --neutral-foreground-rest: var(--uva-white, white) !important;
                }
                .content {
                    text-transform: uppercase !important;
                }
            `}));
