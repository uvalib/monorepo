import{_ as a}from"../../tslib.es6-6ae91544.js";import{h as t,F as e,a as o,c as i,b as r,d as s,e as l,t as d,n as c,f as n,p}from"../../fast-design-system-b703147e.js";import{D as v}from"../../direction-88bcdd2b.js";import{d as m}from"../../display-058af2ce.js";import{w as h}from"../../when-46682a8a.js";let f=class extends e{connectedCallback(){super.connectedCallback(),this.shape||(this.shape="circle")}};a([o],f.prototype,"fill",void 0),a([o],f.prototype,"color",void 0),a([o],f.prototype,"link",void 0),a([o],f.prototype,"shape",void 0);class b extends e{constructor(){super(...arguments),this.generateBadgeStyle=()=>{if(!this.fill&&!this.color)return;const a=`background-color: var(--badge-fill-${this.fill});`,t=`color: var(--badge-color-${this.color});`;return this.fill&&!this.color?a:this.color&&!this.fill?t:`${t} ${a}`}}}a([o({attribute:"fill"})],b.prototype,"fill",void 0),a([o({attribute:"color"})],b.prototype,"color",void 0),a([o({mode:"boolean"})],b.prototype,"circular",void 0);class $ extends f{}a([o({attribute:"src"})],$.prototype,"imgSrc",void 0),a([o],$.prototype,"alt",void 0);const g=t`
    ${h((a=>a.imgSrc),t`
            <img
                src="${a=>a.imgSrc}"
                alt="${a=>a.alt}"
                slot="media"
                class="media"
                part="media"
            />
        `)}
`,u=$.compose({baseName:"avatar",baseClass:f,template:(a,e)=>t`
    <div
        class="backplate ${a=>a.shape}"
        part="backplate"
        style="${a=>a.fill?`background-color: var(--avatar-fill-${a.fill});`:void 0}"
    >
        <a
            class="link"
            part="link"
            href="${a=>a.link?a.link:void 0}"
            style="${a=>a.color?`color: var(--avatar-color-${a.color});`:void 0}"
        >
            <slot name="media" part="media">${e.media||""}</slot>
            <slot class="content" part="content"><slot>
        </a>
    </div>
    <slot name="badge" part="badge"></slot>
`,styles:(a,t)=>i`
        ${m("flex")} :host {
            position: relative;
            height: var(--avatar-size, var(--avatar-size-default));
            max-width: var(--avatar-size, var(--avatar-size-default));
            --avatar-size-default: calc(
                (
                        (${r} + ${s}) * ${l} +
                            ((${l} * 8) - 40)
                    ) * 1px
            );
            --avatar-text-size: ${d};
            --avatar-text-ratio: ${l};
        }

        .link {
            text-decoration: none;
            color: ${c};
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            min-width: 100%;
        }

        .square {
            border-radius: calc(${n} * 1px);
            min-width: 100%;
            overflow: hidden;
        }

        .circle {
            border-radius: 100%;
            min-width: 100%;
            overflow: hidden;
        }

        .backplate {
            position: relative;
            display: flex;
        }

        .media,
        ::slotted(img) {
            max-width: 100%;
            position: absolute;
            display: block;
        }

        .content {
            font-size: calc(
                (var(--avatar-text-size) + var(--avatar-size, var(--avatar-size-default))) /
                    var(--avatar-text-ratio)
            );
            line-height: var(--avatar-size, var(--avatar-size-default));
            display: block;
            min-height: var(--avatar-size, var(--avatar-size-default));
        }

        ::slotted(${a.tagFor(b)}) {
            position: absolute;
            display: block;
        }
    `.withBehaviors(new v(((a,t)=>i`
    ::slotted(${a.tagFor(b)}) {
        right: 0;
    }
`)(a),((a,t)=>i`
    ::slotted(${a.tagFor(b)}) {
        left: 0;
    }
`)(a))),media:g,shadowOptions:{delegatesFocus:!0}});p().withPrefix("site").register(u({}));
