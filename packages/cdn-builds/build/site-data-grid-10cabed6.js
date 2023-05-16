import { k as emptyArray, O as Observable, S as SubscriberSet, D as DOM, H as HTMLDirective, l as HTMLView, A as AttachedBehaviorHTMLDirective, F as FoundationElement, _ as __decorate, a as attr, o as observable, h as html, c as css, m as strokeWidth, q as neutralStrokeDividerRest, r as neutralFillRest, e as designUnit, n as neutralForegroundRest, u as bodyFont, t as typeRampBaseFontSize, v as typeRampBaseLineHeight, w as focusStrokeWidth, f as controlCornerRadius, x as focusStrokeOuter, p as provideFASTDesignSystem, s as styleMap } from './SiteStyleMapping-b3f47ce3.js';
import { N as NodeObservationBehavior, k as keyEnd, a as keyHome, b as keyArrowRight, c as keyArrowLeft, e as elements, d as keyPageDown, f as keyPageUp, g as keyArrowDown, h as keyArrowUp, i as keyEscape, j as keyFunction2, l as keyEnter, s as slotted, m as focusVisible } from './focus-7fe93afd.js';
import { f as forcedColorsStylesheetBehavior, S as SystemColors } from './match-media-stylesheet-behavior-5f2c3a3c.js';

/** @internal */
function newSplice(index, removed, addedCount) {
    return {
        index: index,
        removed: removed,
        addedCount: addedCount,
    };
}
const EDIT_LEAVE = 0;
const EDIT_UPDATE = 1;
const EDIT_ADD = 2;
const EDIT_DELETE = 3;
// Note: This function is *based* on the computation of the Levenshtein
// "edit" distance. The one change is that "updates" are treated as two
// edits - not one. With Array splices, an update is really a delete
// followed by an add. By retaining this, we optimize for "keeping" the
// maximum array items in the original array. For example:
//
//   'xxxx123' -> '123yyyy'
//
// With 1-edit updates, the shortest path would be just to update all seven
// characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
// leaves the substring '123' intact.
function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
    // "Deletion" columns
    const rowCount = oldEnd - oldStart + 1;
    const columnCount = currentEnd - currentStart + 1;
    const distances = new Array(rowCount);
    let north;
    let west;
    // "Addition" rows. Initialize null column.
    for (let i = 0; i < rowCount; ++i) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
    }
    // Initialize null row
    for (let j = 0; j < columnCount; ++j) {
        distances[0][j] = j;
    }
    for (let i = 1; i < rowCount; ++i) {
        for (let j = 1; j < columnCount; ++j) {
            if (current[currentStart + j - 1] === old[oldStart + i - 1]) {
                distances[i][j] = distances[i - 1][j - 1];
            }
            else {
                north = distances[i - 1][j] + 1;
                west = distances[i][j - 1] + 1;
                distances[i][j] = north < west ? north : west;
            }
        }
    }
    return distances;
}
// This starts at the final weight, and walks "backward" by finding
// the minimum previous weight recursively until the origin of the weight
// matrix.
function spliceOperationsFromEditDistances(distances) {
    let i = distances.length - 1;
    let j = distances[0].length - 1;
    let current = distances[i][j];
    const edits = [];
    while (i > 0 || j > 0) {
        if (i === 0) {
            edits.push(EDIT_ADD);
            j--;
            continue;
        }
        if (j === 0) {
            edits.push(EDIT_DELETE);
            i--;
            continue;
        }
        const northWest = distances[i - 1][j - 1];
        const west = distances[i - 1][j];
        const north = distances[i][j - 1];
        let min;
        if (west < north) {
            min = west < northWest ? west : northWest;
        }
        else {
            min = north < northWest ? north : northWest;
        }
        if (min === northWest) {
            if (northWest === current) {
                edits.push(EDIT_LEAVE);
            }
            else {
                edits.push(EDIT_UPDATE);
                current = northWest;
            }
            i--;
            j--;
        }
        else if (min === west) {
            edits.push(EDIT_DELETE);
            i--;
            current = west;
        }
        else {
            edits.push(EDIT_ADD);
            j--;
            current = north;
        }
    }
    edits.reverse();
    return edits;
}
function sharedPrefix(current, old, searchLength) {
    for (let i = 0; i < searchLength; ++i) {
        if (current[i] !== old[i]) {
            return i;
        }
    }
    return searchLength;
}
function sharedSuffix(current, old, searchLength) {
    let index1 = current.length;
    let index2 = old.length;
    let count = 0;
    while (count < searchLength && current[--index1] === old[--index2]) {
        count++;
    }
    return count;
}
function intersect(start1, end1, start2, end2) {
    // Disjoint
    if (end1 < start2 || end2 < start1) {
        return -1;
    }
    // Adjacent
    if (end1 === start2 || end2 === start1) {
        return 0;
    }
    // Non-zero intersect, span1 first
    if (start1 < start2) {
        if (end1 < end2) {
            return end1 - start2; // Overlap
        }
        return end2 - start2; // Contained
    }
    // Non-zero intersect, span2 first
    if (end2 < end1) {
        return end2 - start1; // Overlap
    }
    return end1 - start1; // Contained
}
/**
 * Splice Projection functions:
 *
 * A splice map is a representation of how a previous array of items
 * was transformed into a new array of items. Conceptually it is a list of
 * tuples of
 *
 *   <index, removed, addedCount>
 *
 * which are kept in ascending index order of. The tuple represents that at
 * the |index|, |removed| sequence of items were removed, and counting forward
 * from |index|, |addedCount| items were added.
 */
/**
 * @internal
 * @remarks
 * Lacking individual splice mutation information, the minimal set of
 * splices can be synthesized given the previous state and final state of an
 * array. The basic approach is to calculate the edit distance matrix and
 * choose the shortest path through it.
 *
 * Complexity: O(l * p)
 *   l: The length of the current array
 *   p: The length of the old array
 */
function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
    let prefixCount = 0;
    let suffixCount = 0;
    const minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
    if (currentStart === 0 && oldStart === 0) {
        prefixCount = sharedPrefix(current, old, minLength);
    }
    if (currentEnd === current.length && oldEnd === old.length) {
        suffixCount = sharedSuffix(current, old, minLength - prefixCount);
    }
    currentStart += prefixCount;
    oldStart += prefixCount;
    currentEnd -= suffixCount;
    oldEnd -= suffixCount;
    if (currentEnd - currentStart === 0 && oldEnd - oldStart === 0) {
        return emptyArray;
    }
    if (currentStart === currentEnd) {
        const splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd) {
            splice.removed.push(old[oldStart++]);
        }
        return [splice];
    }
    else if (oldStart === oldEnd) {
        return [newSplice(currentStart, [], currentEnd - currentStart)];
    }
    const ops = spliceOperationsFromEditDistances(calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
    const splices = [];
    let splice = void 0;
    let index = currentStart;
    let oldIndex = oldStart;
    for (let i = 0; i < ops.length; ++i) {
        switch (ops[i]) {
            case EDIT_LEAVE:
                if (splice !== void 0) {
                    splices.push(splice);
                    splice = void 0;
                }
                index++;
                oldIndex++;
                break;
            case EDIT_UPDATE:
                if (splice === void 0) {
                    splice = newSplice(index, [], 0);
                }
                splice.addedCount++;
                index++;
                splice.removed.push(old[oldIndex]);
                oldIndex++;
                break;
            case EDIT_ADD:
                if (splice === void 0) {
                    splice = newSplice(index, [], 0);
                }
                splice.addedCount++;
                index++;
                break;
            case EDIT_DELETE:
                if (splice === void 0) {
                    splice = newSplice(index, [], 0);
                }
                splice.removed.push(old[oldIndex]);
                oldIndex++;
                break;
            // no default
        }
    }
    if (splice !== void 0) {
        splices.push(splice);
    }
    return splices;
}
const $push = Array.prototype.push;
function mergeSplice(splices, index, removed, addedCount) {
    const splice = newSplice(index, removed, addedCount);
    let inserted = false;
    let insertionOffset = 0;
    for (let i = 0; i < splices.length; i++) {
        const current = splices[i];
        current.index += insertionOffset;
        if (inserted) {
            continue;
        }
        const intersectCount = intersect(splice.index, splice.index + splice.removed.length, current.index, current.index + current.addedCount);
        if (intersectCount >= 0) {
            // Merge the two splices
            splices.splice(i, 1);
            i--;
            insertionOffset -= current.addedCount - current.removed.length;
            splice.addedCount += current.addedCount - intersectCount;
            const deleteCount = splice.removed.length + current.removed.length - intersectCount;
            if (!splice.addedCount && !deleteCount) {
                // merged splice is a noop. discard.
                inserted = true;
            }
            else {
                let currentRemoved = current.removed;
                if (splice.index < current.index) {
                    // some prefix of splice.removed is prepended to current.removed.
                    const prepend = splice.removed.slice(0, current.index - splice.index);
                    $push.apply(prepend, currentRemoved);
                    currentRemoved = prepend;
                }
                if (splice.index + splice.removed.length >
                    current.index + current.addedCount) {
                    // some suffix of splice.removed is appended to current.removed.
                    const append = splice.removed.slice(current.index + current.addedCount - splice.index);
                    $push.apply(currentRemoved, append);
                }
                splice.removed = currentRemoved;
                if (current.index < splice.index) {
                    splice.index = current.index;
                }
            }
        }
        else if (splice.index < current.index) {
            // Insert splice here.
            inserted = true;
            splices.splice(i, 0, splice);
            i++;
            const offset = splice.addedCount - splice.removed.length;
            current.index += offset;
            insertionOffset += offset;
        }
    }
    if (!inserted) {
        splices.push(splice);
    }
}
function createInitialSplices(changeRecords) {
    const splices = [];
    for (let i = 0, ii = changeRecords.length; i < ii; i++) {
        const record = changeRecords[i];
        mergeSplice(splices, record.index, record.removed, record.addedCount);
    }
    return splices;
}
/** @internal */
function projectArraySplices(array, changeRecords) {
    let splices = [];
    const initialSplices = createInitialSplices(changeRecords);
    for (let i = 0, ii = initialSplices.length; i < ii; ++i) {
        const splice = initialSplices[i];
        if (splice.addedCount === 1 && splice.removed.length === 1) {
            if (splice.removed[0] !== array[splice.index]) {
                splices.push(splice);
            }
            continue;
        }
        splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount, splice.removed, 0, splice.removed.length));
    }
    return splices;
}

let arrayObservationEnabled = false;
function adjustIndex(changeRecord, array) {
    let index = changeRecord.index;
    const arrayLength = array.length;
    if (index > arrayLength) {
        index = arrayLength - changeRecord.addedCount;
    }
    else if (index < 0) {
        index =
            arrayLength + changeRecord.removed.length + index - changeRecord.addedCount;
    }
    if (index < 0) {
        index = 0;
    }
    changeRecord.index = index;
    return changeRecord;
}
class ArrayObserver extends SubscriberSet {
    constructor(source) {
        super(source);
        this.oldCollection = void 0;
        this.splices = void 0;
        this.needsQueue = true;
        this.call = this.flush;
        Reflect.defineProperty(source, "$fastController", {
            value: this,
            enumerable: false,
        });
    }
    subscribe(subscriber) {
        this.flush();
        super.subscribe(subscriber);
    }
    addSplice(splice) {
        if (this.splices === void 0) {
            this.splices = [splice];
        }
        else {
            this.splices.push(splice);
        }
        if (this.needsQueue) {
            this.needsQueue = false;
            DOM.queueUpdate(this);
        }
    }
    reset(oldCollection) {
        this.oldCollection = oldCollection;
        if (this.needsQueue) {
            this.needsQueue = false;
            DOM.queueUpdate(this);
        }
    }
    flush() {
        const splices = this.splices;
        const oldCollection = this.oldCollection;
        if (splices === void 0 && oldCollection === void 0) {
            return;
        }
        this.needsQueue = true;
        this.splices = void 0;
        this.oldCollection = void 0;
        const finalSplices = oldCollection === void 0
            ? projectArraySplices(this.source, splices)
            : calcSplices(this.source, 0, this.source.length, oldCollection, 0, oldCollection.length);
        this.notify(finalSplices);
    }
}
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Enables the array observation mechanism.
 * @remarks
 * Array observation is enabled automatically when using the
 * {@link RepeatDirective}, so calling this API manually is
 * not typically necessary.
 * @public
 */
function enableArrayObservation() {
    if (arrayObservationEnabled) {
        return;
    }
    arrayObservationEnabled = true;
    Observable.setArrayObserverFactory((collection) => {
        return new ArrayObserver(collection);
    });
    const proto = Array.prototype;
    // Don't patch Array if it has already been patched
    // by another copy of fast-element.
    if (proto.$fastPatch) {
        return;
    }
    Reflect.defineProperty(proto, "$fastPatch", {
        value: 1,
        enumerable: false,
    });
    const pop = proto.pop;
    const push = proto.push;
    const reverse = proto.reverse;
    const shift = proto.shift;
    const sort = proto.sort;
    const splice = proto.splice;
    const unshift = proto.unshift;
    proto.pop = function () {
        const notEmpty = this.length > 0;
        const methodCallResult = pop.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(this.length, [methodCallResult], 0));
        }
        return methodCallResult;
    };
    proto.push = function () {
        const methodCallResult = push.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0) {
            o.addSplice(adjustIndex(newSplice(this.length - arguments.length, [], arguments.length), this));
        }
        return methodCallResult;
    };
    proto.reverse = function () {
        let oldArray;
        const o = this.$fastController;
        if (o !== void 0) {
            o.flush();
            oldArray = this.slice();
        }
        const methodCallResult = reverse.apply(this, arguments);
        if (o !== void 0) {
            o.reset(oldArray);
        }
        return methodCallResult;
    };
    proto.shift = function () {
        const notEmpty = this.length > 0;
        const methodCallResult = shift.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(0, [methodCallResult], 0));
        }
        return methodCallResult;
    };
    proto.sort = function () {
        let oldArray;
        const o = this.$fastController;
        if (o !== void 0) {
            o.flush();
            oldArray = this.slice();
        }
        const methodCallResult = sort.apply(this, arguments);
        if (o !== void 0) {
            o.reset(oldArray);
        }
        return methodCallResult;
    };
    proto.splice = function () {
        const methodCallResult = splice.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0) {
            o.addSplice(adjustIndex(newSplice(+arguments[0], methodCallResult, arguments.length > 2 ? arguments.length - 2 : 0), this));
        }
        return methodCallResult;
    };
    proto.unshift = function () {
        const methodCallResult = unshift.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0) {
            o.addSplice(adjustIndex(newSplice(0, [], arguments.length), this));
        }
        return methodCallResult;
    };
}
/* eslint-enable prefer-rest-params */
/* eslint-enable @typescript-eslint/explicit-function-return-type */

function bindWithoutPositioning(view, items, index, context) {
    view.bind(items[index], context);
}
function bindWithPositioning(view, items, index, context) {
    const childContext = Object.create(context);
    childContext.index = index;
    childContext.length = items.length;
    view.bind(items[index], childContext);
}
/**
 * A behavior that renders a template for each item in an array.
 * @public
 */
class RepeatBehavior {
    /**
     * Creates an instance of RepeatBehavior.
     * @param location - The location in the DOM to render the repeat.
     * @param itemsBinding - The array to render.
     * @param isItemsBindingVolatile - Indicates whether the items binding has volatile dependencies.
     * @param templateBinding - The template to render for each item.
     * @param isTemplateBindingVolatile - Indicates whether the template binding has volatile dependencies.
     * @param options - Options used to turn on special repeat features.
     */
    constructor(location, itemsBinding, isItemsBindingVolatile, templateBinding, isTemplateBindingVolatile, options) {
        this.location = location;
        this.itemsBinding = itemsBinding;
        this.templateBinding = templateBinding;
        this.options = options;
        this.source = null;
        this.views = [];
        this.items = null;
        this.itemsObserver = null;
        this.originalContext = void 0;
        this.childContext = void 0;
        this.bindView = bindWithoutPositioning;
        this.itemsBindingObserver = Observable.binding(itemsBinding, this, isItemsBindingVolatile);
        this.templateBindingObserver = Observable.binding(templateBinding, this, isTemplateBindingVolatile);
        if (options.positioning) {
            this.bindView = bindWithPositioning;
        }
    }
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source, context) {
        this.source = source;
        this.originalContext = context;
        this.childContext = Object.create(context);
        this.childContext.parent = source;
        this.childContext.parentContext = this.originalContext;
        this.items = this.itemsBindingObserver.observe(source, this.originalContext);
        this.template = this.templateBindingObserver.observe(source, this.originalContext);
        this.observeItems(true);
        this.refreshAllViews();
    }
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    unbind() {
        this.source = null;
        this.items = null;
        if (this.itemsObserver !== null) {
            this.itemsObserver.unsubscribe(this);
        }
        this.unbindAllViews();
        this.itemsBindingObserver.disconnect();
        this.templateBindingObserver.disconnect();
    }
    /** @internal */
    handleChange(source, args) {
        if (source === this.itemsBinding) {
            this.items = this.itemsBindingObserver.observe(this.source, this.originalContext);
            this.observeItems();
            this.refreshAllViews();
        }
        else if (source === this.templateBinding) {
            this.template = this.templateBindingObserver.observe(this.source, this.originalContext);
            this.refreshAllViews(true);
        }
        else {
            this.updateViews(args);
        }
    }
    observeItems(force = false) {
        if (!this.items) {
            this.items = emptyArray;
            return;
        }
        const oldObserver = this.itemsObserver;
        const newObserver = (this.itemsObserver = Observable.getNotifier(this.items));
        const hasNewObserver = oldObserver !== newObserver;
        if (hasNewObserver && oldObserver !== null) {
            oldObserver.unsubscribe(this);
        }
        if (hasNewObserver || force) {
            newObserver.subscribe(this);
        }
    }
    updateViews(splices) {
        const childContext = this.childContext;
        const views = this.views;
        const bindView = this.bindView;
        const items = this.items;
        const template = this.template;
        const recycle = this.options.recycle;
        const leftoverViews = [];
        let leftoverIndex = 0;
        let availableViews = 0;
        for (let i = 0, ii = splices.length; i < ii; ++i) {
            const splice = splices[i];
            const removed = splice.removed;
            let removeIndex = 0;
            let addIndex = splice.index;
            const end = addIndex + splice.addedCount;
            const removedViews = views.splice(splice.index, removed.length);
            const totalAvailableViews = (availableViews =
                leftoverViews.length + removedViews.length);
            for (; addIndex < end; ++addIndex) {
                const neighbor = views[addIndex];
                const location = neighbor ? neighbor.firstChild : this.location;
                let view;
                if (recycle && availableViews > 0) {
                    if (removeIndex <= totalAvailableViews && removedViews.length > 0) {
                        view = removedViews[removeIndex];
                        removeIndex++;
                    }
                    else {
                        view = leftoverViews[leftoverIndex];
                        leftoverIndex++;
                    }
                    availableViews--;
                }
                else {
                    view = template.create();
                }
                views.splice(addIndex, 0, view);
                bindView(view, items, addIndex, childContext);
                view.insertBefore(location);
            }
            if (removedViews[removeIndex]) {
                leftoverViews.push(...removedViews.slice(removeIndex));
            }
        }
        for (let i = leftoverIndex, ii = leftoverViews.length; i < ii; ++i) {
            leftoverViews[i].dispose();
        }
        if (this.options.positioning) {
            for (let i = 0, ii = views.length; i < ii; ++i) {
                const currentContext = views[i].context;
                currentContext.length = ii;
                currentContext.index = i;
            }
        }
    }
    refreshAllViews(templateChanged = false) {
        const items = this.items;
        const childContext = this.childContext;
        const template = this.template;
        const location = this.location;
        const bindView = this.bindView;
        let itemsLength = items.length;
        let views = this.views;
        let viewsLength = views.length;
        if (itemsLength === 0 || templateChanged || !this.options.recycle) {
            // all views need to be removed
            HTMLView.disposeContiguousBatch(views);
            viewsLength = 0;
        }
        if (viewsLength === 0) {
            // all views need to be created
            this.views = views = new Array(itemsLength);
            for (let i = 0; i < itemsLength; ++i) {
                const view = template.create();
                bindView(view, items, i, childContext);
                views[i] = view;
                view.insertBefore(location);
            }
        }
        else {
            // attempt to reuse existing views with new data
            let i = 0;
            for (; i < itemsLength; ++i) {
                if (i < viewsLength) {
                    const view = views[i];
                    bindView(view, items, i, childContext);
                }
                else {
                    const view = template.create();
                    bindView(view, items, i, childContext);
                    views.push(view);
                    view.insertBefore(location);
                }
            }
            const removed = views.splice(i, viewsLength - i);
            for (i = 0, itemsLength = removed.length; i < itemsLength; ++i) {
                removed[i].dispose();
            }
        }
    }
    unbindAllViews() {
        const views = this.views;
        for (let i = 0, ii = views.length; i < ii; ++i) {
            views[i].unbind();
        }
    }
}
/**
 * A directive that configures list rendering.
 * @public
 */
class RepeatDirective extends HTMLDirective {
    /**
     * Creates an instance of RepeatDirective.
     * @param itemsBinding - The binding that provides the array to render.
     * @param templateBinding - The template binding used to obtain a template to render for each item in the array.
     * @param options - Options used to turn on special repeat features.
     */
    constructor(itemsBinding, templateBinding, options) {
        super();
        this.itemsBinding = itemsBinding;
        this.templateBinding = templateBinding;
        this.options = options;
        /**
         * Creates a placeholder string based on the directive's index within the template.
         * @param index - The index of the directive within the template.
         */
        this.createPlaceholder = DOM.createBlockPlaceholder;
        enableArrayObservation();
        this.isItemsBindingVolatile = Observable.isVolatileBinding(itemsBinding);
        this.isTemplateBindingVolatile = Observable.isVolatileBinding(templateBinding);
    }
    /**
     * Creates a behavior for the provided target node.
     * @param target - The node instance to create the behavior for.
     */
    createBehavior(target) {
        return new RepeatBehavior(target, this.itemsBinding, this.isItemsBindingVolatile, this.templateBinding, this.isTemplateBindingVolatile, this.options);
    }
}

/**
 * The runtime behavior for child node observation.
 * @public
 */
class ChildrenBehavior extends NodeObservationBehavior {
    /**
     * Creates an instance of ChildrenBehavior.
     * @param target - The element target to observe children on.
     * @param options - The options to use when observing the element children.
     */
    constructor(target, options) {
        super(target, options);
        this.observer = null;
        options.childList = true;
    }
    /**
     * Begins observation of the nodes.
     */
    observe() {
        if (this.observer === null) {
            this.observer = new MutationObserver(this.handleEvent.bind(this));
        }
        this.observer.observe(this.target, this.options);
    }
    /**
     * Disconnects observation of the nodes.
     */
    disconnect() {
        this.observer.disconnect();
    }
    /**
     * Retrieves the nodes that should be assigned to the target.
     */
    getNodes() {
        if ("subtree" in this.options) {
            return Array.from(this.target.querySelectorAll(this.options.selector));
        }
        return Array.from(this.target.childNodes);
    }
}
/**
 * A directive that observes the `childNodes` of an element and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure child node observation.
 * @public
 */
function children(propertyOrOptions) {
    if (typeof propertyOrOptions === "string") {
        propertyOrOptions = {
            property: propertyOrOptions,
        };
    }
    return new AttachedBehaviorHTMLDirective("fast-children", ChildrenBehavior, propertyOrOptions);
}

/**
 * This set of exported strings reference https://developer.mozilla.org/en-US/docs/Web/Events
 * and should include all non-deprecated and non-experimental Standard events
 */
const eventFocus = "focus";
const eventFocusIn = "focusin";
const eventFocusOut = "focusout";
const eventKeyDown = "keydown";

/**
 * Enumerates the data grid auto generated header options
 * default option generates a non-sticky header row
 *
 * @public
 */
const GenerateHeaderOptions = {
    none: "none",
    default: "default",
    sticky: "sticky",
};
/**
 * Enumerates possible data grid cell types.
 *
 * @public
 */
const DataGridCellTypes = {
    default: "default",
    columnHeader: "columnheader",
    rowHeader: "rowheader",
};
/**
 * Enumerates possible data grid row types
 *
 * @public
 */
const DataGridRowTypes = {
    default: "default",
    header: "header",
    stickyHeader: "sticky-header",
};

/**
 * A Data Grid Row Custom HTML Element.
 *
 * @fires row-focused - Fires a custom 'row-focused' event when focus is on an element (usually a cell or its contents) in the row
 * @slot - The default slot for custom cell elements
 * @public
 */
class DataGridRow extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * The type of row
         *
         * @public
         * @remarks
         * HTML Attribute: row-type
         */
        this.rowType = DataGridRowTypes.default;
        /**
         * The base data for this row
         *
         * @public
         */
        this.rowData = null;
        /**
         * The column definitions of the row
         *
         * @public
         */
        this.columnDefinitions = null;
        /**
         * Whether focus is on/in a cell within this row.
         *
         * @internal
         */
        this.isActiveRow = false;
        this.cellsRepeatBehavior = null;
        this.cellsPlaceholder = null;
        /**
         * @internal
         */
        this.focusColumnIndex = 0;
        this.refocusOnLoad = false;
        this.updateRowStyle = () => {
            this.style.gridTemplateColumns = this.gridTemplateColumns;
        };
    }
    gridTemplateColumnsChanged() {
        if (this.$fastController.isConnected) {
            this.updateRowStyle();
        }
    }
    rowTypeChanged() {
        if (this.$fastController.isConnected) {
            this.updateItemTemplate();
        }
    }
    rowDataChanged() {
        if (this.rowData !== null && this.isActiveRow) {
            this.refocusOnLoad = true;
            return;
        }
    }
    cellItemTemplateChanged() {
        this.updateItemTemplate();
    }
    headerCellItemTemplateChanged() {
        this.updateItemTemplate();
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        // note that row elements can be reused with a different data object
        // as the parent grid's repeat behavior reacts to changes in the data set.
        if (this.cellsRepeatBehavior === null) {
            this.cellsPlaceholder = document.createComment("");
            this.appendChild(this.cellsPlaceholder);
            this.updateItemTemplate();
            this.cellsRepeatBehavior = new RepeatDirective(x => x.columnDefinitions, x => x.activeCellItemTemplate, { positioning: true }).createBehavior(this.cellsPlaceholder);
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            this.$fastController.addBehaviors([this.cellsRepeatBehavior]);
        }
        this.addEventListener("cell-focused", this.handleCellFocus);
        this.addEventListener(eventFocusOut, this.handleFocusout);
        this.addEventListener(eventKeyDown, this.handleKeydown);
        this.updateRowStyle();
        if (this.refocusOnLoad) {
            // if focus was on the row when data changed try to refocus on same cell
            this.refocusOnLoad = false;
            if (this.cellElements.length > this.focusColumnIndex) {
                this.cellElements[this.focusColumnIndex].focus();
            }
        }
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("cell-focused", this.handleCellFocus);
        this.removeEventListener(eventFocusOut, this.handleFocusout);
        this.removeEventListener(eventKeyDown, this.handleKeydown);
    }
    handleFocusout(e) {
        if (!this.contains(e.target)) {
            this.isActiveRow = false;
            this.focusColumnIndex = 0;
        }
    }
    handleCellFocus(e) {
        this.isActiveRow = true;
        this.focusColumnIndex = this.cellElements.indexOf(e.target);
        this.$emit("row-focused", this);
    }
    handleKeydown(e) {
        if (e.defaultPrevented) {
            return;
        }
        let newFocusColumnIndex = 0;
        switch (e.key) {
            case keyArrowLeft:
                // focus left one cell
                newFocusColumnIndex = Math.max(0, this.focusColumnIndex - 1);
                this.cellElements[newFocusColumnIndex].focus();
                e.preventDefault();
                break;
            case keyArrowRight:
                // focus right one cell
                newFocusColumnIndex = Math.min(this.cellElements.length - 1, this.focusColumnIndex + 1);
                this.cellElements[newFocusColumnIndex].focus();
                e.preventDefault();
                break;
            case keyHome:
                if (!e.ctrlKey) {
                    this.cellElements[0].focus();
                    e.preventDefault();
                }
                break;
            case keyEnd:
                if (!e.ctrlKey) {
                    // focus last cell of the row
                    this.cellElements[this.cellElements.length - 1].focus();
                    e.preventDefault();
                }
                break;
        }
    }
    updateItemTemplate() {
        this.activeCellItemTemplate =
            this.rowType === DataGridRowTypes.default &&
                this.cellItemTemplate !== undefined
                ? this.cellItemTemplate
                : this.rowType === DataGridRowTypes.default &&
                    this.cellItemTemplate === undefined
                    ? this.defaultCellItemTemplate
                    : this.headerCellItemTemplate !== undefined
                        ? this.headerCellItemTemplate
                        : this.defaultHeaderCellItemTemplate;
    }
}
__decorate([
    attr({ attribute: "grid-template-columns" })
], DataGridRow.prototype, "gridTemplateColumns", void 0);
__decorate([
    attr({ attribute: "row-type" })
], DataGridRow.prototype, "rowType", void 0);
__decorate([
    observable
], DataGridRow.prototype, "rowData", void 0);
__decorate([
    observable
], DataGridRow.prototype, "columnDefinitions", void 0);
__decorate([
    observable
], DataGridRow.prototype, "cellItemTemplate", void 0);
__decorate([
    observable
], DataGridRow.prototype, "headerCellItemTemplate", void 0);
__decorate([
    observable
], DataGridRow.prototype, "rowIndex", void 0);
__decorate([
    observable
], DataGridRow.prototype, "isActiveRow", void 0);
__decorate([
    observable
], DataGridRow.prototype, "activeCellItemTemplate", void 0);
__decorate([
    observable
], DataGridRow.prototype, "defaultCellItemTemplate", void 0);
__decorate([
    observable
], DataGridRow.prototype, "defaultHeaderCellItemTemplate", void 0);
__decorate([
    observable
], DataGridRow.prototype, "cellElements", void 0);

function createRowItemTemplate(context) {
    const rowTag = context.tagFor(DataGridRow);
    return html `
    <${rowTag}
        :rowData="${x => x}"
        :cellItemTemplate="${(x, c) => c.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(x, c) => c.parent.headerCellItemTemplate}"
    ></${rowTag}>
`;
}
/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGrid} component using
 * the provided prefix.
 *
 * @public
 */
const dataGridTemplate = (context, definition) => {
    const rowItemTemplate = createRowItemTemplate(context);
    const rowTag = context.tagFor(DataGridRow);
    return html `
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${() => rowTag}"
            :defaultRowItemTemplate="${rowItemTemplate}"
            ${children({
        property: "rowElements",
        filter: elements("[role=row]"),
    })}
        >
            <slot></slot>
        </template>
    `;
};

/**
 * A Data Grid Custom HTML Element.
 *
 * @slot - The default slot for custom row elements
 * @public
 */
class DataGrid extends FoundationElement {
    constructor() {
        super();
        /**
         * When true the component will not add itself to the tab queue.
         * Default is false.
         *
         * @public
         * @remarks
         * HTML Attribute: no-tabbing
         */
        this.noTabbing = false;
        /**
         *  Whether the grid should automatically generate a header row and its type
         *
         * @public
         * @remarks
         * HTML Attribute: generate-header
         */
        this.generateHeader = GenerateHeaderOptions.default;
        /**
         * The data being displayed in the grid
         *
         * @public
         */
        this.rowsData = [];
        /**
         * The column definitions of the grid
         *
         * @public
         */
        this.columnDefinitions = null;
        /**
         * The index of the row that will receive focus the next time the
         * grid is focused. This value changes as focus moves to different
         * rows within the grid.  Changing this value when focus is already
         * within the grid moves focus to the specified row.
         *
         * @public
         */
        this.focusRowIndex = 0;
        /**
         * The index of the column that will receive focus the next time the
         * grid is focused. This value changes as focus moves to different rows
         * within the grid.  Changing this value when focus is already within
         * the grid moves focus to the specified column.
         *
         * @public
         */
        this.focusColumnIndex = 0;
        this.rowsPlaceholder = null;
        this.generatedHeader = null;
        this.isUpdatingFocus = false;
        this.pendingFocusUpdate = false;
        this.rowindexUpdateQueued = false;
        this.columnDefinitionsStale = true;
        this.generatedGridTemplateColumns = "";
        this.focusOnCell = (rowIndex, columnIndex, scrollIntoView) => {
            if (this.rowElements.length === 0) {
                this.focusRowIndex = 0;
                this.focusColumnIndex = 0;
                return;
            }
            const focusRowIndex = Math.max(0, Math.min(this.rowElements.length - 1, rowIndex));
            const focusRow = this.rowElements[focusRowIndex];
            const cells = focusRow.querySelectorAll('[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]');
            const focusColumnIndex = Math.max(0, Math.min(cells.length - 1, columnIndex));
            const focusTarget = cells[focusColumnIndex];
            if (scrollIntoView &&
                this.scrollHeight !== this.clientHeight &&
                ((focusRowIndex < this.focusRowIndex && this.scrollTop > 0) ||
                    (focusRowIndex > this.focusRowIndex &&
                        this.scrollTop < this.scrollHeight - this.clientHeight))) {
                focusTarget.scrollIntoView({ block: "center", inline: "center" });
            }
            focusTarget.focus();
        };
        this.onChildListChange = (mutations, 
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        observer) => {
            if (mutations && mutations.length) {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((newNode) => {
                        if (newNode.nodeType === 1 &&
                            newNode.getAttribute("role") === "row") {
                            newNode.columnDefinitions = this.columnDefinitions;
                        }
                    });
                });
                this.queueRowIndexUpdate();
            }
        };
        this.queueRowIndexUpdate = () => {
            if (!this.rowindexUpdateQueued) {
                this.rowindexUpdateQueued = true;
                DOM.queueUpdate(this.updateRowIndexes);
            }
        };
        this.updateRowIndexes = () => {
            let newGridTemplateColumns = this.gridTemplateColumns;
            if (newGridTemplateColumns === undefined) {
                // try to generate columns based on manual rows
                if (this.generatedGridTemplateColumns === "" && this.rowElements.length > 0) {
                    const firstRow = this.rowElements[0];
                    this.generatedGridTemplateColumns = new Array(firstRow.cellElements.length)
                        .fill("1fr")
                        .join(" ");
                }
                newGridTemplateColumns = this.generatedGridTemplateColumns;
            }
            this.rowElements.forEach((element, index) => {
                const thisRow = element;
                thisRow.rowIndex = index;
                thisRow.gridTemplateColumns = newGridTemplateColumns;
                if (this.columnDefinitionsStale) {
                    thisRow.columnDefinitions = this.columnDefinitions;
                }
            });
            this.rowindexUpdateQueued = false;
            this.columnDefinitionsStale = false;
        };
    }
    /**
     *  generates a gridTemplateColumns based on columndata array
     */
    static generateTemplateColumns(columnDefinitions) {
        let templateColumns = "";
        columnDefinitions.forEach((column) => {
            templateColumns = `${templateColumns}${templateColumns === "" ? "" : " "}${"1fr"}`;
        });
        return templateColumns;
    }
    noTabbingChanged() {
        if (this.$fastController.isConnected) {
            if (this.noTabbing) {
                this.setAttribute("tabIndex", "-1");
            }
            else {
                this.setAttribute("tabIndex", this.contains(document.activeElement) ||
                    this === document.activeElement
                    ? "-1"
                    : "0");
            }
        }
    }
    generateHeaderChanged() {
        if (this.$fastController.isConnected) {
            this.toggleGeneratedHeader();
        }
    }
    gridTemplateColumnsChanged() {
        if (this.$fastController.isConnected) {
            this.updateRowIndexes();
        }
    }
    rowsDataChanged() {
        if (this.columnDefinitions === null && this.rowsData.length > 0) {
            this.columnDefinitions = DataGrid.generateColumns(this.rowsData[0]);
        }
        if (this.$fastController.isConnected) {
            this.toggleGeneratedHeader();
        }
    }
    columnDefinitionsChanged() {
        if (this.columnDefinitions === null) {
            this.generatedGridTemplateColumns = "";
            return;
        }
        this.generatedGridTemplateColumns = DataGrid.generateTemplateColumns(this.columnDefinitions);
        if (this.$fastController.isConnected) {
            this.columnDefinitionsStale = true;
            this.queueRowIndexUpdate();
        }
    }
    headerCellItemTemplateChanged() {
        if (this.$fastController.isConnected) {
            if (this.generatedHeader !== null) {
                this.generatedHeader.headerCellItemTemplate = this.headerCellItemTemplate;
            }
        }
    }
    focusRowIndexChanged() {
        if (this.$fastController.isConnected) {
            this.queueFocusUpdate();
        }
    }
    focusColumnIndexChanged() {
        if (this.$fastController.isConnected) {
            this.queueFocusUpdate();
        }
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (this.rowItemTemplate === undefined) {
            this.rowItemTemplate = this.defaultRowItemTemplate;
        }
        this.rowsPlaceholder = document.createComment("");
        this.appendChild(this.rowsPlaceholder);
        this.toggleGeneratedHeader();
        this.rowsRepeatBehavior = new RepeatDirective(x => x.rowsData, x => x.rowItemTemplate, { positioning: true }).createBehavior(this.rowsPlaceholder);
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        this.$fastController.addBehaviors([this.rowsRepeatBehavior]);
        this.addEventListener("row-focused", this.handleRowFocus);
        this.addEventListener(eventFocus, this.handleFocus);
        this.addEventListener(eventKeyDown, this.handleKeydown);
        this.addEventListener(eventFocusOut, this.handleFocusOut);
        this.observer = new MutationObserver(this.onChildListChange);
        // only observe if nodes are added or removed
        this.observer.observe(this, { childList: true });
        if (this.noTabbing) {
            this.setAttribute("tabindex", "-1");
        }
        DOM.queueUpdate(this.queueRowIndexUpdate);
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("row-focused", this.handleRowFocus);
        this.removeEventListener(eventFocus, this.handleFocus);
        this.removeEventListener(eventKeyDown, this.handleKeydown);
        this.removeEventListener(eventFocusOut, this.handleFocusOut);
        // disconnect observer
        this.observer.disconnect();
        this.rowsPlaceholder = null;
        this.generatedHeader = null;
    }
    /**
     * @internal
     */
    handleRowFocus(e) {
        this.isUpdatingFocus = true;
        const focusRow = e.target;
        this.focusRowIndex = this.rowElements.indexOf(focusRow);
        this.focusColumnIndex = focusRow.focusColumnIndex;
        this.setAttribute("tabIndex", "-1");
        this.isUpdatingFocus = false;
    }
    /**
     * @internal
     */
    handleFocus(e) {
        this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, true);
    }
    /**
     * @internal
     */
    handleFocusOut(e) {
        if (e.relatedTarget === null || !this.contains(e.relatedTarget)) {
            this.setAttribute("tabIndex", this.noTabbing ? "-1" : "0");
        }
    }
    /**
     * @internal
     */
    handleKeydown(e) {
        if (e.defaultPrevented) {
            return;
        }
        let newFocusRowIndex;
        const maxIndex = this.rowElements.length - 1;
        const currentGridBottom = this.offsetHeight + this.scrollTop;
        const lastRow = this.rowElements[maxIndex];
        switch (e.key) {
            case keyArrowUp:
                e.preventDefault();
                // focus up one row
                this.focusOnCell(this.focusRowIndex - 1, this.focusColumnIndex, true);
                break;
            case keyArrowDown:
                e.preventDefault();
                // focus down one row
                this.focusOnCell(this.focusRowIndex + 1, this.focusColumnIndex, true);
                break;
            case keyPageUp:
                e.preventDefault();
                if (this.rowElements.length === 0) {
                    this.focusOnCell(0, 0, false);
                    break;
                }
                if (this.focusRowIndex === 0) {
                    this.focusOnCell(0, this.focusColumnIndex, false);
                    return;
                }
                newFocusRowIndex = this.focusRowIndex - 1;
                for (newFocusRowIndex; newFocusRowIndex >= 0; newFocusRowIndex--) {
                    const thisRow = this.rowElements[newFocusRowIndex];
                    if (thisRow.offsetTop < this.scrollTop) {
                        this.scrollTop =
                            thisRow.offsetTop + thisRow.clientHeight - this.clientHeight;
                        break;
                    }
                }
                this.focusOnCell(newFocusRowIndex, this.focusColumnIndex, false);
                break;
            case keyPageDown:
                e.preventDefault();
                if (this.rowElements.length === 0) {
                    this.focusOnCell(0, 0, false);
                    break;
                }
                // focus down one "page"
                if (this.focusRowIndex >= maxIndex ||
                    lastRow.offsetTop + lastRow.offsetHeight <= currentGridBottom) {
                    this.focusOnCell(maxIndex, this.focusColumnIndex, false);
                    return;
                }
                newFocusRowIndex = this.focusRowIndex + 1;
                for (newFocusRowIndex; newFocusRowIndex <= maxIndex; newFocusRowIndex++) {
                    const thisRow = this.rowElements[newFocusRowIndex];
                    if (thisRow.offsetTop + thisRow.offsetHeight > currentGridBottom) {
                        let stickyHeaderOffset = 0;
                        if (this.generateHeader === GenerateHeaderOptions.sticky &&
                            this.generatedHeader !== null) {
                            stickyHeaderOffset = this.generatedHeader.clientHeight;
                        }
                        this.scrollTop = thisRow.offsetTop - stickyHeaderOffset;
                        break;
                    }
                }
                this.focusOnCell(newFocusRowIndex, this.focusColumnIndex, false);
                break;
            case keyHome:
                if (e.ctrlKey) {
                    e.preventDefault();
                    // focus first cell of first row
                    this.focusOnCell(0, 0, true);
                }
                break;
            case keyEnd:
                if (e.ctrlKey && this.columnDefinitions !== null) {
                    e.preventDefault();
                    // focus last cell of last row
                    this.focusOnCell(this.rowElements.length - 1, this.columnDefinitions.length - 1, true);
                }
                break;
        }
    }
    queueFocusUpdate() {
        if (this.isUpdatingFocus &&
            (this.contains(document.activeElement) || this === document.activeElement)) {
            return;
        }
        if (this.pendingFocusUpdate === false) {
            this.pendingFocusUpdate = true;
            DOM.queueUpdate(() => this.updateFocus());
        }
    }
    updateFocus() {
        this.pendingFocusUpdate = false;
        this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, true);
    }
    toggleGeneratedHeader() {
        if (this.generatedHeader !== null) {
            this.removeChild(this.generatedHeader);
            this.generatedHeader = null;
        }
        if (this.generateHeader !== GenerateHeaderOptions.none &&
            this.rowsData.length > 0) {
            const generatedHeaderElement = document.createElement(this.rowElementTag);
            this.generatedHeader = generatedHeaderElement;
            this.generatedHeader.columnDefinitions = this.columnDefinitions;
            this.generatedHeader.gridTemplateColumns = this.gridTemplateColumns;
            this.generatedHeader.rowType =
                this.generateHeader === GenerateHeaderOptions.sticky
                    ? DataGridRowTypes.stickyHeader
                    : DataGridRowTypes.header;
            if (this.firstChild !== null || this.rowsPlaceholder !== null) {
                this.insertBefore(generatedHeaderElement, this.firstChild !== null ? this.firstChild : this.rowsPlaceholder);
            }
            return;
        }
    }
}
/**
 *  generates a basic column definition by examining sample row data
 */
DataGrid.generateColumns = (row) => {
    return Object.getOwnPropertyNames(row).map((property, index) => {
        return {
            columnDataKey: property,
            gridColumn: `${index}`,
        };
    });
};
__decorate([
    attr({ attribute: "no-tabbing", mode: "boolean" })
], DataGrid.prototype, "noTabbing", void 0);
__decorate([
    attr({ attribute: "generate-header" })
], DataGrid.prototype, "generateHeader", void 0);
__decorate([
    attr({ attribute: "grid-template-columns" })
], DataGrid.prototype, "gridTemplateColumns", void 0);
__decorate([
    observable
], DataGrid.prototype, "rowsData", void 0);
__decorate([
    observable
], DataGrid.prototype, "columnDefinitions", void 0);
__decorate([
    observable
], DataGrid.prototype, "rowItemTemplate", void 0);
__decorate([
    observable
], DataGrid.prototype, "cellItemTemplate", void 0);
__decorate([
    observable
], DataGrid.prototype, "headerCellItemTemplate", void 0);
__decorate([
    observable
], DataGrid.prototype, "focusRowIndex", void 0);
__decorate([
    observable
], DataGrid.prototype, "focusColumnIndex", void 0);
__decorate([
    observable
], DataGrid.prototype, "defaultRowItemTemplate", void 0);
__decorate([
    observable
], DataGrid.prototype, "rowElementTag", void 0);
__decorate([
    observable
], DataGrid.prototype, "rowElements", void 0);

const defaultCellContentsTemplate = html `
    <template>
        ${x => x.rowData === null ||
    x.columnDefinition === null ||
    x.columnDefinition.columnDataKey === null
    ? null
    : x.rowData[x.columnDefinition.columnDataKey]}
    </template>
`;
const defaultHeaderCellContentsTemplate = html `
    <template>
        ${x => x.columnDefinition === null
    ? null
    : x.columnDefinition.title === undefined
        ? x.columnDefinition.columnDataKey
        : x.columnDefinition.title}
    </template>
`;
/**
 * A Data Grid Cell Custom HTML Element.
 *
 * @fires cell-focused - Fires a custom 'cell-focused' event when focus is on the cell or its contents
 * @slot - The default slot for cell contents.  The "cell contents template" renders here.
 * @public
 */
class DataGridCell extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * The type of cell
         *
         * @public
         * @remarks
         * HTML Attribute: cell-type
         */
        this.cellType = DataGridCellTypes.default;
        /**
         * The base data for the parent row
         *
         * @public
         */
        this.rowData = null;
        /**
         * The base data for the column
         *
         * @public
         */
        this.columnDefinition = null;
        this.isActiveCell = false;
        this.customCellView = null;
        this.updateCellStyle = () => {
            this.style.gridColumn = this.gridColumn;
        };
    }
    cellTypeChanged() {
        if (this.$fastController.isConnected) {
            this.updateCellView();
        }
    }
    gridColumnChanged() {
        if (this.$fastController.isConnected) {
            this.updateCellStyle();
        }
    }
    columnDefinitionChanged(oldValue, newValue) {
        if (this.$fastController.isConnected) {
            this.updateCellView();
        }
    }
    /**
     * @internal
     */
    connectedCallback() {
        var _a;
        super.connectedCallback();
        this.addEventListener(eventFocusIn, this.handleFocusin);
        this.addEventListener(eventFocusOut, this.handleFocusout);
        this.addEventListener(eventKeyDown, this.handleKeydown);
        this.style.gridColumn = `${((_a = this.columnDefinition) === null || _a === void 0 ? void 0 : _a.gridColumn) === undefined
            ? 0
            : this.columnDefinition.gridColumn}`;
        this.updateCellView();
        this.updateCellStyle();
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener(eventFocusIn, this.handleFocusin);
        this.removeEventListener(eventFocusOut, this.handleFocusout);
        this.removeEventListener(eventKeyDown, this.handleKeydown);
        this.disconnectCellView();
    }
    handleFocusin(e) {
        if (this.isActiveCell) {
            return;
        }
        this.isActiveCell = true;
        switch (this.cellType) {
            case DataGridCellTypes.columnHeader:
                if (this.columnDefinition !== null &&
                    this.columnDefinition.headerCellInternalFocusQueue !== true &&
                    typeof this.columnDefinition.headerCellFocusTargetCallback ===
                        "function") {
                    // move focus to the focus target
                    const focusTarget = this.columnDefinition.headerCellFocusTargetCallback(this);
                    if (focusTarget !== null) {
                        focusTarget.focus();
                    }
                }
                break;
            default:
                if (this.columnDefinition !== null &&
                    this.columnDefinition.cellInternalFocusQueue !== true &&
                    typeof this.columnDefinition.cellFocusTargetCallback === "function") {
                    // move focus to the focus target
                    const focusTarget = this.columnDefinition.cellFocusTargetCallback(this);
                    if (focusTarget !== null) {
                        focusTarget.focus();
                    }
                }
                break;
        }
        this.$emit("cell-focused", this);
    }
    handleFocusout(e) {
        if (this !== document.activeElement && !this.contains(document.activeElement)) {
            this.isActiveCell = false;
        }
    }
    handleKeydown(e) {
        if (e.defaultPrevented ||
            this.columnDefinition === null ||
            (this.cellType === DataGridCellTypes.default &&
                this.columnDefinition.cellInternalFocusQueue !== true) ||
            (this.cellType === DataGridCellTypes.columnHeader &&
                this.columnDefinition.headerCellInternalFocusQueue !== true)) {
            return;
        }
        switch (e.key) {
            case keyEnter:
            case keyFunction2:
                if (this.contains(document.activeElement) &&
                    document.activeElement !== this) {
                    return;
                }
                switch (this.cellType) {
                    case DataGridCellTypes.columnHeader:
                        if (this.columnDefinition.headerCellFocusTargetCallback !==
                            undefined) {
                            const focusTarget = this.columnDefinition.headerCellFocusTargetCallback(this);
                            if (focusTarget !== null) {
                                focusTarget.focus();
                            }
                            e.preventDefault();
                        }
                        break;
                    default:
                        if (this.columnDefinition.cellFocusTargetCallback !== undefined) {
                            const focusTarget = this.columnDefinition.cellFocusTargetCallback(this);
                            if (focusTarget !== null) {
                                focusTarget.focus();
                            }
                            e.preventDefault();
                        }
                        break;
                }
                break;
            case keyEscape:
                if (this.contains(document.activeElement) &&
                    document.activeElement !== this) {
                    this.focus();
                    e.preventDefault();
                }
                break;
        }
    }
    updateCellView() {
        this.disconnectCellView();
        if (this.columnDefinition === null) {
            return;
        }
        switch (this.cellType) {
            case DataGridCellTypes.columnHeader:
                if (this.columnDefinition.headerCellTemplate !== undefined) {
                    this.customCellView = this.columnDefinition.headerCellTemplate.render(this, this);
                }
                else {
                    this.customCellView = defaultHeaderCellContentsTemplate.render(this, this);
                }
                break;
            case undefined:
            case DataGridCellTypes.rowHeader:
            case DataGridCellTypes.default:
                if (this.columnDefinition.cellTemplate !== undefined) {
                    this.customCellView = this.columnDefinition.cellTemplate.render(this, this);
                }
                else {
                    this.customCellView = defaultCellContentsTemplate.render(this, this);
                }
                break;
        }
    }
    disconnectCellView() {
        if (this.customCellView !== null) {
            this.customCellView.dispose();
            this.customCellView = null;
        }
    }
}
__decorate([
    attr({ attribute: "cell-type" })
], DataGridCell.prototype, "cellType", void 0);
__decorate([
    attr({ attribute: "grid-column" })
], DataGridCell.prototype, "gridColumn", void 0);
__decorate([
    observable
], DataGridCell.prototype, "rowData", void 0);
__decorate([
    observable
], DataGridCell.prototype, "columnDefinition", void 0);

function createCellItemTemplate(context) {
    const cellTag = context.tagFor(DataGridCell);
    return html `
    <${cellTag}
        cell-type="${x => (x.isRowHeader ? "rowheader" : undefined)}"
        grid-column="${(x, c) => c.index + 1}"
        :rowData="${(x, c) => c.parent.rowData}"
        :columnDefinition="${x => x}"
    ></${cellTag}>
`;
}
function createHeaderCellItemTemplate(context) {
    const cellTag = context.tagFor(DataGridCell);
    return html `
    <${cellTag}
        cell-type="columnheader"
        grid-column="${(x, c) => c.index + 1}"
        :columnDefinition="${x => x}"
    ></${cellTag}>
`;
}
/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGridRow} component using
 * the provided prefix.
 *
 * @public
 */
const dataGridRowTemplate = (context, definition) => {
    const cellItemTemplate = createCellItemTemplate(context);
    const headerCellItemTemplate = createHeaderCellItemTemplate(context);
    return html `
        <template
            role="row"
            class="${x => (x.rowType !== "default" ? x.rowType : "")}"
            :defaultCellItemTemplate="${cellItemTemplate}"
            :defaultHeaderCellItemTemplate="${headerCellItemTemplate}"
            ${children({
        property: "cellElements",
        filter: elements('[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]'),
    })}
        >
            <slot ${slotted("slottedCellElements")}></slot>
        </template>
    `;
};

/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGridCell} component using
 * the provided prefix.
 * @public
 */
const dataGridCellTemplate = (context, definition) => {
    return html `
        <template
            tabindex="-1"
            role="${x => !x.cellType || x.cellType === "default" ? "gridcell" : x.cellType}"
            class="
            ${x => x.cellType === "columnheader"
        ? "column-header"
        : x.cellType === "rowheader"
            ? "row-header"
            : ""}
            "
        >
            <slot></slot>
        </template>
    `;
};

/**
 * Styles for Data Grid
 * @public
 */
const dataGridStyles = (context, definition) => css `
    :host {
        display: flex;
        position: relative;
        flex-direction: column;
    }
`;

/**
 * Styles for Data Grid row
 * @public
 */
const dataGridRowStyles = (context, definition) => css `
    :host {
        display: grid;
        padding: 1px 0;
        box-sizing: border-box;
        width: 100%;
        border-bottom: calc(${strokeWidth} * 1px) solid ${neutralStrokeDividerRest};
    }

    :host(.header) {
    }

    :host(.sticky-header) {
        background: ${neutralFillRest};
        position: sticky;
        top: 0;
    }
`;

/**
 * Styles for Data Grid cell
 * @public
 */
const dataGridCellStyles = (context, definition) => css `
        :host {
            padding: calc(${designUnit} * 1px) calc(${designUnit} * 3px);
            color: ${neutralForegroundRest};
            box-sizing: border-box;
            font-family: ${bodyFont};
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
            font-weight: 400;
            border: transparent calc(${focusStrokeWidth} * 1px) solid;
            overflow: hidden;
            white-space: nowrap;
            border-radius: calc(${controlCornerRadius} * 1px);
        }

        :host(.column-header) {
            font-weight: 600;
        }

        :host(:${focusVisible}) {
            border: ${focusStrokeOuter} calc(${focusStrokeWidth} * 1px) solid;
            outline: none;
            color: ${neutralForegroundRest};
        }
    `.withBehaviors(forcedColorsStylesheetBehavior(css `
        :host {
            forced-color-adjust: none;
            border-color: transparent;
            background: ${SystemColors.Field};
            color: ${SystemColors.FieldText};
        }

        :host(:${focusVisible}) {
            border-color: ${SystemColors.FieldText};
            box-shadow: 0 0 0 2px inset ${SystemColors.Field};
            color: ${SystemColors.FieldText};
        }
        `));

/**
 * A function that returns a {@link @microsoft/fast-foundation#DataGridCell} registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-data-grid-cell>`
 */
const fastDataGridCell = DataGridCell.compose({
    baseName: "data-grid-cell",
    template: dataGridCellTemplate,
    styles: dataGridCellStyles,
});
/**
 * A function that returns a {@link @microsoft/fast-foundation#DataGridRow} registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-data-grid-row>`
 */
const fastDataGridRow = DataGridRow.compose({
    baseName: "data-grid-row",
    template: dataGridRowTemplate,
    styles: dataGridRowStyles,
});
/**
 * A function that returns a {@link @microsoft/fast-foundation#DataGrid} registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-data-grid>`
 */
const fastDataGrid = DataGrid.compose({
    baseName: "data-grid",
    template: dataGridTemplate,
    styles: dataGridStyles,
});

provideFASTDesignSystem()
    .withPrefix("site")
    .register(fastDataGridCell({
    // eslint-disable-next-line arrow-body-style
    styles: (context, definition) => css ` 
                ${dataGridCellStyles()} 
                ${styleMap}
            `
}), fastDataGridRow({
    styles: (context, definition) => css `
                ${dataGridRowStyles()}
                ${styleMap}     
            `
}), fastDataGrid({
    styles: (context, definition) => css `
                ${dataGridStyles()}
                ${styleMap}          
            `
}));
