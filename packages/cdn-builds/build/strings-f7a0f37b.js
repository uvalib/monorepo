import { A as AttachedBehaviorHTMLDirective, h as html, a8 as AttributeConfiguration } from './SiteStyleMapping-5e16ab05.js';

/**
 * The runtime behavior for template references.
 * @public
 */
class RefBehavior {
    /**
     * Creates an instance of RefBehavior.
     * @param target - The element to reference.
     * @param propertyName - The name of the property to assign the reference to.
     */
    constructor(target, propertyName) {
        this.target = target;
        this.propertyName = propertyName;
    }
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source) {
        source[this.propertyName] = this.target;
    }
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    unbind() { }
}
/**
 * A directive that observes the updates a property with a reference to the element.
 * @param propertyName - The name of the property to assign the reference to.
 * @public
 */
function ref(propertyName) {
    return new AttachedBehaviorHTMLDirective("fast-ref", RefBehavior, propertyName);
}

/**
 * A mixin class implementing start and end elements.
 * These are generally used to decorate text elements with icons or other visual indicators.
 * @public
 */
class StartEnd {
    handleStartContentChange() {
        this.startContainer.classList.toggle("start", this.start.assignedNodes().length > 0);
    }
    handleEndContentChange() {
        this.endContainer.classList.toggle("end", this.end.assignedNodes().length > 0);
    }
}
/**
 * The template for the end element.
 * For use with {@link StartEnd}
 *
 * @public
 */
const endSlotTemplate = (context, definition) => html `
    <span
        part="end"
        ${ref("endContainer")}
        class=${x => (definition.end ? "end" : void 0)}
    >
        <slot name="end" ${ref("end")} @slotchange="${x => x.handleEndContentChange()}">
            ${definition.end || ""}
        </slot>
    </span>
`;
/**
 * The template for the start element.
 * For use with {@link StartEnd}
 *
 * @public
 */
const startSlotTemplate = (context, definition) => html `
    <span
        part="start"
        ${ref("startContainer")}
        class="${x => (definition.start ? "start" : void 0)}"
    >
        <slot
            name="start"
            ${ref("start")}
            @slotchange="${x => x.handleStartContentChange()}"
        >
            ${definition.start || ""}
        </slot>
    </span>
`;
/**
 * The template for the end element.
 * For use with {@link StartEnd}
 *
 * @public
 * @deprecated - use endSlotTemplate
 */
html `
    <span part="end" ${ref("endContainer")}>
        <slot
            name="end"
            ${ref("end")}
            @slotchange="${x => x.handleEndContentChange()}"
        ></slot>
    </span>
`;
/**
 * The template for the start element.
 * For use with {@link StartEnd}
 *
 * @public
 * @deprecated - use startSlotTemplate
 */
html `
    <span part="start" ${ref("startContainer")}>
        <slot
            name="start"
            ${ref("start")}
            @slotchange="${x => x.handleStartContentChange()}"
        ></slot>
    </span>
`;

/**
 * Apply mixins to a constructor.
 * Sourced from {@link https://www.typescriptlang.org/docs/handbook/mixins.html | TypeScript Documentation }.
 * @public
 */
function applyMixins(derivedCtor, ...baseCtors) {
    const derivedAttributes = AttributeConfiguration.locate(derivedCtor);
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== "constructor") {
                Object.defineProperty(derivedCtor.prototype, name, 
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
            }
        });
        const baseAttributes = AttributeConfiguration.locate(baseCtor);
        baseAttributes.forEach(x => derivedAttributes.push(x));
    });
}

/**
 * This method keeps a given value within the bounds of a min and max value. If the value
 * is larger than the max, the minimum value will be returned. If the value is smaller than the minimum,
 * the maximum will be returned. Otherwise, the value is returned un-changed.
 */
function wrapInBounds(min, max, value) {
    if (value < min) {
        return max;
    }
    else if (value > max) {
        return min;
    }
    return value;
}
/**
 * Determines if a number value is within a specified range.
 *
 * @param value - the value to check
 * @param min - the range start
 * @param max - the range end
 */
function inRange(value, min, max = 0) {
    [min, max] = [min, max].sort((a, b) => a - b);
    return min <= value && value < max;
}

let uniqueIdCounter = 0;
/**
 * Generates a unique ID based on incrementing a counter.
 */
function uniqueId(prefix = "") {
    return `${prefix}${uniqueIdCounter++}`;
}

export { StartEnd as S, applyMixins as a, endSlotTemplate as e, inRange as i, ref as r, startSlotTemplate as s, uniqueId as u, wrapInBounds as w };
