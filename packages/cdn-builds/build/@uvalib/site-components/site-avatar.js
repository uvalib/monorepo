import{h as a,F as t,_ as e,a as o,c as i,b as r,d as s,e as l,t as d,n as c,f as n,p}from"../../fast-design-system-d046069d.js";import{D as v}from"../../direction-00084adb.js";import{d as h}from"../../display-058af2ce.js";import{w as f}from"../../when-46682a8a.js";let m=class extends t{connectedCallback(){super.connectedCallback(),this.shape||(this.shape="circle")}};e([o],m.prototype,"fill",void 0),e([o],m.prototype,"color",void 0),e([o],m.prototype,"link",void 0),e([o],m.prototype,"shape",void 0);class $ extends t{constructor(){super(...arguments),this.generateBadgeStyle=()=>{if(!this.fill&&!this.color)return;const a=`background-color: var(--badge-fill-${this.fill});`,t=`color: var(--badge-color-${this.color});`;return this.fill&&!this.color?a:this.color&&!this.fill?t:`${t} ${a}`}}}e([o({attribute:"fill"})],$.prototype,"fill",void 0),e([o({attribute:"color"})],$.prototype,"color",void 0),e([o({mode:"boolean"})],$.prototype,"circular",void 0);class b extends m{}e([o({attribute:"src"})],b.prototype,"imgSrc",void 0),e([o],b.prototype,"alt",void 0);const u=a`
    ${f((a=>a.imgSrc),a`
            <img
                src="${a=>a.imgSrc}"
                alt="${a=>a.alt}"
                slot="media"
                class="media"
                part="media"
            />
        `)}
`,g=b.compose({baseName:"avatar",baseClass:m,template:(t,e)=>a`
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
        ${h("flex")} :host {
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

        ::slotted(${a.tagFor($)}) {
            position: absolute;
            display: block;
        }
    `.withBehaviors(new v(((a,t)=>i`
    ::slotted(${a.tagFor($)}) {
        right: 0;
    }
`)(a),((a,t)=>i`
    ::slotted(${a.tagFor($)}) {
        left: 0;
    }
`)(a))),media:u,shadowOptions:{delegatesFocus:!0}});p().withPrefix("site").register(g({}));
