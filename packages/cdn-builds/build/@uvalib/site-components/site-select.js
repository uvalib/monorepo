import { F as FoundationElement, O as Observable, _ as __decorate, o as observable, a as attr, h as html, D as DOM, y as nullableNumberConverter, z as volatile, c as css, g as fillColor, m as strokeWidth, B as neutralStrokeRest, f as controlCornerRadius, e as designUnit, x as focusStrokeOuter, w as focusStrokeWidth, C as disabledOpacity, E as neutralFillInputRest, G as accentFillRest, n as neutralForegroundRest, u as bodyFont, t as typeRampBaseFontSize, v as typeRampBaseLineHeight, I as neutralFillInputHover, J as accentFillHover, K as focusStrokeInner, L as accentFillFocus, M as foregroundOnAccentFocus, N as neutralFillStealthRest, P as neutralFillInputActive, Q as accentFillActive, R as neutralFillStealthHover, T as neutralFillStealthActive, U as foregroundOnAccentRest, V as foregroundOnAccentHover, W as foregroundOnAccentActive, X as neutralLayerFloating, Y as heightNumberAsToken, p as provideFASTDesignSystem, s as styleMap } from '../../SiteStyleMapping-b3f47ce3.js';
import { d as disabledCursor, h as heightNumber } from '../../size-694374d3.js';
import { A as ARIAGlobalStatesAndProperties } from '../../aria-global-42249961.js';
import { a as applyMixins, S as StartEnd, s as startSlotTemplate, e as endSlotTemplate, r as ref } from '../../apply-mixins-fa470210.js';
import { n as isHTMLElement, o as keySpace, i as keyEscape, l as keyEnter, p as keyTab, k as keyEnd, h as keyArrowUp, g as keyArrowDown, a as keyHome, s as slotted, m as focusVisible } from '../../focus-7fe93afd.js';
import { u as uniqueId, i as inRange } from '../../strings-f4ffce44.js';
import { d as display } from '../../display-26e2ea35.js';
import { f as forcedColorsStylesheetBehavior, S as SystemColors } from '../../match-media-stylesheet-behavior-5f2c3a3c.js';
import { e as elevation } from '../../elevation-fb0d8a20.js';
import { F as FormAssociated } from '../../form-associated-179d4596.js';
import { w as when } from '../../when-189f5ef4.js';

/**
 * Returns the index of the last element in the array where predicate is true, and -1 otherwise.
 *
 * @param array - the array to test
 * @param predicate - find calls predicate once for each element of the array, in descending order, until it finds one where predicate returns true. If such an element is found, findLastIndex immediately returns that element index. Otherwise, findIndex returns -1.
 */
function findLastIndex(array, predicate) {
    let k = array.length;
    while (k--) {
        if (predicate(array[k], k, array)) {
            return k;
        }
    }
    return -1;
}

/**
 * Determines if the element is a {@link (ListboxOption:class)}
 *
 * @param element - the element to test.
 * @public
 */
function isListboxOption(el) {
    return (isHTMLElement(el) &&
        (el.getAttribute("role") === "option" ||
            el instanceof HTMLOptionElement));
}
/**
 * An Option Custom HTML Element.
 * Implements {@link https://www.w3.org/TR/wai-aria-1.1/#option | ARIA option }.
 *
 * @slot start - Content which can be provided before the listbox option content
 * @slot end - Content which can be provided after the listbox option content
 * @slot - The default slot for listbox option content
 * @csspart content - Wraps the listbox option content
 *
 * @public
 */
class ListboxOption extends FoundationElement {
    constructor(text, value, defaultSelected, selected) {
        super();
        /**
         * The defaultSelected state of the option.
         * @public
         */
        this.defaultSelected = false;
        /**
         * Tracks whether the "selected" property has been changed.
         * @internal
         */
        this.dirtySelected = false;
        /**
         * The checked state of the control.
         *
         * @public
         */
        this.selected = this.defaultSelected;
        /**
         * Track whether the value has been changed from the initial value
         */
        this.dirtyValue = false;
        if (text) {
            this.textContent = text;
        }
        if (value) {
            this.initialValue = value;
        }
        if (defaultSelected) {
            this.defaultSelected = defaultSelected;
        }
        if (selected) {
            this.selected = selected;
        }
        this.proxy = new Option(`${this.textContent}`, this.initialValue, this.defaultSelected, this.selected);
        this.proxy.disabled = this.disabled;
    }
    /**
     * Updates the ariaChecked property when the checked property changes.
     *
     * @param prev - the previous checked value
     * @param next - the current checked value
     *
     * @public
     */
    checkedChanged(prev, next) {
        if (typeof next === "boolean") {
            this.ariaChecked = next ? "true" : "false";
            return;
        }
        this.ariaChecked = null;
    }
    /**
     * Updates the proxy's text content when the default slot changes.
     * @param prev - the previous content value
     * @param next - the current content value
     *
     * @internal
     */
    contentChanged(prev, next) {
        if (this.proxy instanceof HTMLOptionElement) {
            this.proxy.textContent = this.textContent;
        }
        this.$emit("contentchange", null, { bubbles: true });
    }
    defaultSelectedChanged() {
        if (!this.dirtySelected) {
            this.selected = this.defaultSelected;
            if (this.proxy instanceof HTMLOptionElement) {
                this.proxy.selected = this.defaultSelected;
            }
        }
    }
    disabledChanged(prev, next) {
        this.ariaDisabled = this.disabled ? "true" : "false";
        if (this.proxy instanceof HTMLOptionElement) {
            this.proxy.disabled = this.disabled;
        }
    }
    selectedAttributeChanged() {
        this.defaultSelected = this.selectedAttribute;
        if (this.proxy instanceof HTMLOptionElement) {
            this.proxy.defaultSelected = this.defaultSelected;
        }
    }
    selectedChanged() {
        this.ariaSelected = this.selected ? "true" : "false";
        if (!this.dirtySelected) {
            this.dirtySelected = true;
        }
        if (this.proxy instanceof HTMLOptionElement) {
            this.proxy.selected = this.selected;
        }
    }
    initialValueChanged(previous, next) {
        // If the value is clean and the component is connected to the DOM
        // then set value equal to the attribute value.
        if (!this.dirtyValue) {
            this.value = this.initialValue;
            this.dirtyValue = false;
        }
    }
    get label() {
        var _a;
        return (_a = this.value) !== null && _a !== void 0 ? _a : this.text;
    }
    get text() {
        var _a, _b;
        return (_b = (_a = this.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\s+/g, " ").trim()) !== null && _b !== void 0 ? _b : "";
    }
    set value(next) {
        const newValue = `${next !== null && next !== void 0 ? next : ""}`;
        this._value = newValue;
        this.dirtyValue = true;
        if (this.proxy instanceof HTMLOptionElement) {
            this.proxy.value = newValue;
        }
        Observable.notify(this, "value");
    }
    get value() {
        var _a;
        Observable.track(this, "value");
        return (_a = this._value) !== null && _a !== void 0 ? _a : this.text;
    }
    get form() {
        return this.proxy ? this.proxy.form : null;
    }
}
__decorate([
    observable
], ListboxOption.prototype, "checked", void 0);
__decorate([
    observable
], ListboxOption.prototype, "content", void 0);
__decorate([
    observable
], ListboxOption.prototype, "defaultSelected", void 0);
__decorate([
    attr({ mode: "boolean" })
], ListboxOption.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: "selected", mode: "boolean" })
], ListboxOption.prototype, "selectedAttribute", void 0);
__decorate([
    observable
], ListboxOption.prototype, "selected", void 0);
__decorate([
    attr({ attribute: "value", mode: "fromView" })
], ListboxOption.prototype, "initialValue", void 0);
/**
 * States and properties relating to the ARIA `option` role.
 *
 * @public
 */
class DelegatesARIAListboxOption {
}
__decorate([
    observable
], DelegatesARIAListboxOption.prototype, "ariaChecked", void 0);
__decorate([
    observable
], DelegatesARIAListboxOption.prototype, "ariaPosInSet", void 0);
__decorate([
    observable
], DelegatesARIAListboxOption.prototype, "ariaSelected", void 0);
__decorate([
    observable
], DelegatesARIAListboxOption.prototype, "ariaSetSize", void 0);
applyMixins(DelegatesARIAListboxOption, ARIAGlobalStatesAndProperties);
applyMixins(ListboxOption, StartEnd, DelegatesARIAListboxOption);

/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#listbox | ARIA listbox }.
 *
 * @slot - The default slot for the listbox options
 *
 * @public
 */
class Listbox extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * The internal unfiltered list of selectable options.
         *
         * @internal
         */
        this._options = [];
        /**
         * The index of the selected option.
         *
         * @public
         */
        this.selectedIndex = -1;
        /**
         * A collection of the selected options.
         *
         * @public
         */
        this.selectedOptions = [];
        /**
         * A standard `click` event creates a `focus` event before firing, so a
         * `mousedown` event is used to skip that initial focus.
         *
         * @internal
         */
        this.shouldSkipFocus = false;
        /**
         * The current typeahead buffer string.
         *
         * @internal
         */
        this.typeaheadBuffer = "";
        /**
         * Flag for the typeahead timeout expiration.
         *
         * @internal
         */
        this.typeaheadExpired = true;
        /**
         * The timeout ID for the typeahead handler.
         *
         * @internal
         */
        this.typeaheadTimeout = -1;
    }
    /**
     * The first selected option.
     *
     * @internal
     */
    get firstSelectedOption() {
        var _a;
        return (_a = this.selectedOptions[0]) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Returns true if there is one or more selectable option.
     *
     * @internal
     */
    get hasSelectableOptions() {
        return this.options.length > 0 && !this.options.every(o => o.disabled);
    }
    /**
     * The number of options.
     *
     * @public
     */
    get length() {
        var _a, _b;
        return (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    }
    /**
     * The list of options.
     *
     * @public
     */
    get options() {
        Observable.track(this, "options");
        return this._options;
    }
    set options(value) {
        this._options = value;
        Observable.notify(this, "options");
    }
    /**
     * Flag for the typeahead timeout expiration.
     *
     * @deprecated use `Listbox.typeaheadExpired`
     * @internal
     */
    get typeAheadExpired() {
        return this.typeaheadExpired;
    }
    set typeAheadExpired(value) {
        this.typeaheadExpired = value;
    }
    /**
     * Handle click events for listbox options.
     *
     * @internal
     */
    clickHandler(e) {
        const captured = e.target.closest(`option,[role=option]`);
        if (captured && !captured.disabled) {
            this.selectedIndex = this.options.indexOf(captured);
            return true;
        }
    }
    /**
     * Ensures that the provided option is focused and scrolled into view.
     *
     * @param optionToFocus - The option to focus
     * @internal
     */
    focusAndScrollOptionIntoView(optionToFocus = this.firstSelectedOption) {
        // To ensure that the browser handles both `focus()` and `scrollIntoView()`, the
        // timing here needs to guarantee that they happen on different frames. Since this
        // function is typically called from the `openChanged` observer, `DOM.queueUpdate`
        // causes the calls to be grouped into the same frame. To prevent this,
        // `requestAnimationFrame` is used instead of `DOM.queueUpdate`.
        if (this.contains(document.activeElement) && optionToFocus !== null) {
            optionToFocus.focus();
            requestAnimationFrame(() => {
                optionToFocus.scrollIntoView({ block: "nearest" });
            });
        }
    }
    /**
     * Handles `focusin` actions for the component. When the component receives focus,
     * the list of selected options is refreshed and the first selected option is scrolled
     * into view.
     *
     * @internal
     */
    focusinHandler(e) {
        if (!this.shouldSkipFocus && e.target === e.currentTarget) {
            this.setSelectedOptions();
            this.focusAndScrollOptionIntoView();
        }
        this.shouldSkipFocus = false;
    }
    /**
     * Returns the options which match the current typeahead buffer.
     *
     * @internal
     */
    getTypeaheadMatches() {
        const pattern = this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`^${pattern}`, "gi");
        return this.options.filter((o) => o.text.trim().match(re));
    }
    /**
     * Determines the index of the next option which is selectable, if any.
     *
     * @param prev - the previous selected index
     * @param next - the next index to select
     *
     * @internal
     */
    getSelectableIndex(prev = this.selectedIndex, next) {
        const direction = prev > next ? -1 : prev < next ? 1 : 0;
        const potentialDirection = prev + direction;
        let nextSelectableOption = null;
        switch (direction) {
            case -1: {
                nextSelectableOption = this.options.reduceRight((nextSelectableOption, thisOption, index) => !nextSelectableOption &&
                    !thisOption.disabled &&
                    index < potentialDirection
                    ? thisOption
                    : nextSelectableOption, nextSelectableOption);
                break;
            }
            case 1: {
                nextSelectableOption = this.options.reduce((nextSelectableOption, thisOption, index) => !nextSelectableOption &&
                    !thisOption.disabled &&
                    index > potentialDirection
                    ? thisOption
                    : nextSelectableOption, nextSelectableOption);
                break;
            }
        }
        return this.options.indexOf(nextSelectableOption);
    }
    /**
     * Handles external changes to child options.
     *
     * @param source - the source object
     * @param propertyName - the property
     *
     * @internal
     */
    handleChange(source, propertyName) {
        switch (propertyName) {
            case "selected": {
                if (Listbox.slottedOptionFilter(source)) {
                    this.selectedIndex = this.options.indexOf(source);
                }
                this.setSelectedOptions();
                break;
            }
        }
    }
    /**
     * Moves focus to an option whose label matches characters typed by the user.
     * Consecutive keystrokes are batched into a buffer of search text used
     * to match against the set of options.  If `TYPE_AHEAD_TIMEOUT_MS` passes
     * between consecutive keystrokes, the search restarts.
     *
     * @param key - the key to be evaluated
     *
     * @internal
     */
    handleTypeAhead(key) {
        if (this.typeaheadTimeout) {
            window.clearTimeout(this.typeaheadTimeout);
        }
        this.typeaheadTimeout = window.setTimeout(() => (this.typeaheadExpired = true), Listbox.TYPE_AHEAD_TIMEOUT_MS);
        if (key.length > 1) {
            return;
        }
        this.typeaheadBuffer = `${this.typeaheadExpired ? "" : this.typeaheadBuffer}${key}`;
    }
    /**
     * Handles `keydown` actions for listbox navigation and typeahead.
     *
     * @internal
     */
    keydownHandler(e) {
        if (this.disabled) {
            return true;
        }
        this.shouldSkipFocus = false;
        const key = e.key;
        switch (key) {
            // Select the first available option
            case keyHome: {
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.selectFirstOption();
                }
                break;
            }
            // Select the next selectable option
            case keyArrowDown: {
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.selectNextOption();
                }
                break;
            }
            // Select the previous selectable option
            case keyArrowUp: {
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.selectPreviousOption();
                }
                break;
            }
            // Select the last available option
            case keyEnd: {
                e.preventDefault();
                this.selectLastOption();
                break;
            }
            case keyTab: {
                this.focusAndScrollOptionIntoView();
                return true;
            }
            case keyEnter:
            case keyEscape: {
                return true;
            }
            case keySpace: {
                if (this.typeaheadExpired) {
                    return true;
                }
            }
            // Send key to Typeahead handler
            default: {
                if (key.length === 1) {
                    this.handleTypeAhead(`${key}`);
                }
                return true;
            }
        }
    }
    /**
     * Prevents `focusin` events from firing before `click` events when the
     * element is unfocused.
     *
     * @internal
     */
    mousedownHandler(e) {
        this.shouldSkipFocus = !this.contains(document.activeElement);
        return true;
    }
    /**
     * Switches between single-selection and multi-selection mode.
     *
     * @param prev - the previous value of the `multiple` attribute
     * @param next - the next value of the `multiple` attribute
     *
     * @internal
     */
    multipleChanged(prev, next) {
        this.ariaMultiSelectable = next ? "true" : null;
    }
    /**
     * Updates the list of selected options when the `selectedIndex` changes.
     *
     * @param prev - the previous selected index value
     * @param next - the current selected index value
     *
     * @internal
     */
    selectedIndexChanged(prev, next) {
        var _a;
        if (!this.hasSelectableOptions) {
            this.selectedIndex = -1;
            return;
        }
        if (((_a = this.options[this.selectedIndex]) === null || _a === void 0 ? void 0 : _a.disabled) && typeof prev === "number") {
            const selectableIndex = this.getSelectableIndex(prev, next);
            const newNext = selectableIndex > -1 ? selectableIndex : prev;
            this.selectedIndex = newNext;
            if (next === newNext) {
                this.selectedIndexChanged(next, newNext);
            }
            return;
        }
        this.setSelectedOptions();
    }
    /**
     * Updates the selectedness of each option when the list of selected options changes.
     *
     * @param prev - the previous list of selected options
     * @param next - the current list of selected options
     *
     * @internal
     */
    selectedOptionsChanged(prev, next) {
        var _a;
        const filteredNext = next.filter(Listbox.slottedOptionFilter);
        (_a = this.options) === null || _a === void 0 ? void 0 : _a.forEach(o => {
            const notifier = Observable.getNotifier(o);
            notifier.unsubscribe(this, "selected");
            o.selected = filteredNext.includes(o);
            notifier.subscribe(this, "selected");
        });
    }
    /**
     * Moves focus to the first selectable option.
     *
     * @public
     */
    selectFirstOption() {
        var _a, _b;
        if (!this.disabled) {
            this.selectedIndex = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.findIndex(o => !o.disabled)) !== null && _b !== void 0 ? _b : -1;
        }
    }
    /**
     * Moves focus to the last selectable option.
     *
     * @internal
     */
    selectLastOption() {
        if (!this.disabled) {
            this.selectedIndex = findLastIndex(this.options, o => !o.disabled);
        }
    }
    /**
     * Moves focus to the next selectable option.
     *
     * @internal
     */
    selectNextOption() {
        if (!this.disabled && this.selectedIndex < this.options.length - 1) {
            this.selectedIndex += 1;
        }
    }
    /**
     * Moves focus to the previous selectable option.
     *
     * @internal
     */
    selectPreviousOption() {
        if (!this.disabled && this.selectedIndex > 0) {
            this.selectedIndex = this.selectedIndex - 1;
        }
    }
    /**
     * Updates the selected index to match the first selected option.
     *
     * @internal
     */
    setDefaultSelectedOption() {
        var _a, _b;
        this.selectedIndex = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.findIndex(el => el.defaultSelected)) !== null && _b !== void 0 ? _b : -1;
    }
    /**
     * Sets an option as selected and gives it focus.
     *
     * @public
     */
    setSelectedOptions() {
        var _a, _b, _c;
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.length) {
            this.selectedOptions = [this.options[this.selectedIndex]];
            this.ariaActiveDescendant = (_c = (_b = this.firstSelectedOption) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : "";
            this.focusAndScrollOptionIntoView();
        }
    }
    /**
     * Updates the list of options and resets the selected option when the slotted option content changes.
     *
     * @param prev - the previous list of slotted options
     * @param next - the current list of slotted options
     *
     * @internal
     */
    slottedOptionsChanged(prev, next) {
        this.options = next.reduce((options, item) => {
            if (isListboxOption(item)) {
                options.push(item);
            }
            return options;
        }, []);
        const setSize = `${this.options.length}`;
        this.options.forEach((option, index) => {
            if (!option.id) {
                option.id = uniqueId("option-");
            }
            option.ariaPosInSet = `${index + 1}`;
            option.ariaSetSize = setSize;
        });
        if (this.$fastController.isConnected) {
            this.setSelectedOptions();
            this.setDefaultSelectedOption();
        }
    }
    /**
     * Updates the filtered list of options when the typeahead buffer changes.
     *
     * @param prev - the previous typeahead buffer value
     * @param next - the current typeahead buffer value
     *
     * @internal
     */
    typeaheadBufferChanged(prev, next) {
        if (this.$fastController.isConnected) {
            const typeaheadMatches = this.getTypeaheadMatches();
            if (typeaheadMatches.length) {
                const selectedIndex = this.options.indexOf(typeaheadMatches[0]);
                if (selectedIndex > -1) {
                    this.selectedIndex = selectedIndex;
                }
            }
            this.typeaheadExpired = false;
        }
    }
}
/**
 * A static filter to include only selectable options.
 *
 * @param n - element to filter
 * @public
 */
Listbox.slottedOptionFilter = (n) => isListboxOption(n) && !n.hidden;
/**
 * Typeahead timeout in milliseconds.
 *
 * @internal
 */
Listbox.TYPE_AHEAD_TIMEOUT_MS = 1000;
__decorate([
    attr({ mode: "boolean" })
], Listbox.prototype, "disabled", void 0);
__decorate([
    observable
], Listbox.prototype, "selectedIndex", void 0);
__decorate([
    observable
], Listbox.prototype, "selectedOptions", void 0);
__decorate([
    observable
], Listbox.prototype, "slottedOptions", void 0);
__decorate([
    observable
], Listbox.prototype, "typeaheadBuffer", void 0);
/**
 * Includes ARIA states and properties relating to the ARIA listbox role
 *
 * @public
 */
class DelegatesARIAListbox {
}
__decorate([
    observable
], DelegatesARIAListbox.prototype, "ariaActiveDescendant", void 0);
__decorate([
    observable
], DelegatesARIAListbox.prototype, "ariaDisabled", void 0);
__decorate([
    observable
], DelegatesARIAListbox.prototype, "ariaExpanded", void 0);
__decorate([
    observable
], DelegatesARIAListbox.prototype, "ariaMultiSelectable", void 0);
applyMixins(DelegatesARIAListbox, ARIAGlobalStatesAndProperties);
applyMixins(Listbox, DelegatesARIAListbox);

/**
 * Positioning directions for the listbox when a select is open.
 * @public
 */
const SelectPosition = {
    above: "above",
    below: "below",
};

/**
 * The template for the {@link @microsoft/fast-foundation#(ListboxOption:class)} component.
 * @public
 */
const listboxOptionTemplate = (context, definition) => html `
    <template
        aria-checked="${x => x.ariaChecked}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-posinset="${x => x.ariaPosInSet}"
        aria-selected="${x => x.ariaSelected}"
        aria-setsize="${x => x.ariaSetSize}"
        class="${x => [x.checked && "checked", x.selected && "selected", x.disabled && "disabled"]
    .filter(Boolean)
    .join(" ")}"
        role="option"
    >
        ${startSlotTemplate(context, definition)}
        <span class="content" part="content">
            <slot ${slotted("content")}></slot>
        </span>
        ${endSlotTemplate(context, definition)}
    </template>
`;

/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#listbox | ARIA listbox }.
 *
 * @public
 */
class ListboxElement extends Listbox {
    constructor() {
        super(...arguments);
        /**
         * The index of the most recently checked option.
         *
         * @internal
         * @remarks
         * Multiple-selection mode only.
         */
        this.activeIndex = -1;
        /**
         * The start index when checking a range of options.
         *
         * @internal
         */
        this.rangeStartIndex = -1;
    }
    /**
     * Returns the last checked option.
     *
     * @internal
     */
    get activeOption() {
        return this.options[this.activeIndex];
    }
    /**
     * Returns the list of checked options.
     *
     * @internal
     */
    get checkedOptions() {
        var _a;
        return (_a = this.options) === null || _a === void 0 ? void 0 : _a.filter(o => o.checked);
    }
    /**
     * Returns the index of the first selected option.
     *
     * @internal
     */
    get firstSelectedOptionIndex() {
        return this.options.indexOf(this.firstSelectedOption);
    }
    /**
     * Updates the `ariaActiveDescendant` property when the active index changes.
     *
     * @param prev - the previous active index
     * @param next - the next active index
     *
     * @internal
     */
    activeIndexChanged(prev, next) {
        var _a, _b;
        this.ariaActiveDescendant = (_b = (_a = this.options[next]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
        this.focusAndScrollOptionIntoView();
    }
    /**
     * Toggles the checked state for the currently active option.
     *
     * @remarks
     * Multiple-selection mode only.
     *
     * @internal
     */
    checkActiveIndex() {
        if (!this.multiple) {
            return;
        }
        const activeItem = this.activeOption;
        if (activeItem) {
            activeItem.checked = true;
        }
    }
    /**
     * Sets the active index to the first option and marks it as checked.
     *
     * @remarks
     * Multi-selection mode only.
     *
     * @param preserveChecked - mark all options unchecked before changing the active index
     *
     * @internal
     */
    checkFirstOption(preserveChecked = false) {
        if (preserveChecked) {
            if (this.rangeStartIndex === -1) {
                this.rangeStartIndex = this.activeIndex + 1;
            }
            this.options.forEach((o, i) => {
                o.checked = inRange(i, this.rangeStartIndex);
            });
        }
        else {
            this.uncheckAllOptions();
        }
        this.activeIndex = 0;
        this.checkActiveIndex();
    }
    /**
     * Decrements the active index and sets the matching option as checked.
     *
     * @remarks
     * Multi-selection mode only.
     *
     * @param preserveChecked - mark all options unchecked before changing the active index
     *
     * @internal
     */
    checkLastOption(preserveChecked = false) {
        if (preserveChecked) {
            if (this.rangeStartIndex === -1) {
                this.rangeStartIndex = this.activeIndex;
            }
            this.options.forEach((o, i) => {
                o.checked = inRange(i, this.rangeStartIndex, this.options.length);
            });
        }
        else {
            this.uncheckAllOptions();
        }
        this.activeIndex = this.options.length - 1;
        this.checkActiveIndex();
    }
    /**
     * @override
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("focusout", this.focusoutHandler);
    }
    /**
     * @override
     * @internal
     */
    disconnectedCallback() {
        this.removeEventListener("focusout", this.focusoutHandler);
        super.disconnectedCallback();
    }
    /**
     * Increments the active index and marks the matching option as checked.
     *
     * @remarks
     * Multiple-selection mode only.
     *
     * @param preserveChecked - mark all options unchecked before changing the active index
     *
     * @internal
     */
    checkNextOption(preserveChecked = false) {
        if (preserveChecked) {
            if (this.rangeStartIndex === -1) {
                this.rangeStartIndex = this.activeIndex;
            }
            this.options.forEach((o, i) => {
                o.checked = inRange(i, this.rangeStartIndex, this.activeIndex + 1);
            });
        }
        else {
            this.uncheckAllOptions();
        }
        this.activeIndex += this.activeIndex < this.options.length - 1 ? 1 : 0;
        this.checkActiveIndex();
    }
    /**
     * Decrements the active index and marks the matching option as checked.
     *
     * @remarks
     * Multiple-selection mode only.
     *
     * @param preserveChecked - mark all options unchecked before changing the active index
     *
     * @internal
     */
    checkPreviousOption(preserveChecked = false) {
        if (preserveChecked) {
            if (this.rangeStartIndex === -1) {
                this.rangeStartIndex = this.activeIndex;
            }
            if (this.checkedOptions.length === 1) {
                this.rangeStartIndex += 1;
            }
            this.options.forEach((o, i) => {
                o.checked = inRange(i, this.activeIndex, this.rangeStartIndex);
            });
        }
        else {
            this.uncheckAllOptions();
        }
        this.activeIndex -= this.activeIndex > 0 ? 1 : 0;
        this.checkActiveIndex();
    }
    /**
     * Handles click events for listbox options.
     *
     * @param e - the event object
     *
     * @override
     * @internal
     */
    clickHandler(e) {
        var _a;
        if (!this.multiple) {
            return super.clickHandler(e);
        }
        const captured = (_a = e.target) === null || _a === void 0 ? void 0 : _a.closest(`[role=option]`);
        if (!captured || captured.disabled) {
            return;
        }
        this.uncheckAllOptions();
        this.activeIndex = this.options.indexOf(captured);
        this.checkActiveIndex();
        this.toggleSelectedForAllCheckedOptions();
        return true;
    }
    /**
     * @override
     * @internal
     */
    focusAndScrollOptionIntoView() {
        super.focusAndScrollOptionIntoView(this.activeOption);
    }
    /**
     * In multiple-selection mode:
     * If any options are selected, the first selected option is checked when
     * the listbox receives focus. If no options are selected, the first
     * selectable option is checked.
     *
     * @override
     * @internal
     */
    focusinHandler(e) {
        if (!this.multiple) {
            return super.focusinHandler(e);
        }
        if (!this.shouldSkipFocus && e.target === e.currentTarget) {
            this.uncheckAllOptions();
            if (this.activeIndex === -1) {
                this.activeIndex =
                    this.firstSelectedOptionIndex !== -1
                        ? this.firstSelectedOptionIndex
                        : 0;
            }
            this.checkActiveIndex();
            this.setSelectedOptions();
            this.focusAndScrollOptionIntoView();
        }
        this.shouldSkipFocus = false;
    }
    /**
     * Unchecks all options when the listbox loses focus.
     *
     * @internal
     */
    focusoutHandler(e) {
        if (this.multiple) {
            this.uncheckAllOptions();
        }
    }
    /**
     * Handles keydown actions for listbox navigation and typeahead
     *
     * @override
     * @internal
     */
    keydownHandler(e) {
        if (!this.multiple) {
            return super.keydownHandler(e);
        }
        if (this.disabled) {
            return true;
        }
        const { key, shiftKey } = e;
        this.shouldSkipFocus = false;
        switch (key) {
            // Select the first available option
            case keyHome: {
                this.checkFirstOption(shiftKey);
                return;
            }
            // Select the next selectable option
            case keyArrowDown: {
                this.checkNextOption(shiftKey);
                return;
            }
            // Select the previous selectable option
            case keyArrowUp: {
                this.checkPreviousOption(shiftKey);
                return;
            }
            // Select the last available option
            case keyEnd: {
                this.checkLastOption(shiftKey);
                return;
            }
            case keyTab: {
                this.focusAndScrollOptionIntoView();
                return true;
            }
            case keyEscape: {
                this.uncheckAllOptions();
                this.checkActiveIndex();
                return true;
            }
            case keySpace: {
                e.preventDefault();
                if (this.typeAheadExpired) {
                    this.toggleSelectedForAllCheckedOptions();
                    return;
                }
            }
            // Send key to Typeahead handler
            default: {
                if (key.length === 1) {
                    this.handleTypeAhead(`${key}`);
                }
                return true;
            }
        }
    }
    /**
     * Prevents `focusin` events from firing before `click` events when the
     * element is unfocused.
     *
     * @override
     * @internal
     */
    mousedownHandler(e) {
        if (e.offsetX >= 0 && e.offsetX <= this.scrollWidth) {
            return super.mousedownHandler(e);
        }
    }
    /**
     * Switches between single-selection and multi-selection mode.
     *
     * @internal
     */
    multipleChanged(prev, next) {
        var _a;
        this.ariaMultiSelectable = next ? "true" : null;
        (_a = this.options) === null || _a === void 0 ? void 0 : _a.forEach(o => {
            o.checked = next ? false : undefined;
        });
        this.setSelectedOptions();
    }
    /**
     * Sets an option as selected and gives it focus.
     *
     * @override
     * @public
     */
    setSelectedOptions() {
        if (!this.multiple) {
            super.setSelectedOptions();
            return;
        }
        if (this.$fastController.isConnected && this.options) {
            this.selectedOptions = this.options.filter(o => o.selected);
            this.focusAndScrollOptionIntoView();
        }
    }
    /**
     * Ensures the size is a positive integer when the property is updated.
     *
     * @param prev - the previous size value
     * @param next - the current size value
     *
     * @internal
     */
    sizeChanged(prev, next) {
        var _a;
        const size = Math.max(0, parseInt((_a = next === null || next === void 0 ? void 0 : next.toFixed()) !== null && _a !== void 0 ? _a : "", 10));
        if (size !== next) {
            DOM.queueUpdate(() => {
                this.size = size;
            });
        }
    }
    /**
     * Toggles the selected state of the provided options. If any provided items
     * are in an unselected state, all items are set to selected. If every
     * provided item is selected, they are all unselected.
     *
     * @internal
     */
    toggleSelectedForAllCheckedOptions() {
        const enabledCheckedOptions = this.checkedOptions.filter(o => !o.disabled);
        const force = !enabledCheckedOptions.every(o => o.selected);
        enabledCheckedOptions.forEach(o => (o.selected = force));
        this.selectedIndex = this.options.indexOf(enabledCheckedOptions[enabledCheckedOptions.length - 1]);
        this.setSelectedOptions();
    }
    /**
     * @override
     * @internal
     */
    typeaheadBufferChanged(prev, next) {
        if (!this.multiple) {
            super.typeaheadBufferChanged(prev, next);
            return;
        }
        if (this.$fastController.isConnected) {
            const typeaheadMatches = this.getTypeaheadMatches();
            const activeIndex = this.options.indexOf(typeaheadMatches[0]);
            if (activeIndex > -1) {
                this.activeIndex = activeIndex;
                this.uncheckAllOptions();
                this.checkActiveIndex();
            }
            this.typeAheadExpired = false;
        }
    }
    /**
     * Unchecks all options.
     *
     * @remarks
     * Multiple-selection mode only.
     *
     * @param preserveChecked - reset the rangeStartIndex
     *
     * @internal
     */
    uncheckAllOptions(preserveChecked = false) {
        this.options.forEach(o => (o.checked = this.multiple ? false : undefined));
        if (!preserveChecked) {
            this.rangeStartIndex = -1;
        }
    }
}
__decorate([
    observable
], ListboxElement.prototype, "activeIndex", void 0);
__decorate([
    attr({ mode: "boolean" })
], ListboxElement.prototype, "multiple", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], ListboxElement.prototype, "size", void 0);

class _Select extends ListboxElement {
}
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Select:class)} component.
 *
 * @internal
 */
class FormAssociatedSelect extends FormAssociated(_Select) {
    constructor() {
        super(...arguments);
        this.proxy = document.createElement("select");
    }
}

/**
 * A Select Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#select | ARIA select }.
 *
 * @slot start - Content which can be provided before the button content
 * @slot end - Content which can be provided after the button content
 * @slot button-container - The element representing the select button
 * @slot selected-value - The selected value
 * @slot indicator - The visual indicator for the expand/collapse state of the button
 * @slot - The default slot for slotted options
 * @csspart control - The element representing the select invoking element
 * @csspart selected-value - The element wrapping the selected value
 * @csspart indicator - The element wrapping the visual indicator
 * @csspart listbox - The listbox element
 * @fires input - Fires a custom 'input' event when the value updates
 * @fires change - Fires a custom 'change' event when the value updates
 *
 * @public
 */
let Select$1 = class Select extends FormAssociatedSelect {
    constructor() {
        super(...arguments);
        /**
         * The open attribute.
         *
         * @public
         * @remarks
         * HTML Attribute: open
         */
        this.open = false;
        /**
         * Indicates the initial state of the position attribute.
         *
         * @internal
         */
        this.forcedPosition = false;
        /**
         * The unique id for the internal listbox element.
         *
         * @internal
         */
        this.listboxId = uniqueId("listbox-");
        /**
         * The max height for the listbox when opened.
         *
         * @internal
         */
        this.maxHeight = 0;
    }
    /**
     * Sets focus and synchronizes ARIA attributes when the open property changes.
     *
     * @param prev - the previous open value
     * @param next - the current open value
     *
     * @internal
     */
    openChanged(prev, next) {
        if (!this.collapsible) {
            return;
        }
        if (this.open) {
            this.ariaControls = this.listboxId;
            this.ariaExpanded = "true";
            this.setPositioning();
            this.focusAndScrollOptionIntoView();
            this.indexWhenOpened = this.selectedIndex;
            // focus is directed to the element when `open` is changed programmatically
            DOM.queueUpdate(() => this.focus());
            return;
        }
        this.ariaControls = "";
        this.ariaExpanded = "false";
    }
    /**
     * The component is collapsible when in single-selection mode with no size attribute.
     *
     * @internal
     */
    get collapsible() {
        return !(this.multiple || typeof this.size === "number");
    }
    /**
     * The value property.
     *
     * @public
     */
    get value() {
        Observable.track(this, "value");
        return this._value;
    }
    set value(next) {
        var _a, _b, _c, _d, _e, _f, _g;
        const prev = `${this._value}`;
        if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.length) {
            const selectedIndex = this._options.findIndex(el => el.value === next);
            const prevSelectedValue = (_c = (_b = this._options[this.selectedIndex]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : null;
            const nextSelectedValue = (_e = (_d = this._options[selectedIndex]) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : null;
            if (selectedIndex === -1 || prevSelectedValue !== nextSelectedValue) {
                next = "";
                this.selectedIndex = selectedIndex;
            }
            next = (_g = (_f = this.firstSelectedOption) === null || _f === void 0 ? void 0 : _f.value) !== null && _g !== void 0 ? _g : next;
        }
        if (prev !== next) {
            this._value = next;
            super.valueChanged(prev, next);
            Observable.notify(this, "value");
            this.updateDisplayValue();
        }
    }
    /**
     * Sets the value and display value to match the first selected option.
     *
     * @param shouldEmit - if true, the input and change events will be emitted
     *
     * @internal
     */
    updateValue(shouldEmit) {
        var _a, _b;
        if (this.$fastController.isConnected) {
            this.value = (_b = (_a = this.firstSelectedOption) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
        }
        if (shouldEmit) {
            this.$emit("input");
            this.$emit("change", this, {
                bubbles: true,
                composed: undefined,
            });
        }
    }
    /**
     * Updates the proxy value when the selected index changes.
     *
     * @param prev - the previous selected index
     * @param next - the next selected index
     *
     * @internal
     */
    selectedIndexChanged(prev, next) {
        super.selectedIndexChanged(prev, next);
        this.updateValue();
    }
    positionChanged(prev, next) {
        this.positionAttribute = next;
        this.setPositioning();
    }
    /**
     * Calculate and apply listbox positioning based on available viewport space.
     *
     * @public
     */
    setPositioning() {
        const currentBox = this.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const availableBottom = viewportHeight - currentBox.bottom;
        this.position = this.forcedPosition
            ? this.positionAttribute
            : currentBox.top > availableBottom
                ? SelectPosition.above
                : SelectPosition.below;
        this.positionAttribute = this.forcedPosition
            ? this.positionAttribute
            : this.position;
        this.maxHeight =
            this.position === SelectPosition.above ? ~~currentBox.top : ~~availableBottom;
    }
    /**
     * The value displayed on the button.
     *
     * @public
     */
    get displayValue() {
        var _a, _b;
        Observable.track(this, "displayValue");
        return (_b = (_a = this.firstSelectedOption) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
    }
    /**
     * Synchronize the `aria-disabled` property when the `disabled` property changes.
     *
     * @param prev - The previous disabled value
     * @param next - The next disabled value
     *
     * @internal
     */
    disabledChanged(prev, next) {
        if (super.disabledChanged) {
            super.disabledChanged(prev, next);
        }
        this.ariaDisabled = this.disabled ? "true" : "false";
    }
    /**
     * Reset the element to its first selectable option when its parent form is reset.
     *
     * @internal
     */
    formResetCallback() {
        this.setProxyOptions();
        // Call the base class's implementation setDefaultSelectedOption instead of the select's
        // override, in order to reset the selectedIndex without using the value property.
        super.setDefaultSelectedOption();
        if (this.selectedIndex === -1) {
            this.selectedIndex = 0;
        }
    }
    /**
     * Handle opening and closing the listbox when the select is clicked.
     *
     * @param e - the mouse event
     * @internal
     */
    clickHandler(e) {
        // do nothing if the select is disabled
        if (this.disabled) {
            return;
        }
        if (this.open) {
            const captured = e.target.closest(`option,[role=option]`);
            if (captured && captured.disabled) {
                return;
            }
        }
        super.clickHandler(e);
        this.open = this.collapsible && !this.open;
        if (!this.open && this.indexWhenOpened !== this.selectedIndex) {
            this.updateValue(true);
        }
        return true;
    }
    /**
     * Handles focus state when the element or its children lose focus.
     *
     * @param e - The focus event
     * @internal
     */
    focusoutHandler(e) {
        var _a;
        super.focusoutHandler(e);
        if (!this.open) {
            return true;
        }
        const focusTarget = e.relatedTarget;
        if (this.isSameNode(focusTarget)) {
            this.focus();
            return;
        }
        if (!((_a = this.options) === null || _a === void 0 ? void 0 : _a.includes(focusTarget))) {
            this.open = false;
            if (this.indexWhenOpened !== this.selectedIndex) {
                this.updateValue(true);
            }
        }
    }
    /**
     * Updates the value when an option's value changes.
     *
     * @param source - the source object
     * @param propertyName - the property to evaluate
     *
     * @internal
     * @override
     */
    handleChange(source, propertyName) {
        super.handleChange(source, propertyName);
        if (propertyName === "value") {
            this.updateValue();
        }
    }
    /**
     * Synchronize the form-associated proxy and updates the value property of the element.
     *
     * @param prev - the previous collection of slotted option elements
     * @param next - the next collection of slotted option elements
     *
     * @internal
     */
    slottedOptionsChanged(prev, next) {
        this.options.forEach(o => {
            const notifier = Observable.getNotifier(o);
            notifier.unsubscribe(this, "value");
        });
        super.slottedOptionsChanged(prev, next);
        this.options.forEach(o => {
            const notifier = Observable.getNotifier(o);
            notifier.subscribe(this, "value");
        });
        this.setProxyOptions();
        this.updateValue();
    }
    /**
     * Prevents focus when size is set and a scrollbar is clicked.
     *
     * @param e - the mouse event object
     *
     * @override
     * @internal
     */
    mousedownHandler(e) {
        var _a;
        if (e.offsetX >= 0 && e.offsetX <= ((_a = this.listbox) === null || _a === void 0 ? void 0 : _a.scrollWidth)) {
            return super.mousedownHandler(e);
        }
        return this.collapsible;
    }
    /**
     * Sets the multiple property on the proxy element.
     *
     * @param prev - the previous multiple value
     * @param next - the current multiple value
     */
    multipleChanged(prev, next) {
        super.multipleChanged(prev, next);
        if (this.proxy) {
            this.proxy.multiple = next;
        }
    }
    /**
     * Updates the selectedness of each option when the list of selected options changes.
     *
     * @param prev - the previous list of selected options
     * @param next - the current list of selected options
     *
     * @override
     * @internal
     */
    selectedOptionsChanged(prev, next) {
        var _a;
        super.selectedOptionsChanged(prev, next);
        (_a = this.options) === null || _a === void 0 ? void 0 : _a.forEach((o, i) => {
            var _a;
            const proxyOption = (_a = this.proxy) === null || _a === void 0 ? void 0 : _a.options.item(i);
            if (proxyOption) {
                proxyOption.selected = o.selected;
            }
        });
    }
    /**
     * Sets the selected index to match the first option with the selected attribute, or
     * the first selectable option.
     *
     * @override
     * @internal
     */
    setDefaultSelectedOption() {
        var _a;
        const options = (_a = this.options) !== null && _a !== void 0 ? _a : Array.from(this.children).filter(Listbox.slottedOptionFilter);
        const selectedIndex = options === null || options === void 0 ? void 0 : options.findIndex(el => el.hasAttribute("selected") || el.selected || el.value === this.value);
        if (selectedIndex !== -1) {
            this.selectedIndex = selectedIndex;
            return;
        }
        this.selectedIndex = 0;
    }
    /**
     * Resets and fills the proxy to match the component's options.
     *
     * @internal
     */
    setProxyOptions() {
        if (this.proxy instanceof HTMLSelectElement && this.options) {
            this.proxy.options.length = 0;
            this.options.forEach(option => {
                const proxyOption = option.proxy ||
                    (option instanceof HTMLOptionElement ? option.cloneNode() : null);
                if (proxyOption) {
                    this.proxy.options.add(proxyOption);
                }
            });
        }
    }
    /**
     * Handle keyboard interaction for the select.
     *
     * @param e - the keyboard event
     * @internal
     */
    keydownHandler(e) {
        super.keydownHandler(e);
        const key = e.key || e.key.charCodeAt(0);
        switch (key) {
            case keySpace: {
                e.preventDefault();
                if (this.collapsible && this.typeAheadExpired) {
                    this.open = !this.open;
                }
                break;
            }
            case keyHome:
            case keyEnd: {
                e.preventDefault();
                break;
            }
            case keyEnter: {
                e.preventDefault();
                this.open = !this.open;
                break;
            }
            case keyEscape: {
                if (this.collapsible && this.open) {
                    e.preventDefault();
                    this.open = false;
                }
                break;
            }
            case keyTab: {
                if (this.collapsible && this.open) {
                    e.preventDefault();
                    this.open = false;
                }
                return true;
            }
        }
        if (!this.open && this.indexWhenOpened !== this.selectedIndex) {
            this.updateValue(true);
            this.indexWhenOpened = this.selectedIndex;
        }
        return !(key === keyArrowDown || key === keyArrowUp);
    }
    connectedCallback() {
        super.connectedCallback();
        this.forcedPosition = !!this.positionAttribute;
        this.addEventListener("contentchange", this.updateDisplayValue);
    }
    disconnectedCallback() {
        this.removeEventListener("contentchange", this.updateDisplayValue);
        super.disconnectedCallback();
    }
    /**
     * Updates the proxy's size property when the size attribute changes.
     *
     * @param prev - the previous size
     * @param next - the current size
     *
     * @override
     * @internal
     */
    sizeChanged(prev, next) {
        super.sizeChanged(prev, next);
        if (this.proxy) {
            this.proxy.size = next;
        }
    }
    /**
     *
     * @internal
     */
    updateDisplayValue() {
        if (this.collapsible) {
            Observable.notify(this, "displayValue");
        }
    }
};
__decorate([
    attr({ attribute: "open", mode: "boolean" })
], Select$1.prototype, "open", void 0);
__decorate([
    volatile
], Select$1.prototype, "collapsible", null);
__decorate([
    observable
], Select$1.prototype, "control", void 0);
__decorate([
    attr({ attribute: "position" })
], Select$1.prototype, "positionAttribute", void 0);
__decorate([
    observable
], Select$1.prototype, "position", void 0);
__decorate([
    observable
], Select$1.prototype, "maxHeight", void 0);
/**
 * Includes ARIA states and properties relating to the ARIA select role.
 *
 * @public
 */
class DelegatesARIASelect {
}
__decorate([
    observable
], DelegatesARIASelect.prototype, "ariaControls", void 0);
applyMixins(DelegatesARIASelect, DelegatesARIAListbox);
applyMixins(Select$1, StartEnd, DelegatesARIASelect);

/**
 * The template for the {@link @microsoft/fast-foundation#(Select:class)} component.
 * @public
 */
const selectTemplate = (context, definition) => html `
    <template
        class="${x => [
    x.collapsible && "collapsible",
    x.collapsible && x.open && "open",
    x.disabled && "disabled",
    x.collapsible && x.position,
]
    .filter(Boolean)
    .join(" ")}"
        aria-activedescendant="${x => x.ariaActiveDescendant}"
        aria-controls="${x => x.ariaControls}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-expanded="${x => x.ariaExpanded}"
        aria-haspopup="${x => (x.collapsible ? "listbox" : null)}"
        aria-multiselectable="${x => x.ariaMultiSelectable}"
        ?open="${x => x.open}"
        role="combobox"
        tabindex="${x => (!x.disabled ? "0" : null)}"
        @click="${(x, c) => x.clickHandler(c.event)}"
        @focusin="${(x, c) => x.focusinHandler(c.event)}"
        @focusout="${(x, c) => x.focusoutHandler(c.event)}"
        @keydown="${(x, c) => x.keydownHandler(c.event)}"
        @mousedown="${(x, c) => x.mousedownHandler(c.event)}"
    >
        ${when(x => x.collapsible, html `
                <div
                    class="control"
                    part="control"
                    ?disabled="${x => x.disabled}"
                    ${ref("control")}
                >
                    ${startSlotTemplate(context, definition)}
                    <slot name="button-container">
                        <div class="selected-value" part="selected-value">
                            <slot name="selected-value">${x => x.displayValue}</slot>
                        </div>
                        <div aria-hidden="true" class="indicator" part="indicator">
                            <slot name="indicator">
                                ${definition.indicator || ""}
                            </slot>
                        </div>
                    </slot>
                    ${endSlotTemplate(context, definition)}
                </div>
            `)}
        <div
            class="listbox"
            id="${x => x.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${x => x.disabled}"
            ?hidden="${x => (x.collapsible ? !x.open : false)}"
            ${ref("listbox")}
        >
            <slot
                ${slotted({
    filter: Listbox.slottedOptionFilter,
    flatten: true,
    property: "slottedOptions",
})}
            ></slot>
        </div>
    </template>
`;

/**
 * Styles for Listbox
 * @public
 */
const listboxStyles = (context, definition) => {
    const ListboxOptionTag = context.tagFor(ListboxOption);
    const hostContext = context.name === context.tagFor(ListboxElement) ? "" : ".listbox";
    // The expression interpolations present in this block cause Prettier to generate
    // various formatting bugs.
    // prettier-ignore
    return css `
        ${!hostContext ? display("inline-flex") : ""}

        :host ${hostContext} {
            background: ${fillColor};
            border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            box-sizing: border-box;
            flex-direction: column;
            padding: calc(${designUnit} * 1px) 0;
        }

        ${!hostContext ? css `
            :host(:focus-within:not([disabled])) {
                border-color: ${focusStrokeOuter};
                box-shadow: 0 0 0
                    calc((${focusStrokeWidth} - ${strokeWidth}) * 1px)
                    ${focusStrokeOuter} inset;
            }

            :host([disabled]) ::slotted(*) {
                cursor: ${disabledCursor};
                opacity: ${disabledOpacity};
                pointer-events: none;
            }
        ` : ``}

        ${hostContext || `:host([size])`} {
            max-height: calc(
                (var(--size) * ${heightNumber} + (${designUnit} * ${strokeWidth} * 2)) * 1px
            );
            overflow-y: auto;
        }

        :host([size="0"]) ${hostContext} {
            max-height: none;
        }
    `.withBehaviors(forcedColorsStylesheetBehavior(css `
                :host(:not([multiple]):${focusVisible}) ::slotted(${ListboxOptionTag}[aria-selected="true"]),
                :host([multiple]:${focusVisible}) ::slotted(${ListboxOptionTag}[aria-checked="true"]) {
                    border-color: ${SystemColors.ButtonText};
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${SystemColors.HighlightText};
                }

                :host(:not([multiple]):${focusVisible}) ::slotted(${ListboxOptionTag}[aria-selected="true"]) {
                    background: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                    fill: currentcolor;
                }

                ::slotted(${ListboxOptionTag}[aria-selected="true"]:not([aria-checked="true"])) {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.HighlightText};
                    color: ${SystemColors.HighlightText};
                }
            `));
};

/**
 * Styles for Select.
 *
 * @public
 */
const selectStyles = (context, definition) => {
    const selectContext = context.name === context.tagFor(Select$1);
    // The expression interpolations present in this block cause Prettier to generate
    // various formatting bugs.
    // prettier-ignore
    return css `
        ${display("inline-flex")}

        :host {
            --elevation: 14;
            background: ${neutralFillInputRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${strokeWidth} * 1px) solid ${accentFillRest};
            box-sizing: border-box;
            color: ${neutralForegroundRest};
            font-family: ${bodyFont};
            height: calc(${heightNumber} * 1px);
            position: relative;
            user-select: none;
            min-width: 250px;
            outline: none;
            vertical-align: top;
        }

        ${selectContext ? css `
            :host(:not([aria-haspopup])) {
                --elevation: 0;
                border: 0;
                height: auto;
                min-width: 0;
            }
        ` : ""}

        ${listboxStyles(context)}

        :host .listbox {
            ${elevation}
            border: none;
            display: flex;
            left: 0;
            position: absolute;
            width: 100%;
            z-index: 1;
        }

        .control + .listbox {
            --stroke-size: calc(${designUnit} * ${strokeWidth} * 2);
            max-height: calc(
                (var(--listbox-max-height) * ${heightNumber} + var(--stroke-size)) * 1px
            );
        }

        ${selectContext ? css `
            :host(:not([aria-haspopup])) .listbox {
                left: auto;
                position: static;
                z-index: auto;
            }
        ` : ""}

        .listbox[hidden] {
            display: none;
        }

        .control {
            align-items: center;
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
            font-size: ${typeRampBaseFontSize};
            font-family: inherit;
            line-height: ${typeRampBaseLineHeight};
            min-height: 100%;
            padding: 0 calc(${designUnit} * 2.25px);
            width: 100%;
        }

        :host(:not([disabled]):hover) {
            background: ${neutralFillInputHover};
            border-color: ${accentFillHover};
        }

        :host(:${focusVisible}) {
            border-color: ${focusStrokeOuter};
        }

        :host(:not([size]):not([multiple]):not([open]):${focusVisible}),
        :host([multiple]:${focusVisible}),
        :host([size]:${focusVisible}) {
            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter};
        }

        :host(:not([multiple]):not([size]):${focusVisible}) ::slotted(${context.tagFor(ListboxOption)}[aria-selected="true"]:not([disabled])) {
            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${focusStrokeInner};
            border-color: ${focusStrokeOuter};
            background: ${accentFillFocus};
            color: ${foregroundOnAccentFocus};
        }

        :host([disabled]) {
            cursor: ${disabledCursor};
            opacity: ${disabledOpacity};
        }

        :host([disabled]) .control {
            cursor: ${disabledCursor};
            user-select: none;
        }

        :host([disabled]:hover) {
            background: ${neutralFillStealthRest};
            color: ${neutralForegroundRest};
            fill: currentcolor;
        }

        :host(:not([disabled])) .control:active {
            background: ${neutralFillInputActive};
            border-color: ${accentFillActive};
            border-radius: calc(${controlCornerRadius} * 1px);
        }

        :host([open][position="above"]) .listbox {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom: 0;
            bottom: calc(${heightNumber} * 1px);
        }

        :host([open][position="below"]) .listbox {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-top: 0;
            top: calc(${heightNumber} * 1px);
        }

        .selected-value {
            flex: 1 1 auto;
            font-family: inherit;
            min-width: calc(var(--listbox-scroll-width, 0) - (${designUnit} * 4) * 1px);
            overflow: hidden;
            text-align: start;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .indicator {
            flex: 0 0 auto;
            margin-inline-start: 1em;
        }

        slot[name="listbox"] {
            display: none;
            width: 100%;
        }

        :host([open]) slot[name="listbox"] {
            display: flex;
            position: absolute;
            ${elevation}
        }

        .end {
            margin-inline-start: auto;
        }

        .start,
        .end,
        .indicator,
        .select-indicator,
        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            fill: currentcolor;
            height: 1em;
            min-height: calc(${designUnit} * 4px);
            min-width: calc(${designUnit} * 4px);
            width: 1em;
        }

        ::slotted([role="option"]),
        ::slotted(option) {
            flex: 0 0 auto;
        }
    `.withBehaviors(forcedColorsStylesheetBehavior(css `
                :host(:not([disabled]):hover),
                :host(:not([disabled]):active) {
                    border-color: ${SystemColors.Highlight};
                }

                :host(:not([disabled]):${focusVisible}) {
                    background-color: ${SystemColors.ButtonFace};
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.Highlight};
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                    forced-color-adjust: none;
                }

                :host(:not([disabled]):${focusVisible}) .listbox {
                    background: ${SystemColors.ButtonFace};
                }

                :host([disabled]) {
                    border-color: ${SystemColors.GrayText};
                    background-color: ${SystemColors.ButtonFace};
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                    forced-color-adjust: none;
                }

                :host([disabled]:hover) {
                    background: ${SystemColors.ButtonFace};
                }

                :host([disabled]) .control {
                    color: ${SystemColors.GrayText};
                    border-color: ${SystemColors.GrayText};
                }

                :host([disabled]) .control .select-indicator {
                    fill: ${SystemColors.GrayText};
                }

                :host(:${focusVisible}) ::slotted([aria-selected="true"][role="option"]),
                :host(:${focusVisible}) ::slotted(option[aria-selected="true"]),
                :host(:${focusVisible}) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.ButtonText};
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${SystemColors.HighlightText};
                    color: ${SystemColors.HighlightText};
                    fill: currentcolor;
                }

                .start,
                .end,
                .indicator,
                .select-indicator,
                ::slotted(svg) {
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                }
            `));
};

/**
 * Styles for the {@link @microsoft/fast-components#fastOption | Listbox Option} component.
 *
 * @param context - the element definition context
 * @param definition - the foundation element definition
 * @returns The element styles for the listbox option component
 *
 * @public
 */
const optionStyles = (context, definition) => css `
        ${display("inline-flex")} :host {
            align-items: center;
            font-family: ${bodyFont};
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${focusStrokeWidth} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${neutralFillStealthRest};
            color: ${neutralForegroundRest};
            cursor: pointer;
            flex: 0 0 auto;
            fill: currentcolor;
            font-size: ${typeRampBaseFontSize};
            height: calc(${heightNumber} * 1px);
            line-height: ${typeRampBaseLineHeight};
            margin: 0 calc((${designUnit} - ${focusStrokeWidth}) * 1px);
            outline: none;
            overflow: hidden;
            padding: 0 1ch;
            user-select: none;
            white-space: nowrap;
        }

        :host(:not([disabled]):not([aria-selected="true"]):hover) {
            background: ${neutralFillStealthHover};
        }

        :host(:not([disabled]):not([aria-selected="true"]):active) {
            background: ${neutralFillStealthActive};
        }

        :host([aria-selected="true"]) {
            background: ${accentFillRest};
            color: ${foregroundOnAccentRest};
        }

        :host(:not([disabled])[aria-selected="true"]:hover) {
            background: ${accentFillHover};
            color: ${foregroundOnAccentHover};
        }

        :host(:not([disabled])[aria-selected="true"]:active) {
            background: ${accentFillActive};
            color: ${foregroundOnAccentActive};
        }

        :host([disabled]) {
            cursor: ${disabledCursor};
            opacity: ${disabledOpacity};
        }

        .content {
            grid-column-start: 2;
            justify-self: start;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .start,
        .end,
        ::slotted(svg) {
            display: flex;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            height: calc(${designUnit} * 4px);
            width: calc(${designUnit} * 4px);
        }

        ::slotted([slot="end"]) {
            margin-inline-start: 1ch;
        }

        ::slotted([slot="start"]) {
            margin-inline-end: 1ch;
        }

        :host([aria-checked="true"][aria-selected="false"]) {
            border-color: ${focusStrokeOuter};
        }

        :host([aria-checked="true"][aria-selected="true"]) {
            border-color: ${focusStrokeOuter};
            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 2 * 1px) inset
                ${focusStrokeInner};
        }
    `.withBehaviors(forcedColorsStylesheetBehavior(css `
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                }

                :host([disabled]),
                :host([disabled][aria-selected="false"]:hover) {
                    background: ${SystemColors.Canvas};
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }

                :host([aria-checked="true"][aria-selected="false"]) {
                    background: ${SystemColors.ButtonFace};
                    color: ${SystemColors.ButtonText};
                    border-color: ${SystemColors.ButtonText};
                }

                :host([aria-checked="true"][aria-selected="true"]),
                :host([aria-checked="true"][aria-selected="true"]:hover) {
                    background: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                    border-color: ${SystemColors.ButtonText};
                }
            `));

/**
 * A function that returns a {@link @microsoft/fast-foundation#ListboxOption} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#listboxOptionTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-option>`
 *
 */
const fastOption = ListboxOption.compose({
    baseName: "option",
    template: listboxOptionTemplate,
    styles: optionStyles,
});

/**
 * Base class for Select.
 * @public
 */
class Select extends Select$1 {
    constructor() {
        super(...arguments);
        /**
         * The cached scroll width of the listbox when visible.
         *
         * @internal
         */
        this.listboxScrollWidth = "";
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (this.listbox) {
            fillColor.setValueFor(this.listbox, neutralLayerFloating);
        }
    }
    /**
     * Returns the calculated max height for the listbox.
     *
     * @internal
     * @remarks
     * Used to generate the `--listbox-max-height` CSS custom property.
     *
     */
    get listboxMaxHeight() {
        return Math.floor(this.maxHeight / heightNumberAsToken.getValueFor(this)).toString();
    }
    /**
     * @internal
     */
    listboxScrollWidthChanged() {
        this.updateComputedStylesheet();
    }
    /**
     * Returns the size value, if any. Otherwise, returns 4 if in
     * multi-selection mode, or 0 if in single-selection mode.
     *
     * @internal
     * @remarks
     * Used to generate the `--size` CSS custom property.
     *
     */
    get selectSize() {
        var _a;
        return `${(_a = this.size) !== null && _a !== void 0 ? _a : (this.multiple ? 4 : 0)}`;
    }
    /**
     * Updates the computed stylesheet when the multiple property changes.
     *
     * @param prev - the previous multiple value
     * @param next - the current multiple value
     *
     * @override
     * @internal
     */
    multipleChanged(prev, next) {
        super.multipleChanged(prev, next);
        this.updateComputedStylesheet();
    }
    /**
     * Sets the selectMaxSize design token when the maxHeight property changes.
     *
     * @param prev - the previous maxHeight value
     * @param next - the current maxHeight value
     *
     * @internal
     */
    maxHeightChanged(prev, next) {
        if (this.collapsible) {
            this.updateComputedStylesheet();
        }
    }
    setPositioning() {
        super.setPositioning();
        this.updateComputedStylesheet();
    }
    /**
     * Updates the component dimensions when the size property is changed.
     *
     * @param prev - the previous size value
     * @param next - the current size value
     *
     * @override
     * @internal
     */
    sizeChanged(prev, next) {
        super.sizeChanged(prev, next);
        this.updateComputedStylesheet();
        if (this.collapsible) {
            requestAnimationFrame(() => {
                this.listbox.style.setProperty("display", "flex");
                this.listbox.style.setProperty("overflow", "visible");
                this.listbox.style.setProperty("visibility", "hidden");
                this.listbox.style.setProperty("width", "auto");
                this.listbox.hidden = false;
                this.listboxScrollWidth = `${this.listbox.scrollWidth}`;
                this.listbox.hidden = true;
                this.listbox.style.removeProperty("display");
                this.listbox.style.removeProperty("overflow");
                this.listbox.style.removeProperty("visibility");
                this.listbox.style.removeProperty("width");
            });
            return;
        }
        this.listboxScrollWidth = "";
    }
    /**
     * Updates an internal stylesheet with calculated CSS custom properties.
     *
     * @internal
     */
    updateComputedStylesheet() {
        if (this.computedStylesheet) {
            this.$fastController.removeStyles(this.computedStylesheet);
        }
        this.computedStylesheet = css `
            :host {
                --listbox-max-height: ${this.listboxMaxHeight};
                --listbox-scroll-width: ${this.listboxScrollWidth};
                --size: ${this.selectSize};
            }
        `;
        this.$fastController.addStyles(this.computedStylesheet);
    }
}
__decorate([
    observable
], Select.prototype, "listboxScrollWidth", void 0);
/**
 * A function that returns a {@link @microsoft/fast-foundation#Select} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#selectTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-select>`
 *
 */
const fastSelect = Select.compose({
    baseName: "select",
    baseClass: Select$1,
    template: selectTemplate,
    styles: selectStyles,
    indicator: /* html */ `
        <svg
            class="select-indicator"
            part="select-indicator"
            viewBox="0 0 12 7"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"
            />
        </svg>
    `,
});

provideFASTDesignSystem()
    .withPrefix("site")
    .register(fastSelect({
    styles: (context, definition) => css `
                ${styleMap}
                ${selectStyles(context)}
                :host .listbox {
                    background: var(--uva-grey-lightest);
                }
            `
}), fastOption({
    styles: (context, definition) => css `
                ${styleMap}
                ${optionStyles()}
            `
}));
