/**
 * Collection of shared Symbol objects for internal component communication.
 *
 * The shared `Symbol` objects in this module let mixins and a component
 * internally communicate without exposing these internal properties and methods
 * in the component's public API. They also help avoid unintentional name
 * collisions, as a component developer must specifically import the `internal`
 * module and reference one of its symbols.
 *
 * To use these `Symbol` objects in your own component, include this module and
 * then create a property or method whose key is the desired Symbol. E.g.,
 * [ShadowTemplateMixin](ShadowTemplateMixin) expects a component to define
 * a property called [template](#template):
 *
 *     import { template } from 'elix/src/core/internal.js';
 *     import { templateFrom } from 'elix/src/core/htmlLiterals.js'
 *     import ShadowTemplateMixin from 'elix/src/core/ShadowTemplateMixin.js';
 *
 *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
 *       [template]() {
 *         return templateFrom.html`Hello, <em>world</em>.`;
 *       }
 *     }
 *
 * The above use of the internal `template` member lets the mixin find the
 * component's template in a way that will not pollute the component's public
 * API or interfere with other component logic. For example, if for some reason
 * the component wants to define a separate property with the plain string name,
 * "template", it can do so without affecting the above property setter.
 *
 * @module internal
 */

/**
 * Symbol for the default state for this element.
 */
const defaultState$1 = Symbol("defaultState");

/**
 * Symbol for the `delegatesFocus` property.
 *
 * [DelegatesFocusMixin](DelegatesFocusMixin) defines this property, returning
 * true to indicate that the focus is being delegated, even in browsers that
 * don't support that natively. Mixins like [KeyboardMixin](KeyboardMixin) use
 * this to accommodate focus delegation.
 */
const delegatesFocus$1 = Symbol("delegatesFocus");

/**
 * Symbol for the `firstRender` property.
 *
 * [ReactiveMixin](ReactiveMixin) sets the property to `true` during the
 * element's first `render` and `rendered` callback, then `false` in subsequent
 * callbacks.
 *
 * You can inspect this property in your own `rendered` callback handler to do
 * work like wiring up events that should only happen once.
 */
const firstRender$1 = Symbol("firstRender");

/**
 * Symbol for the `focusTarget` property.
 *
 * [DelegatesFocusMixin](DelegatesFocusMixin) defines this property as either:
 * 1) the element itself, in browsers that support native focus delegation or,
 * 2) the shadow root's first focusable element.
 */
const focusTarget$1 = Symbol("focusTarget");

/**
 * Symbol for the `hasDynamicTemplate` property.
 *
 * If your component class does not always use the same template, define a
 * static class property getter with this symbol and have it return `true`.
 * This will disable template caching for your component.
 */
const hasDynamicTemplate$1 = Symbol("hasDynamicTemplate");

/**
 * Symbol for the `ids` property.
 *
 * [ShadowTemplateMixin](ShadowTemplateMixin) defines a shorthand function
 * `internal.ids` that can be used to obtain a reference to a shadow element with
 * a given ID.
 *
 * Example: if component's template contains a shadow element
 * `<button id="foo">`, you can use the reference `this[ids].foo` to obtain
 * the corresponding button in the component instance's shadow tree.
 * The `ids` function is simply a shorthand for `getElementById`, so
 * `this[ids].foo` is the same as `this.shadowRoot.getElementById('foo')`.
 */
const ids$1 = Symbol("ids");

/**
 * Symbol for access to native HTML element internals.
 */
const nativeInternals$1 = Symbol("nativeInternals");

/**
 * Symbol for the `raiseChangeEvents` property.
 *
 * This property is used by mixins to determine whether they should raise
 * property change events. The standard HTML pattern is to only raise such
 * events in response to direct user interactions. For a detailed discussion
 * of this point, see the Gold Standard checklist item for
 * [Propery Change Events](https://github.com/webcomponents/gold-standard/wiki/Property%20Change%20Events).
 *
 * The above article describes a pattern for using a flag to track whether
 * work is being performed in response to internal component activity, and
 * whether the component should therefore raise property change events.
 * This `raiseChangeEvents` symbol is a shared flag used for that purpose by
 * all Elix mixins and components. Sharing this flag ensures that internal
 * activity (e.g., a UI event listener) in one mixin can signal other mixins
 * handling affected properties to raise change events.
 *
 * All UI event listeners (and other forms of internal handlers, such as
 * timeouts and async network handlers) should set `raiseChangeEvents` to
 * `true` at the start of the event handler, then `false` at the end:
 *
 *     this.addEventListener('click', event => {
 *       this[raiseChangeEvents] = true;
 *       // Do work here, possibly setting properties, like:
 *       this.foo = 'Hello';
 *       this[raiseChangeEvents] = false;
 *     });
 *
 * Elsewhere, property setters that raise change events should only do so it
 * this property is `true`:
 *
 *     set foo(value) {
 *       // Save foo value here, do any other work.
 *       if (this[raiseChangeEvents]) {
 *         export const event = new CustomEvent('foochange');
 *         this.dispatchEvent(event);
 *       }
 *     }
 *
 * In this way, programmatic attempts to set the `foo` property will not trigger
 * the `foochange` event, but UI interactions that update that property will
 * cause those events to be raised.
 */
const raiseChangeEvents$1 = Symbol("raiseChangeEvents");

/**
 * Symbol for the `render` method.
 *
 * [ReactiveMixin](ReactiveMixin) invokes this `internal.render` method to give
 * the component a chance to render recent changes in component state.
 */
const render$1 = Symbol("render");

/**
 * Symbol for the `renderChanges` method.
 *
 * [ReactiveMixin](ReactiveMixin) invokes this method in response to a
 * `setState` call; you should generally not invoke this method yourself.
 */
const renderChanges$1 = Symbol("renderChanges");

/**
 * Symbol for the `rendered` method.
 *
 * [ReactiveMixin](ReactiveMixin) will invoke this method after your
 * element has completely finished rendering.
 *
 * If you only want to do work the first time rendering happens (for example, if
 * you want to wire up event handlers), your `internal.rendered` implementation
 * can inspect the `internal.firstRender` flag.
 */
const rendered$1 = Symbol("rendered");

/**
 * Symbol for the `rendering` property.
 *
 * [ReactiveMixin](ReactiveMixin) sets this property to true during rendering,
 * at other times it will be false.
 */
const rendering$1 = Symbol("rendering");

/**
 * Symbol for the `setState` method.
 *
 * A component using [ReactiveMixin](ReactiveMixin) can invoke this method to
 * apply changes to the element's current state.
 */
const setState$1 = Symbol("setState");

/**
 * Symbol for the `shadowRoot` property.
 *
 * This property holds a reference to an element's shadow root, like
 * `this.shadowRoot`. This propery exists because `this.shadowRoot` is not
 * available for components with closed shadow roots.
 * [ShadowTemplateMixin](ShadowTemplateMixin) creates open shadow roots by
 * default, but you can opt into creating closed shadow roots; see
 * [shadowRootMode](internal#internal.shadowRootMode).
 */
const shadowRoot$1 = Symbol("shadowRoot");

/**
 * Symbol for the `shadowRootMode` property.
 *
 * If true (the default), then [ShadowTemplateMixin](ShadowTemplateMixin) will
 * create an open shadow root when the component is instantiated. Set this to
 * false if you want to programmatically hide component internals in a closed
 * shadow root.
 */
const shadowRootMode$1 = Symbol("shadowRootMode");

/**
 * Symbol for the element's current state.
 *
 * This is managed by [ReactiveMixin](ReactiveMixin).
 */
const state$1 = Symbol("state");

/**
 * Symbol for the `stateEffects` method.
 *
 * See [stateEffects](ReactiveMixin#stateEffects).
 */
const stateEffects$1 = Symbol("stateEffects");

/**
 * Symbol for the `template` method.
 *
 * [ShadowTemplateMixin](ShadowTemplateMixin) uses this property to obtain a
 * component's template, which it will clone into a component's shadow root.
 */
const template$1 = Symbol("template");

// Memoized maps of attribute to property names and vice versa.
// We initialize this with the special case of the tabindex (lowercase "i")
// attribute, which is mapped to the tabIndex (capital "I") property.
/** @type {IndexedObject<string>} */
const attributeToPropertyNames = {
  tabindex: "tabIndex",
};
/** @type {IndexedObject<string>} */
const propertyNamesToAttributes = {
  tabIndex: "tabindex",
};

/**
 * Sets properties when the corresponding attributes change
 *
 * If your component exposes a setter for a property, it's generally a good
 * idea to let devs using your component be able to set that property in HTML
 * via an element attribute. You can code that yourself by writing an
 * `attributeChangedCallback`, or you can use this mixin to get a degree of
 * automatic support.
 *
 * This mixin implements an `attributeChangedCallback` that will attempt to
 * convert a change in an element attribute into a call to the corresponding
 * property setter. Attributes typically follow hyphenated names ("foo-bar"),
 * whereas properties typically use camelCase names ("fooBar"). This mixin
 * respects that convention, automatically mapping the hyphenated attribute
 * name to the corresponding camelCase property name.
 *
 * Example: You define a component using this mixin:
 *
 *     class MyElement extends AttributeMarshallingMixin(HTMLElement) {
 *       get fooBar() { return this._fooBar; }
 *       set fooBar(value) { this._fooBar = value; }
 *     }
 *
 * If someone then instantiates your component in HTML:
 *
 *     <my-element foo-bar="Hello"></my-element>
 *
 * Then, after the element has been upgraded, the `fooBar` setter will
 * automatically be invoked with the initial value "Hello".
 *
 * Attributes can only have string values. If you'd like to convert string
 * attributes to other types (numbers, booleans), you must implement parsing
 * yourself.
 *
 * @module AttributeMarshallingMixin
 * @param {Constructor<CustomElement>} Base
 */
function AttributeMarshallingMixin(Base) {
  // The class prototype added by the mixin.
  class AttributeMarshalling extends Base {
    /**
     * Handle a change to the attribute with the given name.
     *
     * @ignore
     * @param {string} attributeName
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(attributeName, oldValue, newValue) {
      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(attributeName, oldValue, newValue);
      }

      // Sometimes this callback is invoked when there's not actually any
      // change, in which we skip invoking the property setter.
      //
      // We also skip setting properties if we're rendering. A component may
      // want to reflect property values to attributes during rendering, but
      // such attribute changes shouldn't trigger property updates.
      if (newValue !== oldValue && !this[rendering$1]) {
        const propertyName = attributeToPropertyName(attributeName);
        // If the attribute name corresponds to a property name, set the property.
        if (propertyName in this) {
          // Parse standard boolean attributes.
          const parsed = standardBooleanAttributes[attributeName]
            ? booleanAttributeValue(attributeName, newValue)
            : newValue;
          this[propertyName] = parsed;
        }
      }
    }

    // Because maintaining the mapping of attributes to properties is tedious,
    // this provides a default implementation for `observedAttributes` that
    // assumes that your component will want to expose all public properties in
    // your component's API as properties.
    //
    // You can override this default implementation of `observedAttributes`. For
    // example, if you have a system that can statically analyze which
    // properties are available to your component, you could hand-author or
    // programmatically generate a definition for `observedAttributes` that
    // avoids the minor run-time performance cost of inspecting the component
    // prototype to determine your component's public properties.
    static get observedAttributes() {
      return attributesForClass(this);
    }
  }

  return AttributeMarshalling;
}

/**
 * Return the custom attributes for the given class.
 *
 * E.g., if the supplied class defines a `fooBar` property, then the resulting
 * array of attribute names will include the "foo-bar" attribute.
 *
 * @private
 * @param {Constructor<HTMLElement>} classFn
 * @returns {string[]}
 */
function attributesForClass(classFn) {
  // We treat the HTMLElement base class as if it has no attributes, since we
  // don't want to receive attributeChangedCallback for it (or anything further
  // up the protoype chain).
  if (classFn === HTMLElement) {
    return [];
  }

  // Get attributes for parent class.
  const baseClass = Object.getPrototypeOf(classFn.prototype).constructor;

  // See if parent class defines observedAttributes manually.
  let baseAttributes = baseClass.observedAttributes;
  if (!baseAttributes) {
    // Calculate parent class attributes ourselves.
    baseAttributes = attributesForClass(baseClass);
  }

  // Get the properties for this particular class.
  const propertyNames = Object.getOwnPropertyNames(classFn.prototype);
  const setterNames = propertyNames.filter((propertyName) => {
    const descriptor = Object.getOwnPropertyDescriptor(
      classFn.prototype,
      propertyName
    );
    return descriptor && typeof descriptor.set === "function";
  });

  // Map the property names to attribute names.
  const attributes = setterNames.map((setterName) =>
    propertyNameToAttribute(setterName)
  );

  // Merge the attribute for this class and its base class.
  const diff = attributes.filter(
    (attribute) => baseAttributes.indexOf(attribute) < 0
  );
  const result = baseAttributes.concat(diff);

  return result;
}

/**
 * Convert hyphenated foo-bar attribute name to camel case fooBar property name.
 *
 * @private
 * @param {string} attributeName
 */
function attributeToPropertyName(attributeName) {
  let propertyName = attributeToPropertyNames[attributeName];
  if (!propertyName) {
    // Convert and memoize.
    const hyphenRegEx = /-([a-z])/g;
    propertyName = attributeName.replace(hyphenRegEx, (match) =>
      match[1].toUpperCase()
    );
    attributeToPropertyNames[attributeName] = propertyName;
  }
  return propertyName;
}

/**
 * Given a string value for a named boolean attribute, return `true` if the
 * value is either: a) the empty string, or b) a case-insensitive match for the
 * name.
 *
 * This is native HTML behavior; see the MDN documentation on [boolean
 * attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#Boolean_Attributes)
 * for the reasoning.
 *
 * Given a null value, this return `false`.
 * Given a boolean value, this return the value as is.
 *
 * @param {string} name
 * @param {string|boolean|null} value
 */
function booleanAttributeValue(name, value) {
  return typeof value === "boolean"
    ? value
    : typeof value === "string"
    ? value === "" || name.toLowerCase() === value.toLowerCase()
    : false;
}

/**
 * Convert a camel case fooBar property name to a hyphenated foo-bar attribute.
 *
 * @private
 * @param {string} propertyName
 */
function propertyNameToAttribute(propertyName) {
  let attribute = propertyNamesToAttributes[propertyName];
  if (!attribute) {
    // Convert and memoize.
    const uppercaseRegEx = /([A-Z])/g;
    attribute = propertyName.replace(uppercaseRegEx, "-$1").toLowerCase();
    propertyNamesToAttributes[propertyName] = attribute;
  }
  return attribute;
}

/** @type {IndexedObject<boolean>} */
const standardBooleanAttributes = {
  checked: true,
  defer: true,
  disabled: true,
  hidden: true,
  ismap: true,
  multiple: true,
  noresize: true,
  readonly: true,
  selected: true,
};

/**
 * Miscellaneous DOM helpers for web components
 *
 * @module dom
 */

const mousedownListenerKey = Symbol("mousedownListener");

/**
 * Return the closest focusable node that's either the node itself (if it's
 * focusable), or the closest focusable ancestor in the *composed* tree.
 *
 * If no focusable node is found, this returns null.
 *
 * @param {Node} node
 * @returns {HTMLElement|null}
 */
function closestFocusableNode(node) {
  for (const current of selfAndComposedAncestors(node)) {
    // If the current element defines a focusTarget (e.g., via
    // DelegateFocusMixin), use that, otherwise use the element itself.
    const target = current[focusTarget$1] || current;
    // We want an element that has a tabIndex of 0 or more. We ignore disabled
    // elements, and slot elements (which oddly have a tabIndex of 0).
    /** @type {any} */ const cast = target;
    const focusable =
      target instanceof HTMLElement &&
      target.tabIndex >= 0 &&
      !cast.disabled &&
      !(target instanceof HTMLSlotElement);
    if (focusable) {
      return target;
    }
  }
  return null;
}

/**
 * Return the ancestors of the given node in the composed tree.
 *
 * In the composed tree, the ancestor of a node assigned to a slot is that slot,
 * not the node's DOM ancestor. The ancestor of a shadow root is its host.
 *
 * @param {Node} node
 * @returns {Iterable<Node>}
 */
function* composedAncestors(node) {
  /** @type {Node|null} */
  let current = node;
  while (true) {
    current =
      current instanceof HTMLElement && current.assignedSlot
        ? current.assignedSlot
        : current instanceof ShadowRoot
        ? current.host
        : current.parentNode;
    if (current) {
      yield current;
    } else {
      break;
    }
  }
}

/**
 * Returns true if the first node contains the second, even if the second node
 * is in a shadow tree.
 *
 * The standard Node.contains() function does not account for Shadow DOM, and
 * returns false if the supplied target node is sitting inside a shadow tree
 * within the container.
 *
 * @param {Node} container - The container to search within.
 * @param {Node} target - The node that may be inside the container.
 * @returns {boolean} - True if the container contains the target node.
 */
function deepContains(container, target) {
  /** @type {any} */
  let current = target;
  while (current) {
    const parent = current.assignedSlot || current.parentNode || current.host;
    if (parent === container) {
      return true;
    }
    current = parent;
  }
  return false;
}

/**
 * Return the first focusable element in the composed tree below the given root.
 * The composed tree includes nodes assigned to slots.
 *
 * This heuristic considers only the document order of the elements below the
 * root and whether a given element is focusable. It currently does not respect
 * the tab sort order defined by tabindex values greater than zero.
 *
 * @param {Node} root - the root of the tree in which to search
 * @returns {HTMLElement|null} - the first focusable element, or null if none
 * was found
 */
function firstFocusableElement(root) {
  // CSS selectors for focusable elements from
  // https://stackoverflow.com/a/30753870/76472
  const focusableQuery =
    'a[href],area[href],button:not([disabled]),details,iframe,input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[contentEditable="true"],[tabindex]';
  // Walk the tree looking for nodes that match the above selectors.
  const walker = walkComposedTree(
    root,
    (/** @type {Node} */ node) =>
      node instanceof HTMLElement &&
      node.matches(focusableQuery) &&
      node.tabIndex >= 0
  );
  // We only actually need the first matching value.
  const { value } = walker.next();
  // value, if defined, will always be an HTMLElement, but we do the following
  // check to pass static type checking.
  return value instanceof HTMLElement ? value : null;
}

/**
 * Trap any `mousedown` events on the `origin` element and prevent the default
 * behavior from setting the focus on that element. Instead, put the focus on
 * the `target` element (or, if the `target` is not focusable, on the target's
 * closest focusable ancestor).
 *
 * If this method is called again with the same `origin` element, the old
 * forwarding is overridden, and focus will now go to the new `target` element.
 *
 * If the `target` parameter is `null`, focus handling will be removed from the
 * indicated `origin`.
 *
 * @param {HTMLElement} origin
 * @param {HTMLElement|null} target
 */
function forwardFocus(origin, target) {
  if (origin[mousedownListenerKey]) {
    // Origin was previously forwarding focus, probably to a different target.
    // Remove the previous event listener.
    origin.removeEventListener("mousedown", origin[mousedownListenerKey]);
  }
  if (target) {
    origin[mousedownListenerKey] = (/** @type {MouseEvent} */ event) => {
      // Only process events for the main (usually left) button.
      if (event.button !== 0) {
        return;
      }
      // What element wants the focus?
      const desiredTarget = target[focusTarget$1] || target;
      // What ancestor can actually take the focus?
      const focusableTarget = closestFocusableNode(desiredTarget);
      if (focusableTarget) {
        focusableTarget.focus();
        event.preventDefault();
      }
    };
    origin.addEventListener("mousedown", origin[mousedownListenerKey]);
  }
}

/**
 * Search a list element for the item that contains the specified target.
 *
 * When dealing with UI events (e.g., mouse clicks) that may occur in
 * subelements inside a list item, you can use this routine to obtain the
 * containing list item.
 *
 * @param {NodeList|Node[]} items - A list element containing a set of items
 * @param {Node} target - A target element that may or may not be an item in the
 * list.
 * @returns {number} - The index of the list child that is or contains the
 * indicated target node. Returns -1 if not found.
 */
function indexOfItemContainingTarget(items, target) {
  return Array.prototype.findIndex.call(
    items,
    (/** @type Node */ item) => item === target || deepContains(item, target)
  );
}

/**
 * Returns the set that includes the given node and all of its ancestors in the
 * composed tree. See [composedAncestors](#composedAncestors) for details on the
 * latter.
 *
 * @param {Node} node
 * @returns {Iterable<Node>}
 */
function* selfAndComposedAncestors(node) {
  if (node) {
    yield node;
    yield* composedAncestors(node);
  }
}

/**
 * Set an internal state for browsers that support custom state pseudo classes,
 * as well as an attribute of the same name to permit state-based styling on
 * older browsers.
 *
 * When all browsers support custom state pseudo classes, we'd like to deprecate
 * use of attributes.
 *
 * @param {Element} element
 * @param {string} name
 * @param {boolean} value
 */
function setInternalState(element, name, value) {
  element.toggleAttribute(name, value);
  if (element[nativeInternals$1] && element[nativeInternals$1].states) {
    const states = element[nativeInternals$1].states;
    const stateName = `--${name}`;
    if (value) {
      states.add(stateName);
    } else {
      states.delete(stateName);
    }
  }
}

/**
 * Adds or removes the element's `childNodes` as necessary to match the nodes
 * indicated in the `childNodes` parameter.
 *
 * This operation is useful in cases where you maintain your own set of nodes
 * which should be rendered as the children of some element. When you insert or
 * remove nodes in that set, you can invoke this function to efficiently apply
 * the new set as a delta to the existing children. Only the items in the set
 * that have actually changed will be added or removed.
 *
 * @param {Element} element - the element to update
 * @param {(NodeList|Node[])} childNodes - the set of nodes to apply
 */
function updateChildNodes(element, childNodes) {
  // If the childNodes parameter is the actual childNodes of an element, then as
  // we append those nodes to the indicated target element, they'll get removed
  // from the original set. To keep the list stable, we make a copy.
  const copy = [...childNodes];

  const oldLength = element.childNodes.length;
  const newLength = copy.length;
  const length = Math.max(oldLength, newLength);
  for (let i = 0; i < length; i++) {
    const oldChild = element.childNodes[i];
    const newChild = copy[i];
    if (i >= oldLength) {
      // Add new item not in old set.
      element.append(newChild);
    } else if (i >= newLength) {
      // Remove old item past end of new set.
      element.removeChild(element.childNodes[newLength]);
    } else if (oldChild !== newChild) {
      if (copy.indexOf(oldChild, i) >= i) {
        // Old node comes later in final set. Insert the new node rather than
        // replacing it so that we don't detach the old node only to have to
        // reattach it later.
        element.insertBefore(newChild, oldChild);
      } else {
        // Replace old item with new item.
        element.replaceChild(newChild, oldChild);
      }
    }
  }
}

/**
 * Walk the composed tree at the root for elements that pass the given filter.
 *
 * Note: the jsDoc types required for the filter function are too complex for
 * the current jsDoc parser to support strong type-checking.
 *
 * @private
 * @param {Node} node
 * @param {function} filter
 * @returns {IterableIterator<Node>}
 */
function* walkComposedTree(node, filter) {
  if (filter(node)) {
    yield node;
  }
  let children;
  if (node instanceof HTMLElement && node.shadowRoot) {
    // Walk the shadow instead of the light DOM.
    children = node.shadowRoot.children;
  } else {
    const assignedNodes =
      node instanceof HTMLSlotElement
        ? node.assignedNodes({ flatten: true })
        : [];
    children =
      assignedNodes.length > 0
        ? // Walk light DOM nodes assigned to this slot.
          assignedNodes
        : // Walk light DOM children.
          node.childNodes;
  }
  if (children) {
    for (let i = 0; i < children.length; i++) {
      yield* walkComposedTree(children[i], filter);
    }
  }
}

/**
 * JavaScript template literals for constructing DOM nodes from HTML
 *
 * @module html
 */

/**
 * A JavaScript template string literal that returns an HTML document fragment.
 *
 * Example:
 *
 *     const fragment = fragmentFrom.html`Hello, <em>world</em>.`
 *
 * returns a `DocumentFragment` whose `innerHTML` is `Hello, <em>world</em>.`
 *
 * This function is called `html` so that it can be easily used with HTML
 * syntax-highlighting extensions for various popular code editors.
 *
 * See also [templateFrom.html](template#html), which returns a similar result but
 * as an HTMLTemplateElement.
 *
 * @param {TemplateStringsArray} strings - the strings passed to the JavaScript template
 * literal
 * @param {string[]} substitutions - the variable values passed to the
 * JavaScript template literal
 * @returns {DocumentFragment}
 */
const fragmentFrom = {
  html(strings, ...substitutions) {
    return templateFrom.html(strings, ...substitutions).content;
  },
};

/**
 * A JavaScript template string literal that returns an HTML template.
 *
 * Example:
 *
 *     const myTemplate = templateFrom.html`Hello, <em>world</em>.`
 *
 * returns an `HTMLTemplateElement` whose `innerHTML` is `Hello, <em>world</em>.`
 *
 * This function is called `html` so that it can be easily used with HTML
 * syntax-highlighting extensions for various popular code editors.
 *
 * See also [html](html), a helper which returns a similar result but as an
 * DocumentFragment.
 *
 * @param {TemplateStringsArray} strings - the strings passed to the JavaScript template
 * literal
 * @param {string[]} substitutions - the variable values passed to the
 * JavaScript template literal
 * @returns {HTMLTemplateElement}
 */
const templateFrom = {
  html(strings, ...substitutions) {
    const template = document.createElement("template");
    template.innerHTML = String.raw(strings, ...substitutions);
    return template;
  },
};

/** @type {any} */
const stateKey = Symbol("state");
/** @type {any} */
const raiseChangeEventsInNextRenderKey = Symbol(
  "raiseChangeEventsInNextRender"
);
// Tracks total set of changes made to elements since their last render.
/** @type {any} */
const changedSinceLastRenderKey = Symbol("changedSinceLastRender");

/**
 * Manages component state and renders changes in state
 *
 * This is modeled after React/Preact's state management, and is adapted for
 * use with web components. Applying this mixin to a component will give it
 * FRP behavior comparable to React's.
 *
 * This model is very basic. It's key aspects are:
 * * an immutable `state` property updated via `setState` calls.
 * * a `render` method that will be invoked asynchronously when state changes.
 *
 * @module ReactiveMixin
 * @param {Constructor<CustomElement>} Base
 */
function ReactiveMixin(Base) {
  class Reactive extends Base {
    constructor() {
      super();

      // Components can inspect `firstRender` during rendering to do special
      // work the first time (like wire up event handlers). Until the first
      // render actually happens, we set that flag to be undefined so we have a
      // way of distinguishing between a component that has never rendered and
      // one that is being rendered for the nth time.
      this[firstRender$1] = undefined;

      // We want to support the standard HTML pattern of only raising events in
      // response to direct user interactions. For a detailed discussion of this
      // point, see the Gold Standard checklist item for [Propery Change
      // Events](https://github.com/webcomponents/gold-standard/wiki/Property%20Change%20Events).
      //
      // To support this pattern, we define a flag indicating whether change
      // events should be raised. By default, we want the flag to be false. In
      // UI event handlers, a component can temporarily set the flag to true. If
      // a setState call is made while the flag is true, then that fact will be
      // remembered and passed the subsequent render/rendered methods. That will
      // let the methods know whether they should raise property change events.
      this[raiseChangeEvents$1] = false;

      // Maintain a change log of all fields which have changed since the
      // component was last rendered.
      this[changedSinceLastRenderKey] = null;

      // Set the initial state from the default state defined by the component
      // and its mixins/base classes.
      this[setState$1](this[defaultState$1]);
    }

    // When the component is attached to the document (or upgraded), we will
    // generally render the component for the first time. That operation will
    // include rendering of the default state and any state changes that
    // happened between constructor time and this connectedCallback.
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      // Render the component.
      //
      // If the component was forced to render before this point, and the state
      // hasn't changed, this call will be a no-op.
      this[renderChanges$1]();
    }

    /**
     * The default state for the component. This can be extended by mixins and
     * classes to provide additional default state.
     *
     * @type {PlainObject}
     */
    // @ts-ignore
    get [defaultState$1]() {
      // Defer to base implementation if defined.
      return super[defaultState$1] || {};
    }

    /**
     * Render the indicated changes in state to the DOM.
     *
     * The default implementation of this method does nothing. Override this
     * method in your component to update your component's host element and
     * any shadow elements to reflect the component's new state. See the
     * [rendering example](ReactiveMixin#rendering).
     *
     * Be sure to call `super` in your method implementation so that your
     * component's base classes and mixins have a chance to perform their own
     * render work.
     *
     * @param {ChangedFlags} changed - dictionary of flags indicating which state
     * members have changed since the last render
     */
    [render$1](changed) {
      if (super[render$1]) {
        super[render$1](changed);
      }
    }

    /**
     * Render any pending component changes to the DOM.
     *
     * This method does nothing if the state has not changed since the last
     * render call.
     *
     * ReactiveMixin will invoke this method following a `setState` call;
     * you should not need to invoke this method yourself.
     *
     * This method invokes the internal `render` method, then invokes the
     * `rendered` method.
     */
    [renderChanges$1]() {
      if (this[firstRender$1] === undefined) {
        // First render.
        this[firstRender$1] = true;
      }

      // Get the log of which fields have changed since the last render.
      const changed = this[changedSinceLastRenderKey];

      // We only render if this is the first render, or state has changed since
      // the last render.
      if (this[firstRender$1] || changed) {
        // If at least one of the[setState] calls was made in response
        // to user interaction or some other component-internal event, set the
        // raiseChangeEvents flag so that render/rendered methods know whether
        // to raise property change events. See the comments in the component
        // constructor where we initialize this flag for details.
        const saveRaiseChangeEvents = this[raiseChangeEvents$1];
        this[raiseChangeEvents$1] = this[raiseChangeEventsInNextRenderKey];

        // From this point on, we'll assume we won't need to raise events in the
        // next render. If raiseChangeEvents is true right now, however, and the
        // rendered method calls setState, then this flag will be set to true
        // for the next render. That's apporopriate because the second-order
        // setState call in rendered still counts as a user-initiated effect
        // that should raise change events.
        this[raiseChangeEventsInNextRenderKey] = false;

        // We set a flag to indicate that rendering is happening. The component
        // may use this to avoid triggering other updates during the render.
        this[rendering$1] = true;

        // Invoke any internal render implementations.
        this[render$1](changed);

        this[rendering$1] = false;

        // Since we've now rendered all changes, clear the change log. If other
        // async render calls are queued up behind this call, they'll see an
        // empty change log, and so skip unnecessary render work.
        this[changedSinceLastRenderKey] = null;

        // Let the component know it was rendered.
        this[rendered$1](changed);

        // We've now rendered for the first time.
        this[firstRender$1] = false;

        // Restore state of event flag.
        this[raiseChangeEvents$1] = saveRaiseChangeEvents;
      }
    }

    /**
     * Perform any work that must happen after state changes have been rendered
     * to the DOM.
     *
     * The default implementation of this method does nothing. Override this
     * method in your component to perform work that requires the component to
     * be fully rendered, such as setting focus on a shadow element or
     * inspecting the computed style of an element. If such work should result
     * in a change in component state, you can safely call `setState` during the
     * `rendered` method.
     *
     * Be sure to call `super` in your method implementation so that your
     * component's base classes and mixins have a chance to perform their own
     * post-render work.
     *
     * @param {ChangedFlags} changed
     */
    [rendered$1](changed) {
      if (super[rendered$1]) {
        super[rendered$1](changed);
      }
    }

    /**
     * Update the component's state by merging the specified changes on
     * top of the existing state. If the component is connected to the document,
     * and the new state has changed, this returns a promise to asynchronously
     * render the component. Otherwise, this returns a resolved promise.
     *
     * @param {PlainObject} changes - the changes to apply to the element's state
     * @returns {Promise} - resolves when the new state has been rendered
     */
    async [setState$1](changes) {
      // There's no good reason to have a render method update state.
      if (this[rendering$1]) {
        /* eslint-disable no-console */
        console.warn(
          `${this.constructor.name} called [setState] during rendering, which you should avoid.\nSee https://elix.org/documentation/ReactiveMixin.`
        );
      }

      // Apply the changes to a copy of the component's current state to produce
      // a new, updated state and a dictionary of flags indicating which fields
      // actually changed.
      const { state, changed } = copyStateWithChanges(this, changes);

      // We only need to apply the changes to the component state if: a) the
      // current state is undefined (this is the first time setState has been
      // called), or b) the supplied changes parameter actually contains
      // substantive changes.
      if (this[stateKey] && Object.keys(changed).length === 0) {
        // No need to update state.
        return;
      }

      // Freeze the new state so it's immutable. This prevents accidental
      // attempts to set state without going through setState.
      Object.freeze(state);

      // Set this as the component's new state.
      this[stateKey] = state;

      // If setState was called with the raiseChangeEvents flag set, record that
      // fact for use in rendering. See the comments in the component
      // constructor for details.
      if (this[raiseChangeEvents$1]) {
        this[raiseChangeEventsInNextRenderKey] = true;
      }

      // Look to see whether the component is already set up to render.
      const willRender =
        this[firstRender$1] === undefined ||
        this[changedSinceLastRenderKey] !== null;

      // Add this round of changed fields to the complete log of fields that
      // have changed since the component was last rendered.
      this[changedSinceLastRenderKey] = Object.assign(
        this[changedSinceLastRenderKey] || {},
        changed
      );

      // We only need to queue a render if we're in the document and a render
      // operation hasn't already been queued for this component. If we're not
      // in the document yet, when the component is eventually added to the
      // document, the connectedCallback will ensure we render at that point.
      const needsRender = this.isConnected && !willRender;
      if (needsRender) {
        // Yield with promise timing. This lets any *synchronous* setState calls
        // that happen after this current setState call complete first. Their
        // effects on the state will be batched up, and accumulate in the change
        // log stored under this[changedSinceLastRenderKey].
        await Promise.resolve();

        // Now that the above promise has resolved, render the component. By the
        // time this line is reached, the complete log of batched changes can be
        // applied in a single render call.
        this[renderChanges$1]();
      }
    }

    /**
     * The component's current state.
     *
     * The returned state object is immutable. To update it, invoke
     * `internal.setState`.
     *
     * It's extremely useful to be able to inspect component state while
     * debugging. If you append `?elixdebug=true` to a page's URL, then
     * ReactiveMixin will conditionally expose a public `state` property that
     * returns the component's state. You can then access the state in your
     * browser's debug console.
     *
     * @type {PlainObject}
     */
    get [state$1]() {
      return this[stateKey];
    }

    /**
     * Ask the component whether a state with a set of recently-changed fields
     * implies that additional second-order changes should be applied to that
     * state to make it consistent.
     *
     * This method is invoked during a call to `internal.setState` to give all
     * of a component's mixins and classes a chance to respond to changes in
     * state. If one mixin/class updates state that it controls, another
     * mixin/class may want to respond by updating some other state member that
     * *it* controls.
     *
     * This method should return a dictionary of changes that should be applied
     * to the state. If the dictionary object is not empty, the
     * `internal.setState` method will apply the changes to the state, and
     * invoke this `stateEffects` method again to determine whether there are
     * any third-order effects that should be applied. This process repeats
     * until all mixins/classes report that they have no additional changes to
     * make.
     *
     * See an example of how `ReactiveMixin` invokes the `stateEffects` to
     * [ensure state consistency](ReactiveMixin#ensuring-state-consistency).
     *
     * @param {PlainObject} state - a proposal for a new state
     * @param {ChangedFlags} changed - the set of fields changed in this
     * latest proposal for the new state
     * @returns {PlainObject}
     */
    [stateEffects$1](state, changed) {
      return super[stateEffects$1] ? super[stateEffects$1](state, changed) : {};
    }
  }

  // Expose state when debugging; see note for `[state]` getter.
  const elixdebug = new URLSearchParams(location.search).get("elixdebug");
  if (elixdebug === "true") {
    Object.defineProperty(Reactive.prototype, "state", {
      get() {
        return this[state$1];
      },
    });
  }

  return Reactive;
}

/**
 * Create a copy of the component's state with the indicated changes applied.
 * Ask the component whether the new state implies any second-order effects. If
 * so, apply those and loop again until the state has stabilized. Return the new
 * state and a dictionary of flags indicating which fields were actually
 * changed.
 *
 * @private
 * @param {Element} element
 * @param {PlainObject} changes
 */
function copyStateWithChanges(element, changes) {
  // Start with a copy of the current state.
  /** @type {PlainObject} */
  const state = Object.assign({}, element[stateKey]);
  /** @type {ChangedFlags} */
  const changed = {};
  // Take the supplied changes as the first round of effects.
  let effects = changes;
  // Loop until there are no effects to apply.
  /* eslint-disable no-constant-condition */
  while (true) {
    // See whether the effects actually changed anything in state.
    const changedByEffects = fieldsChanged(state, effects);
    if (Object.keys(changedByEffects).length === 0) {
      // No more effects to apply; we're done.
      break;
    }
    // Apply the effects.
    Object.assign(state, effects);
    Object.assign(changed, changedByEffects);
    // Ask the component if there are any second- (or third-, etc.) order
    // effects that should be applied.
    effects = element[stateEffects$1](state, changedByEffects);
  }
  return { state, changed };
}

/**
 * Return true if the two values are equal.
 *
 * @private
 * @param {any} value1
 * @param {any} value2
 * @returns {boolean}
 */
function equal(value1, value2) {
  if (value1 instanceof Date && value2 instanceof Date) {
    return value1.getTime() === value2.getTime();
  }
  return value1 === value2;
}

/**
 * Return a dictionary of flags indicating which of the indicated changes to the
 * state are actually substantive changes.
 *
 * @private
 * @param {PlainObject} state
 * @param {PlainObject} changes
 */
function fieldsChanged(state, changes) {
  /** @type {ChangedFlags} */
  const changed = {};
  for (const field in changes) {
    if (!equal(changes[field], state[field])) {
      changed[field] = true;
    }
  }
  return changed;
}

// A cache of processed templates, indexed by element class.
const classTemplateMap = new Map();

// A Proxy that maps shadow element IDs to shadow elements.
// This will be return as the element's `this[ids]` property;
// see comments in that property below.
/** @type {any} */
const shadowIdProxyKey = Symbol("shadowIdProxy");

// A reference stored on the shadow element proxy target to get to the actual
// element. We use a Symbol here instead of a string name to avoid naming
// conflicts with the element's internal shadow element IDs.
const proxyElementKey = Symbol("proxyElement");

// A handler used for the shadow element ID proxy.
const shadowIdProxyHandler = {
  get(target, id) {
    // From this proxy, obtain a reference to the original component.
    const element = target[proxyElementKey];

    // Get a reference to the component's open or closed shadow root.
    const root = element[shadowRoot$1];

    // Look for a shadow element with the indicated ID.
    return root && typeof id === "string" ? root.getElementById(id) : null;
  },
};

/**
 * Stamps a template into a component's Shadow DOM when instantiated
 *
 * To use this mixin, define a `template` method that returns a string or HTML
 * `<template>` element:
 *
 *     import { createElement, replace, transmute } from 'elix/src/template.js';
 *
 *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
 *       get [template]() {
 *         return templateFrom.html`Hello, <em>world</em>.`;
 *       }
 *     }
 *
 * When your component class is instantiated, a shadow root will be created on
 * the instance, and the contents of the template will be cloned into the
 * shadow root. If your component does not define a `template` method, this
 * mixin has no effect.
 *
 * This adds a member on the component called `this[ids]` that can be used to
 * reference shadow elements with IDs. E.g., if component's shadow contains an
 * element `<button id="foo">`, then this mixin will create a member
 * `this[ids].foo` that points to that button.
 *
 * @module ShadowTemplateMixin
 * @param {Constructor<HTMLElement>} Base
 */
function ShadowTemplateMixin(Base) {
  // The class prototype added by the mixin.
  class ShadowTemplate extends Base {
    /**
     * A convenient shortcut for looking up an element by ID in the component's
     * Shadow DOM subtree.
     *
     * Example: if component's template contains a shadow element `<button
     * id="foo">`, you can use the reference `this[ids].foo` to obtain
     * the corresponding button in the component instance's shadow tree. The
     * `ids` property is simply a shorthand for `getElementById`, so
     * `this[ids].foo` is the same as
     * `this[shadowRoot].getElementById('foo')`.
     *
     * @type {object} - a dictionary mapping shadow element IDs to elements
     */
    get [ids$1]() {
      if (!this[shadowIdProxyKey]) {
        // Construct a proxy that maps to getElementById.
        const target = {
          // Give the proxy a means of refering to this element via the target.
          [proxyElementKey]: this,
        };
        this[shadowIdProxyKey] = new Proxy(target, shadowIdProxyHandler);
      }
      return this[shadowIdProxyKey];
    }

    /*
     * If the component defines a template, a shadow root will be created on the
     * component instance, and the template stamped into it.
     */
    [render$1](/** @type {ChangedFlags} */ changed) {
      if (super[render$1]) {
        super[render$1](changed);
      }

      // We populate the shadow root if the component doesn't have a shadow;
      // i.e., the first time the component is rendered. For this check, we use
      // an internal reference we maintain for the shadow root; see below.
      if (this[shadowRoot$1] === undefined) {
        // If this type of element defines a template, prepare it for use.
        const template = getTemplate(this);

        if (template) {
          // Stamp the template into a new shadow root.
          const root = this.attachShadow({
            delegatesFocus: this[delegatesFocus$1],
            mode: this[shadowRootMode$1],
          });
          const clone = document.importNode(template.content, true);
          root.append(clone);

          // After this call, we won't be able to rely on being able to access
          // the shadow root via `this.shadowRoot`, because the component may
          // have asked for a closed shadow root. We save a reference to the
          // shadow root now so that the component always has a consistent means
          // to reference its own shadow root.
          this[shadowRoot$1] = root;
        } else {
          // No template. Set shadow root to null (instead of undefined) so we
          // won't try to render shadow on next render.
          // @ts-ignore Not sure why/how TS has type info on this[shadowRoot].
          this[shadowRoot$1] = null;
        }
      }
    }

    /**
     * @type {ShadowRootMode}
     * @default "open"
     */
    get [shadowRootMode$1]() {
      return "open";
    }
  }

  return ShadowTemplate;
}

/**
 * Return the template for the element being instantiated.
 *
 * If this is the first time we're creating this type of element, or the
 * component has indicated that its template is dynamic (and should be retrieved
 * each time), ask the component class for the template and cache the result.
 * Otherwise, immediately return the cached template.
 *
 * @private
 * @param {HTMLElement} element
 * @returns {HTMLTemplateElement}
 */
function getTemplate(element) {
  let t = element[hasDynamicTemplate$1]
    ? undefined // Always retrieve template
    : classTemplateMap.get(element.constructor); // See if we've cached it
  if (t === undefined) {
    // Ask the component for its template.
    t = element[template$1];
    // A component using this mixin isn't required to supply a template --
    // if they don't, they simply won't end up with a shadow root.
    if (t) {
      // But if the component does supply a template, it needs to be an
      // HTMLTemplateElement instance.
      if (!(t instanceof HTMLTemplateElement)) {
        throw `Warning: the [template] property for ${element.constructor.name} must return an HTMLTemplateElement.`;
      }
    }
    if (!element[hasDynamicTemplate$1]) {
      // Store prepared template for next creation of same type of element.
      // If the component didn't define a template, store null so that we skip
      // the template retrieval next time.
      classTemplateMap.set(element.constructor, t || null);
    }
  }
  return t;
}

/**
 * General-purpose base for writing components in functional-reactive style
 *
 * This base class lets you create web components in a functional-reactive
 * programming (FRP) style. It simply bundles a small set of mixins:
 *
 *     const ReactiveElement =
 *       AttributeMarshallingMixin(
 *       ReactiveMixin(
 *       ShadowTemplateMixin(
 *         HTMLElement
 *       )))));
 *
 * `ReactiveElement` is provided as a convenience. You can achieve the same
 * result by applying the mixins yourself to `HTMLElement`.
 *
 * @inherits HTMLElement
 * @mixes AttributeMarshallingMixin
 * @mixes ReactiveMixin
 * @mixes ShadowTemplateMixin
 */
const ReactiveElement = AttributeMarshallingMixin(
  ReactiveMixin(ShadowTemplateMixin(HTMLElement))
);

/**
 * Helpers related to universal accessibility
 *
 * Universal accessibility is a core goal of the Elix project. These helpers are
 * used by mixins like [AriaListMixin](AriaListMixin) and
 * [AriaMenuMixin](AriaMenuMixin) to support accessibility via ARIA.
 *
 * @module accessibility
 */

// Used by ensureId
const generatedIdKey = Symbol("generatedId");
let generatedIdCount = 0;

/**
 * A dictionary mapping built-in HTML elements to their default ARIA role.
 *
 * Example: `defaultAriaRole.ol` returns "list", since the default ARIA role
 * for an `ol` (ordered list) element is "list".
 */
const defaultAriaRole = {
  a: "link",
  article: "region",
  button: "button",
  h1: "sectionhead",
  h2: "sectionhead",
  h3: "sectionhead",
  h4: "sectionhead",
  h5: "sectionhead",
  h6: "sectionhead",
  hr: "sectionhead",
  iframe: "region",
  link: "link",
  menu: "menu",
  ol: "list",
  option: "option",
  output: "liveregion",
  progress: "progressbar",
  select: "select",
  table: "table",
  td: "td",
  textarea: "textbox",
  th: "th",
  ul: "list",
};

/**
 * If the given element already has an ID, return it. If not, generate a
 * previously unused ID and return that.
 *
 * @param {Element} element
 * @returns {string}
 */
function ensureId(element) {
  let id = element.id || element[generatedIdKey];
  if (!id) {
    id = `_id${generatedIdCount++}`;
    // Remember that we generated an ID for this element.
    element[generatedIdKey] = id;
  }
  return id;
}

/**
 * Collection of shared Symbol objects for internal component communication.
 *
 * The shared `Symbol` objects in this module let mixins and a component
 * internally communicate without exposing these internal properties and methods
 * in the component's public API. They also help avoid unintentional name
 * collisions, as a component developer must specifically import the `internal`
 * module and reference one of its symbols.
 *
 * To use these `Symbol` objects in your own component, include this module and
 * then create a property or method whose key is the desired Symbol. E.g.,
 * [ShadowTemplateMixin](ShadowTemplateMixin) expects a component to define
 * a property called [template](#template):
 *
 *     import { template } from 'elix/src/core/internal.js';
 *     import { templateFrom } from 'elix/src/core/htmlLiterals.js'
 *     import ShadowTemplateMixin from 'elix/src/core/ShadowTemplateMixin.js';
 *
 *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
 *       [template]() {
 *         return templateFrom.html`Hello, <em>world</em>.`;
 *       }
 *     }
 *
 * The above use of the internal `template` member lets the mixin find the
 * component's template in a way that will not pollute the component's public
 * API or interfere with other component logic. For example, if for some reason
 * the component wants to define a separate property with the plain string name,
 * "template", it can do so without affecting the above property setter.
 *
 * @module internal
 */

/**
 * Symbol for the `checkSize` method.
 *
 * If defined, this method will be invoked by [ResizeMixin](ResizeMixin)
 * when an element's size may have changed. The default implementation of
 * this method compares the element's current `clientHeight` and `clientWidth`
 * properties against the last known values of those properties (saved in
 * `state.clienHeight` and `state.clientWidth`).
 *
 * Components should override this method if they contain elements that may need
 * to know about size changes as well. For example, when an [Overlay](Overlay)
 * mixin opens, it invokes this method on any content elements that define it.
 * This gives the contents a chance to resize in response to being displayed.
 */
const checkSize = Symbol("checkSize");

/**
 * Symbol for the `closestAvailableItemIndex` method.
 *
 * This method is defined by [ItemsCursorMixin](ItemsCursorMixin). You can call
 * this if you want to find an item at a particular location, but may need to
 * account for the fact that the item at that position is not available, and
 * would like to find the closest item that is available.
 */
const closestAvailableItemIndex = Symbol("closestAvailableItemIndex");

/**
 * Symbol for the `contentSlot` property.
 *
 * [SlotContentMixin](SlotContentMixin) uses this to identify which slot
 * element in the component's shadow tree that holds the component's content.
 * By default, this is the first slot element with no "name" attribute. You
 * can override this to return a different slot.
 */
const contentSlot = Symbol("contentSlot");

/**
 * The default state for this element.
 */
const defaultState = defaultState$1;

/**
 * Symbol for the `defaultTabIndex` property.
 *
 * [KeyboardMixin](KeyboardMixin) uses this if it is unable to successfully
 * parse a string tabindex attribute.
 */
const defaultTabIndex = Symbol("defaultTabIndex");

/**
 * Symbol for the `delegatesFocus` property.
 *
 * [DelegatesFocusMixin](DelegatesFocusMixin) defines this property, returning
 * true to indicate that the focus is being delegated, even in browsers that
 * don't support that natively. Mixins like [KeyboardMixin](KeyboardMixin) use
 * this to accommodate focus delegation.
 */
const delegatesFocus = delegatesFocus$1;

/**
 * Symbol for the `effectEndTarget` property.
 *
 * [TransitionEffectMixin](TransitionEffectMixin) inspects this property to
 * determine which element's `transitionend` event will signal the end of a
 * transition effect.
 */
const effectEndTarget = Symbol("effectEndTarget");

/**
 * Symbol for the `firstRender` property.
 *
 * [ReactiveMixin](ReactiveMixin) sets the property to `true` during the
 * element's first `connectedCallback`, then `false` in subsequent callbacks.
 *
 * You can inspect this property in your own `connectedCallback` handler
 * to do work like wiring up events that should only happen once.
 */
const firstRender = firstRender$1;

/**
 * Symbol for the `focusTarget` property.
 *
 * [DelegatesFocusMixin](DelegatesFocusMixin) defines this property as either:
 * 1) the element itself, in browsers that support native focus delegation or,
 * 2) the shadow root's first focusable element.
 */
const focusTarget = focusTarget$1;

/**
 * Symbol for the `getItemText` method.
 *
 * This method can be applied to an item to return its text.
 * [KeyboardPrefixCursorMixin](KeyboardPrefixCursorMixin) uses this to
 * obtain the text for each item in a list, then matches keypresses again that
 * text.
 *
 * This method takes a single parameter: the `HTMLElement` of the item from
 * which text should be extracted.
 */
const getItemText = Symbol("getItemText");

/**
 * Symbol for the `goDown` method.
 *
 * This method is invoked when the user wants to go/navigate down.
 */
const goDown = Symbol("goDown");

/**
 * Symbol for the `goEnd` method.
 *
 * This method is invoked when the user wants to go/navigate to the end (e.g.,
 * of a list).
 */
const goEnd = Symbol("goEnd");

/**
 * Symbol for the `goFirst` method.
 *
 * This method is invoked when the user wants to go to the first item in a list.
 */
const goFirst = Symbol("goFirst");

/**
 * Symbol for the `goLast` method.
 *
 * This method is invoked when the user wants to go to the last item in a list.
 */
const goLast = Symbol("goLast");

/**
 * Symbol for the `goLeft` method.
 *
 * This method is invoked when the user wants to go/navigate left. Mixins that
 * make use of this method include
 * [KeyboardDirectionMixin](KeyboardDirectionMixin) and
 * [SwipeDirectionMixin](SwipeDirectionMixin).
 */
const goLeft = Symbol("goLeft");

/**
 * Symbol for the `goNext` method.
 *
 * This method is invoked when the user wants to go/navigate to the next item.
 */
const goNext = Symbol("goNext");

/**
 * Symbol for the `goPrevious` method.
 *
 * This method is invoked when the user wants to go/navigate to the previous item.
 */
const goPrevious = Symbol("goPrevious");

/**
 * Symbol for the `goRight` method.
 *
 * This method is invoked when the user wants to go/navigate right. Mixins
 * that make use of this method include
 * [KeyboardDirectionMixin](KeyboardDirectionMixin) and
 * [SwipeDirectionMixin](SwipeDirectionMixin).
 */
const goRight = Symbol("goRight");

/**
 * Symbol for the `goStart` method.
 *
 * This method is invoked when the user wants to go/navigate to the start
 * (e.g., of a list).
 */
const goStart = Symbol("goStart");

/**
 * Symbol for the `goToItemWithPrefix` method.
 *
 * This method is invoked by
 * [KeyboardPrefixCursorMixin](KeyboardPrefixCursorMixin) when the user types
 * text characters.
 */
const goToItemWithPrefix = Symbol("goToItemWithPrefix");

/**
 * Symbol for the `goUp` method.
 *
 * This method is invoked when the user wants to go/navigate up.
 */
const goUp = Symbol("goUp");

/**
 * Symbol for the `hasDynamicTemplate` property.
 *
 * If your component class does not always use the same template, define a
 * static class property getter with this symbol and have it return `true`.
 * This will disable template caching for your component.
 */
const hasDynamicTemplate = hasDynamicTemplate$1;

/**
 * Symbol for the `ids` property.
 *
 * [ShadowTemplateMixin](ShadowTemplateMixin) defines a shorthand function
 * `internal.ids` that can be used to obtain a reference to a shadow element with
 * a given ID.
 *
 * Example: if component's template contains a shadow element
 * `<button id="foo">`, you can use the reference `this[ids].foo` to obtain
 * the corresponding button in the component instance's shadow tree.
 * The `ids` function is simply a shorthand for `getElementById`, so
 * `this[ids].foo` is the same as `this.shadowRoot.getElementById('foo')`.
 */
const ids = ids$1;

/**
 * Symbol for the `inputDelegate` property.
 *
 * [DelegateInputSelectionMixin](DelegateInputSelectionMixin) uses this property
 * to indicate which shadow element is the input-type element to which text
 * selection methods and properties should be delegated.
 */
const inputDelegate = Symbol("inputDelegate");

/**
 * Symbol for the `itemsDelegate` property.
 *
 * A component using [DelegateItemsMixin](DelegateItemsMixin) uses this property
 * to indicate which one of its shadow elements is the one whose `items`
 * property will be treated as the component's own `items`.
 */
const itemsDelegate = Symbol("itemsDelegate");

/**
 * Symbol for the `keydown` method.
 *
 * This method is invoked when an element receives a `keydown` event.
 *
 * An implementation of `internal.keydown` should return `true` if it handled
 * the event, and `false` otherwise. If `true` is returned (the event was
 * handled), `KeyboardMixin` invokes the event's `preventDefault` and
 * `stopPropagation` methods to let the browser know the event was handled.
 *
 * The convention for handling `internal.keydown` is that the last mixin
 * applied wins. That is, if an implementation of `internal.keydown` *did*
 * handle the event, it can return immediately. If it did not, it should
 * invoke `super` to let implementations further up the prototype chain have
 * their chance.
 *
 * This method takes a `KeyboardEvent` parameter that contains the event being
 * processed.
 */
const keydown = Symbol("keydown");

/**
 * Symbol for the `mouseenter` method.
 *
 * [HoverMixin](HoverMixin) invokes this method when the user moves the
 * mouse over a component. That mixin provides a base implementation of this
 * method, but you can extend it to do additional work on `mouseenter`.
 *
 * This method takes a `MouseEvent` parameter that contains the event being
 * processed.
 */
const mouseenter = Symbol("mouseenter");

/**
 * Symbol for the `mouseleave` method.
 *
 * [HoverMixin](HoverMixin) invokes this method when the user moves off a
 * component. That mixin provides a base implementation of this method, but
 * you can extend it to do additional work on `mouseleave`.
 *
 * This method takes a `MouseEvent` parameter that contains the event being
 * processed.
 */
const mouseleave = Symbol("mouseleave");

/**
 * Symbol for access to native HTML element internals.
 */
const nativeInternals = nativeInternals$1;

/**
 * Symbol for the `raiseChangeEvents` property.
 *
 * This property is used by mixins to determine whether they should raise
 * property change events. The standard HTML pattern is to only raise such
 * events in response to direct user interactions. For a detailed discussion
 * of this point, see the Gold Standard checklist item for
 * [Propery Change Events](https://github.com/webcomponents/gold-standard/wiki/Property%20Change%20Events).
 *
 * The above article describes a pattern for using a flag to track whether
 * work is being performed in response to internal component activity, and
 * whether the component should therefore raise property change events.
 * This `raiseChangeEvents` symbol is a shared flag used for that purpose by
 * all Elix mixins and components. Sharing this flag ensures that internal
 * activity (e.g., a UI event listener) in one mixin can signal other mixins
 * handling affected properties to raise change events.
 *
 * All UI event listeners (and other forms of internal handlers, such as
 * timeouts and async network handlers) should set `raiseChangeEvents` to
 * `true` at the start of the event handler, then `false` at the end:
 *
 *     this.addEventListener('click', event => {
 *       this[raiseChangeEvents] = true;
 *       // Do work here, possibly setting properties, like:
 *       this.foo = 'Hello';
 *       this[raiseChangeEvents] = false;
 *     });
 *
 * Elsewhere, property setters that raise change events should only do so it
 * this property is `true`:
 *
 *     set foo(value) {
 *       // Save foo value here, do any other work.
 *       if (this[raiseChangeEvents]) {
 *         export const event = new CustomEvent('foochange');
 *         this.dispatchEvent(event);
 *       }
 *     }
 *
 * In this way, programmatic attempts to set the `foo` property will not trigger
 * the `foochange` event, but UI interactions that update that property will
 * cause those events to be raised.
 */
const raiseChangeEvents = raiseChangeEvents$1;

/**
 * Symbol for the `render` method.
 *
 * [ReactiveMixin](ReactiveMixin) invokes this `internal.render` method to give
 * the component a chance to render recent changes in component state.
 */
const render = render$1;

/**
 * Symbol for the `renderChanges` method.
 *
 * [ReactiveMixin](ReactiveMixin) invokes this method in response to a
 * `setState` call; you should generally not invoke this method yourself.
 */
const renderChanges = renderChanges$1;

/**
 * Symbol for the `renderDataToElement` method.
 *
 * [DataItemsMixin](DataItemsMixin) invokes this method to render data to an
 * element being used as an item in a list.
 */
const renderDataToElement = Symbol("renderDataToElement");

/**
 * Symbol for the `rendered` method.
 *
 * [ReactiveMixin](ReactiveMixin) will invoke this method after your
 * element has completely finished rendering.
 */
const rendered = rendered$1;

/**
 * Symbol for the `rendering` property.
 *
 * [ReactiveMixin](ReactiveMixin) sets this property to true during rendering,
 * at other times it will be false.
 */
const rendering = rendering$1;

/**
 * Symbol for the `scrollTarget` property.
 *
 * This property indicates which element in a component's shadow subtree
 * should be scrolled. [CursorInViewMixin](CursorInViewMixin) can use
 * this property to determine which element should be scrolled to keep the
 * selected item in view.
 */
const scrollTarget = Symbol("scrollTarget");

/**
 * Symbol for the `setState` method.
 *
 * A component using [ReactiveMixin](ReactiveMixin) can invoke this method to
 * apply changes to the element's current state.
 */
const setState = setState$1;

/**
 * Symbol for the `shadowRoot` property.
 *
 * This property holds a reference to an element's shadow root, like
 * `this.shadowRoot`. This propery exists because `this.shadowRoot` is not
 * available for components with closed shadow roots.
 * [ShadowTemplateMixin](ShadowTemplateMixin) creates open shadow roots by
 * default, but you can opt into creating closed shadow roots; see
 * [shadowRootMode](internal#internal.shadowRootMode).
 */
const shadowRoot = shadowRoot$1;

/**
 * Symbol for the `shadowRootMode` property.
 *
 * If true (the default), then [ShadowTemplateMixin](ShadowTemplateMixin) will
 * create an open shadow root when the component is instantiated. Set this to
 * false if you want to programmatically hide component internals in a closed
 * shadow root.
 */
const shadowRootMode = shadowRootMode$1;

/**
 * Symbol for the `startEffect` method.
 *
 * A component using [TransitionEffectMixin](TransitionEffectMixin) can invoke
 * this method to trigger the application of a named, asynchronous CSS
 * transition effect.
 *
 * This method takes a single `string` parameter giving the name of the effect
 * to start.
 */
const startEffect = Symbol("startEffect");

/**
 * The element's current state.
 *
 * This is managed by [ReactiveMixin](ReactiveMixin).
 */
const state = state$1;

const stateEffects = stateEffects$1;

/**
 * Symbol for the `swipeDown` method.
 *
 * The swipe mixin [TouchSwipeMixin](TouchSwipeMixin) invokes this method when
 * the user finishes a gesture to swipe down.
 */
const swipeDown = Symbol("swipeDown");

/**
 * Symbol for the `swipeDownComplete` method.
 *
 * [SwipeCommandsMixin](SwipeCommandsMixin) invokes this method after any
 * animated transition associated with a swipe down has completed.
 */
const swipeDownComplete = Symbol("swipeDownComplete");

/**
 * Symbol for the `swipeLeft` method.
 *
 * The swipe mixins [TouchSwipeMixin](TouchSwipeMixin) and
 * [TrackpadSwipeMixin](TrackpadSwipeMixin) invoke this method when the user
 * finishes a gesture to swipe left.
 */
const swipeLeft = Symbol("swipeLeft");

/**
 * Symbol for the `swipeLeftTransitionEnd` method.
 *
 * [SwipeCommandsMixin](SwipeCommandsMixin) invokes this method after any
 * animated transition associated with a swipe left has completed.
 */
const swipeLeftTransitionEnd = Symbol("swipeLeftTransitionEnd");

/**
 * Symbol for the `swipeRight` method.
 *
 * The swipe mixins [TouchSwipeMixin](TouchSwipeMixin) and
 * [TrackpadSwipeMixin](TrackpadSwipeMixin) invoke this method when the user
 * finishes a gesture to swipe right.
 */
const swipeRight = Symbol("swipeRight");

/**
 * Symbol for the `swipeRightTransitionEnd` method.
 *
 * [SwipeCommandsMixin](SwipeCommandsMixin) invokes this method after any
 * animated transition associated with a swipe right has completed.
 */
const swipeRightTransitionEnd = Symbol("swipeRightTransitionEnd");

/**
 * Symbol for the `swipeUp` method.
 *
 * The swipe mixin [TouchSwipeMixin](TouchSwipeMixin) invokes this method when
 * the user finishes a gesture to swipe up.
 */
const swipeUp = Symbol("swipeUp");

/**
 * Symbol for the `swipeUpComplete` method.
 *
 * [SwipeCommandsMixin](SwipeCommandsMixin) invokes this method after any
 * animated transition associated with a swipe up has completed.
 */
const swipeUpComplete = Symbol("swipeUpComplete");

/**
 * Symbol for the `swipeStart` method.
 *
 * [TouchSwipeMixin](TouchSwipeMixin) and
 * [TrackpadSwipeMixin](TrackpadSwipeMixin) invoke this method when a swipe
 * is starting, passing in the starting (x, y) client coordinate.
 */
const swipeStart = Symbol("swipeStart");

/**
 * Symbol for the `swipeTarget` property.
 *
 * By default, the swipe mixins [TouchSwipeMixin](TouchSwipeMixin) and
 * [TrackpadSwipeMixin](TrackpadSwipeMixin) assume that the element the user
 * is swiping the top-level element. In some cases (e.g., [Drawer](Drawer)),
 * the component wants to let the user swipe a shadow element. In such cases,
 * this property should return the element that should be swiped.
 *
 * The swipe target's `offsetWidth` is used by the mixin to calculate the
 * `state.swipeFraction` member when the user drags their finger. The
 * `swipeFraction` is the distance the user has dragged in the current drag
 * operation over that `offsetWidth`.
 */
const swipeTarget = Symbol("swipeTarget");

/**
 * Symbol for the `tap` method.
 *
 * This method is invoked when an element receives an operation that should
 * be interpreted as a tap. [TapCursorMixin](TapCursorMixin)
 * invokes this when the element receives a `mousedown` event, for example.
 */
const tap = Symbol("tap");

/**
 * Symbol for the `template` method.
 *
 * [ShadowTemplateMixin](ShadowTemplateMixin) uses this property to obtain a
 * component's template, which it will clone into a component's shadow root.
 */
const template = template$1;

/**
 * Symbol for the `toggleSelectedFlag` method.
 *
 * [ItemsMultiSelectMixin](ItemsMultiSelectMixin) exposes this method to let
 * other mixins like [MultiSelectAPIMixin](MultiSelectAPIMixin) toggle the
 * selected state of an individual item.
 */
const toggleSelectedFlag = Symbol("toggleSelectedFlag");

// Expose internals as a global when debugging.
const elixdebug = new URLSearchParams(location.search).get("elixdebug");
if (elixdebug === "true") {
  /** @type {any} */ (window).elix = {
    internal: {
      checkSize,
      closestAvailableItemIndex,
      contentSlot,
      defaultState,
      defaultTabIndex,
      delegatesFocus,
      effectEndTarget,
      firstRender,
      focusTarget,
      getItemText,
      goDown,
      goEnd,
      goFirst,
      goLast,
      goLeft,
      goNext,
      goPrevious,
      goRight,
      goStart,
      goToItemWithPrefix,
      goUp,
      hasDynamicTemplate,
      ids,
      inputDelegate,
      itemsDelegate,
      keydown,
      mouseenter,
      mouseleave,
      nativeInternals,
      event,
      raiseChangeEvents,
      render,
      renderChanges,
      renderDataToElement,
      rendered,
      rendering,
      scrollTarget,
      setState,
      shadowRoot,
      shadowRootMode,
      startEffect,
      state,
      stateEffects,
      swipeDown,
      swipeDownComplete,
      swipeLeft,
      swipeLeftTransitionEnd,
      swipeRight,
      swipeRightTransitionEnd,
      swipeUp,
      swipeUpComplete,
      swipeStart,
      swipeTarget,
      tap,
      template,
      toggleSelectedFlag,
    },
  };
}

/**
 * Exposes a list's currently-selected item to assistive technologies.
 *
 * Handling ARIA selection state properly is actually quite complex:
 *
 * * The items in the list need to be indicated as possible items via an ARIA
 *   `role` attribute value such as "option".
 * * The selected item(s) need to be marked as selected by setting the item's
 *   `aria-selected` attribute to true *and* the other items need be marked as
 *   *not* selected by setting `aria-selected` to false.
 * * The outermost element with the keyboard focus needs to have attributes
 *   set on it so that the current item is knowable at the list level via the
 *   `aria-activedescendant` attribute.
 * * Use of `aria-activedescendant` in turn requires that all items in the
 *   list have ID attributes assigned to them.
 * * If the list supports mutli-selection, `aria-multiselectable` must be
 *   set to "true" on the host.
 *
 * This mixin tries to address all of the above requirements. To that end,
 * this mixin will assign generated IDs to any item that doesn't already have
 * an ID.
 *
 * ARIA relies on elements to provide `role` attributes. This mixin will apply
 * a default role of "listbox" on the outer list if it doesn't already have an
 * explicit role. Similarly, this mixin will apply a default role of "option"
 * to any list item that does not already have a role specified.
 *
 * This mixin expects the component to define a `currentIndex` state member to
 * indicate the current item. You can supply that yourself, or do so via
 * [ItemsCursorMixin](ItemsCursorMixin). For a multi-select list, you must also
 * define a `selectedItemFlags` state member, available via
 * [ItemsMultiSelectMixin](ItemsMultiSelectMixin).
 *
 * @module AriaListMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function AriaListMixin(Base) {
  // The class prototype added by the mixin.
  class AriaList extends Base {
    // @ts-ignore
    get [defaultState]() {
      const base = super[defaultState];
      return Object.assign(base, {
        itemRole: base.itemRole || "option",
        role: base.role || "listbox",
      });
    }

    get itemRole() {
      return this[state].itemRole;
    }
    set itemRole(itemRole) {
      this[setState]({ itemRole });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }

      const { itemRole } = this[state];
      /** @type {ListItemElement[]} */ const items = this[state].items;

      // Give each item an ID.
      if (changed.items && items) {
        items.forEach((item) => {
          if (!item.id) {
            item.id = ensureId(item);
          }
        });
      }

      // Give each item a role.
      if ((changed.items || changed.itemRole) && items) {
        items.forEach((item) => {
          if (itemRole === defaultAriaRole[item.localName]) {
            item.removeAttribute("role");
          } else {
            item.setAttribute("role", itemRole);
          }
        });
      }

      // Reflect the selected state to each item.
      if (changed.items || changed.selectedIndex || changed.selectedItemFlags) {
        // Does the list support multi-selection?
        const { selectedItemFlags, selectedIndex } = this[state];
        if (items) {
          items.forEach((item, index) => {
            const selected = selectedItemFlags
              ? selectedItemFlags[index] // Multi-select
              : index === selectedIndex; // Single-select
            item.setAttribute("aria-selected", selected.toString());
          });
        }
      }

      // Indicate on the host that the current item is active.
      if (changed.items || changed.selectedIndex) {
        const { selectedIndex } = this[state];
        const selectedItem =
          selectedIndex >= 0 && items ? items[selectedIndex] : null;
        if (selectedItem) {
          if (!selectedItem.id) {
            selectedItem.id = ensureId(selectedItem);
          }
          this.setAttribute("aria-activedescendant", selectedItem.id);
        } else {
          this.removeAttribute("aria-activedescendant");
        }
      }

      if (changed.selectedItemFlags) {
        // Let ARIA know this is a multi-select list box.
        if (this[state].selectedItemFlags) {
          this.setAttribute("aria-multiselectable", "true");
        } else {
          this.removeAttribute("aria-multiselectable");
        }
      }

      // Let ARIA know list orientation.
      if (changed.orientation) {
        const { orientation } = this[state];
        this.setAttribute("aria-orientation", orientation);
      }

      // Apply top-level role.
      if (changed.role) {
        const { role } = this[state];
        this.setAttribute("role", role);
      }
    }

    // Setting the standard role attribute will invoke this property setter,
    // which will allow us to update our state.
    get role() {
      return super.role;
    }
    set role(role) {
      super.role = role;
      if (!this[rendering]) {
        this[setState]({ role });
      }
    }
  }

  return AriaList;
}

/**
 * Helpers for dynamically creating and patching component templates.
 *
 * The [ShadowTemplateMixin](ShadowTemplateMixin) lets you define a component
 * template that will be used to popuplate the shadow subtree of new component
 * instances. These helpers, especially the [html](#html) function, are intended
 * to simplify the creation of such templates.
 *
 * In particular, these helpers can be useful in [patching
 * templates](customizing#template-patching) inherited from a base class.
 *
 * Some of these functions take _descriptors_ that can either be a class, a tag
 * name, or an HTML template. These are generally used to fill specific roles in
 * an element's template; see [element roles](customizing#element-part-types).
 *
 * @module template
 */

// Used by registerCustomElement.
const mapBaseTagToCount = new Map();

/**
 * Create an element from a role descriptor (a component class constructor or
 * an HTML tag name).
 *
 * If the descriptor is an HTML template, and the resulting document fragment
 * contains a single top-level node, that node is returned directly (instead of
 * the fragment).
 *
 * @param {PartDescriptor} descriptor - the descriptor that will be used to
 * create the element
 * @returns {Element} the new element
 */
function createElement(descriptor) {
  if (typeof descriptor === "function") {
    // Instantiable component class constructor
    let element;
    try {
      element = new descriptor();
    } catch (/** @type {any} */ e) {
      if (e.name === "TypeError") {
        // Most likely this error results from the fact that the indicated
        // component class hasn't been registered. Register it now with a random
        // name and try again.
        registerCustomElement(descriptor);
        element = new descriptor();
      } else {
        // The exception was for some other reason.
        throw e;
      }
    }
    return element;
    // @ts-ignore
  } else {
    // String tag name: e.g., 'div'
    return document.createElement(descriptor);
  }
}

/**
 * Register the indicated constructor as a custom element class.
 *
 * This function generates a suitable string tag for the class. If the
 * constructor is a named function (which is typical for hand-authored code),
 * the function's `name` will be used as the base for the tag. If the
 * constructor is an anonymous function (which often happens in
 * generated/minified code), the tag base will be "custom-element".
 *
 * In either case, this function adds a uniquifying number to the end of the
 * base to produce a complete tag.
 *
 * @private
 * @param {Constructor<HTMLElement>} classFn
 */
function registerCustomElement(classFn) {
  let baseTag;
  // HTML places more restrictions on the first character in a tag than
  // JavaScript places on the first character of a class name. We apply this
  // more restrictive condition to the class names we'll convert to tags. Class
  // names that fail this check -- often generated class names -- will result in
  // a base tag name of "custom-element".
  const classNameRegex = /^[A-Za-z][A-Za-z0-9_$]*$/;
  const classNameMatch = classFn.name && classFn.name.match(classNameRegex);
  if (classNameMatch) {
    // Given the class name `FooBar`, calculate the base tag name `foo-bar`.
    const className = classNameMatch[0];
    const uppercaseRegEx = /([A-Z])/g;
    const hyphenated = className.replace(
      uppercaseRegEx,
      (match, letter, offset) => (offset > 0 ? `-${letter}` : letter)
    );
    baseTag = hyphenated.toLowerCase();
  } else {
    baseTag = "custom-element";
  }
  // Add a uniquifying number to the end of the tag until we find a tag
  // that hasn't been registered yet.
  let count = mapBaseTagToCount.get(baseTag) || 0;
  let tag;
  for (; ; count++) {
    tag = `${baseTag}-${count}`;
    if (!customElements.get(tag)) {
      // Not in use.
      break;
    }
  }
  // Register with the generated tag.
  customElements.define(tag, /** @type {any} */ classFn);
  // Bump number and remember it. If we see the same base tag again later, we'll
  // start counting at that number in our search for a uniquifying number.
  mapBaseTagToCount.set(baseTag, count + 1);
}

/**
 * Replace an original node in a tree or document fragment with the indicated
 * replacement node. The attributes, classes, styles, and child nodes of the
 * original node will be moved to the replacement.
 *
 * @param {Node} original - an existing node to be replaced
 * @param {Node} replacement - the node to replace the existing node with
 * @returns {Node} the updated replacement node
 */
function replace(original, replacement) {
  const parent = original.parentNode;
  if (!parent) {
    throw "An element must have a parent before it can be substituted.";
  }
  if (
    (original instanceof HTMLElement || original instanceof SVGElement) &&
    (replacement instanceof HTMLElement || replacement instanceof SVGElement)
  ) {
    // Merge attributes from original to replacement, letting replacement win
    // conflicts. Handle classes and styles separately (below).
    Array.prototype.forEach.call(
      original.attributes,
      (/** @type {Attr} */ attribute) => {
        if (
          !replacement.getAttribute(attribute.name) &&
          attribute.name !== "class" &&
          attribute.name !== "style"
        ) {
          replacement.setAttribute(attribute.name, attribute.value);
        }
      }
    );
    // Copy classes/styles from original to replacement, letting replacement win
    // conflicts.
    Array.prototype.forEach.call(
      original.classList,
      (/** @type {string} */ className) => {
        replacement.classList.add(className);
      }
    );
    Array.prototype.forEach.call(
      original.style,
      (/** @type {number} */ key) => {
        if (!replacement.style[key]) {
          replacement.style[key] = original.style[key];
        }
      }
    );
  }
  // Copy over children.
  // @ts-ignore
  replacement.append(...original.childNodes);

  parent.replaceChild(replacement, original);
  return replacement;
}

/**
 * Replace a node with a new element, transferring all attributes, classes,
 * styles, and child nodes from the original(s) to the replacement(s).
 *
 * The descriptor used for the replacements can be a 1) component class
 * constructor, 2) an HTML tag name, or 3) an HTML template. For #1 and #2, if
 * the existing elements that match the selector are already of the desired
 * class/tag name, the replacement operation is skipped.
 *
 * @param {Element} original - the node to replace
 * @param {PartDescriptor} descriptor - the descriptor used to generate the
 * replacement element
 * @returns {Element} the replacement node(s)
 */
function transmute(original, descriptor) {
  if (
    (typeof descriptor === "function" && original.constructor === descriptor) ||
    (typeof descriptor === "string" &&
      original instanceof Element &&
      original.localName === descriptor)
  ) {
    // Already correct type of element, no transmutation necessary.
    return original;
  } else {
    // Transmute the single node.
    const replacement = createElement(descriptor);
    replace(original, replacement);
    return replacement;
  }
}

// Quick detection of whether we'll need to handle focus.
// As of February 2019, we don't need to handle this in Chrome, perhaps because
// they already support delegatesFocus (which handles related focus issues).
const focusTest = document.createElement("div");
focusTest.attachShadow({ mode: "open", delegatesFocus: true });
/** @type {any} */
const focusTestShadowRoot = focusTest.shadowRoot;
const nativeDelegatesFocus = focusTestShadowRoot.delegatesFocus;

/**
 * Normalizes focus treatment for custom elements with Shadow DOM
 *
 * This mixin exists because the default behavior for mousedown should set the
 * focus to the closest ancestor of the clicked element that can take the focus.
 * As of Nov 2018, Chrome and Safari don't handle this as expected when the
 * clicked element is reassigned across more than one slot to end up inside a
 * focusable element. In such cases, the focus will end up on the body. Firefox
 * exhibits the behavior we want. See
 * https://github.com/w3c/webcomponents/issues/773.
 *
 * This mixin normalizes behavior to provide what Firefox does. When the user
 * mouses down inside anywhere inside the component's light DOM or Shadow DOM,
 * we walk up the composed tree to find the first element that can take the
 * focus and put the focus on it.
 *
 * @module ComposedFocusMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function ComposedFocusMixin(Base) {
  // The class prototype added by the mixin.
  class ComposedFocus extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        composeFocus: !nativeDelegatesFocus,
      });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }
      if (this[firstRender]) {
        this.addEventListener("mousedown", (event) => {
          if (!this[state].composeFocus) {
            return;
          }
          // Only process events for the main (usually left) button.
          if (event.button !== 0) {
            return;
          }
          if (event.target instanceof Element) {
            const target = closestFocusableNode(event.target);
            if (target) {
              target.focus();
              event.preventDefault();
            }
          }
        });
      }
    }
  }

  return ComposedFocus;
}

/**
 * Delegates its ARIA label property to an inner input-type element.
 *
 * This helps ensure that elements built around an inner input element provide a
 * proper accessible label for assistive technologies like screen readers.
 *
 * You can identify which inner input element selection should be delegated to
 * by defining an `internal.inputDelegate` property and returning the desired
 * inner input.
 *
 * @module DelegateInputLabelMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function DelegateInputLabelMixin(Base) {
  // The class prototype added by the mixin.
  class DelegateInputLabel extends Base {
    // Forward any ARIA label to the input element.
    get ariaLabel() {
      return this[state].ariaLabel;
    }
    set ariaLabel(ariaLabel) {
      if (!this[state].removingAriaAttribute) {
        this[setState]({
          ariaLabel: String(ariaLabel),
        });
      }
    }

    // Forward ARIA labelledby as an aria-label to the input element.
    // Note the lowercase "b" in the name, necessary to support the actual
    // attribute name "aria-labelledby", which has no hyphen before the "by".
    get ariaLabelledby() {
      return this[state].ariaLabelledby;
    }
    set ariaLabelledby(ariaLabelledby) {
      if (!this[state].removingAriaAttribute) {
        this[setState]({
          ariaLabelledby: String(ariaLabelledby),
        });
      }
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        ariaLabel: null,
        ariaLabelledby: null,
        inputLabel: null,
        removingAriaAttribute: false,
      });
    }

    [render](changed) {
      if (super[render]) {
        super[render](changed);
      }

      if (this[firstRender]) {
        // Refresh the input label on focus. This refresh appears to happen fast
        // enough that the screen reader will announce the refreshed label.
        this.addEventListener("focus", () => {
          this[raiseChangeEvents] = true;
          const inputLabel = refreshInputLabel(this, this[state]);
          this[setState]({ inputLabel });
          this[raiseChangeEvents] = false;
        });
      }

      // Apply the latest input label to the input delegate.
      if (changed.inputLabel) {
        const { inputLabel } = this[state];
        if (inputLabel) {
          this[inputDelegate].setAttribute("aria-label", inputLabel);
        } else {
          this[inputDelegate].removeAttribute("aria-label");
        }
      }
    }

    [rendered](changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      if (this[firstRender]) {
        // Refresh the label on first render. This is not guaranteed to pick up
        // labels defined by another element, as that element (or elements) may
        // not be in the DOM yet. For that reason, we'll also refresh the label
        // on focus. The reason to do it now is to handle the common cases where
        // the element defining the label does exist so that accessibility
        // testing tools can confirm that the input delegate does have a label.
        // Because this refresh can entail multiple searches of the tree, we
        // defer the refresh to idle time.
        // @ts-ignore
        const idleCallback = window.requestIdleCallback || setTimeout;
        idleCallback(() => {
          const inputLabel = refreshInputLabel(this, this[state]);
          this[setState]({ inputLabel });
        });
      }

      // Once we've obtained an aria-label or aria-labelledby from the host, we
      // remove those attirbutes so that the labels don't get announced twice.
      // We use a flag to distinguish between us removing our own ARIA
      // attributes (which should not update state), and someone removing
      // those attributes from the outside (which should update state).
      const { ariaLabel, ariaLabelledby } = this[state];
      if (changed.ariaLabel && !this[state].removingAriaAttribute) {
        if (this.getAttribute("aria-label")) {
          this.setAttribute("delegated-label", ariaLabel);
          this[setState]({ removingAriaAttribute: true });
          this.removeAttribute("aria-label");
        }
      }
      if (changed.ariaLabelledby && !this[state].removingAriaAttribute) {
        if (this.getAttribute("aria-labelledby")) {
          this.setAttribute("delegated-labelledby", ariaLabelledby);
          this[setState]({ removingAriaAttribute: true });
          this.removeAttribute("aria-labelledby");
        }
      }

      if (changed.removingAriaAttribute && this[state].removingAriaAttribute) {
        // We've done whatever removal we needed, and can now reset our flag.
        this[setState]({ removingAriaAttribute: false });
      }
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // If the ariaLabel changes, we can update our inputLabel state
      // immediately. Among other things, this facilitates scenarios where we
      // have nested elements using DelegateInputLabelMixin: the outermost
      // element can use whatever label approach it wants, the inner elements
      // will all use ariaLabel.
      //
      // We also update the label if we're focused, using ariaLabelledby, and
      // the selectedText changes. One pattern with select-like elements is to
      // have them include their own ID in the IDs specified by aria-labelledby.
      // This can incorporate the element's own `selectedText` in the announced
      // label. That `selectedText` can change while the element has focus, in
      // which case we'll refresh.
      if (
        (changed.ariaLabel && state.ariaLabel) ||
        (changed.selectedText &&
          state.ariaLabelledby &&
          this.matches(":focus-within"))
      ) {
        const inputLabel = refreshInputLabel(this, state);
        Object.assign(effects, { inputLabel });
      }

      return effects;
    }
  }

  return DelegateInputLabel;
}

// Given an element that is being used as a label, extract its label text.
function getLabelFromElement(element) {
  // We use innerText here instead of textContent because we want the rendered
  // text. If, e.g., a text node includes a span with `display: none`,
  // textContent would include that hidden text, but innerText would leave it
  // out -- which is what we want here.
  if ("selectedText" in element) {
    // Element (most likely Elix) with selectedText property
    return element.selectedText;
  } else if ("value" in element && "options" in element) {
    // select or select-like element
    const value = element.value;
    const option = element.options.find((option) => option.value === value);
    return option ? option.innerText : "";
  } else if ("value" in element) {
    // Other input element
    return element.value;
  } else {
    // Other
    return element.innerText;
  }
}

/**
 * Calculate an appropriate label for the component's delegated input element.
 * When the element gets the focus, we refresh its label. This is done because
 * three of the labeling strategies (`aria-labelledby` attribute, `for`
 * attribute, and wrapping `label`) reference other elements in the tree -- and
 * the contents of those elements can change dynamically.
 *
 * @private
 * @param {HTMLElement} element
 * @param {PlainObject} state
 */
function refreshInputLabel(element, state) {
  const { ariaLabel, ariaLabelledby } = state;
  /** @type {any} */ const rootNode = element.isConnected
    ? element.getRootNode()
    : null;
  let inputLabel = null;

  // Prefer aria-labelledby over aria-label, per
  // https://developers.google.com/web/fundamentals/accessibility/semantics-aria/aria-labels-and-relationships.
  // After that, we prefer a `label` element with a `for` attribute, and finally
  // a wrapping `label` element.
  //
  // There do not appear to be consistent cross-browser rules for handling
  // multiple forms of label assignment on the same component. E.g., if you
  // place an element in a wrapping label *and* point a `label` element at that
  // element with a `for` attribute, as of August 2020 Chrome and Firefox will
  // announce both, but Safari will only announce the `for` label.
  //
  // Since people are probably not relying upon specific results for multiple
  // forms of label assignment, we don't attempt to construct a combined label
  // in those cases.
  if (ariaLabelledby && rootNode) {
    // Collect labels from elements with the indicated IDs.
    const ids = ariaLabelledby.split(" ");
    const labels = ids.map((id) => {
      const elementWithId = rootNode.getElementById(id);
      // Get a label from the indicated element.
      // Special case: if the element is providing its own label, we return its
      // current `selectedText` state.
      const label = !elementWithId
        ? ""
        : elementWithId === element && state.value !== null
        ? state.selectedText
        : getLabelFromElement(elementWithId);
      return label;
    });
    inputLabel = labels.join(" ");
  } else if (ariaLabel) {
    // Use ariaLabel property as input label.
    inputLabel = ariaLabel;
  } else if (rootNode) {
    const id = element.id;
    if (id) {
      // Look for labelling element with `for` attribute.
      const elementWithFor = rootNode.querySelector(`[for="${id}"]`);
      if (elementWithFor instanceof HTMLElement) {
        // Obtain label from wrapping label element.
        inputLabel = getLabelFromElement(elementWithFor);
      }
    }
    if (inputLabel === null) {
      // Last option is to look for closest wrapping label element.
      const labelElement = element.closest("label");
      if (labelElement) {
        inputLabel = getLabelFromElement(labelElement);
      }
    }
  }

  if (inputLabel) {
    inputLabel = inputLabel.trim();
  }

  return inputLabel;
}

// We consider the keyboard to be active if the window has received a keydown
// event since the last mousedown event.
let keyboardActive = false;

/** @type {any} */
const focusVisibleChangedListenerKey = Symbol("focusVisibleChangedListener");

/**
 * Shows a focus indication if and only if the keyboard is active.
 *
 * The keyboard is considered to be active if a keyboard event has occurred
 * since the last mousedown event.
 *
 * This is loosely modeled after the proposed
 * [focus-visible](https://github.com/WICG/focus-visible) feature for CSS.
 *
 * @module FocusVisibleMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function FocusVisibleMixin(Base) {
  // The class prototype added by the mixin.
  return class FocusVisible extends Base {
    constructor() {
      // @ts-ignore
      super();

      // We listen to focusin/focusout instead of focus/blur because components
      // like Menu want to handle focus visiblity for the items they contain,
      // and those contained items can get the focus. Using focusin/focusout
      // lets us know whether this element *or any element it contains* has the
      // focus.
      //
      // Focus events are problematic in that they can occur during rendering:
      // if an element with the focus is updated so that its tabindex is
      // removed, it will lose focus. Since these focus handlers need to set
      // state, this could lead to setting state during rendering, which is bad.
      // To avoid this problem, we use promise timing to defer the setting of
      // state.
      this.addEventListener("focusout", (event) => {
        Promise.resolve().then(() => {
          // What has the focus now?
          /** @type {any} */ const cast = event;
          const newFocusedElement =
            cast.relatedTarget || document.activeElement;
          const isFocusedElement = this === newFocusedElement;
          const containsFocus = deepContains(this, newFocusedElement);
          const lostFocus = !isFocusedElement && !containsFocus;
          if (lostFocus) {
            this[setState]({
              focusVisible: false,
            });
            // No longer need to listen for changes in focus visibility.
            document.removeEventListener(
              "focusvisiblechange",
              this[focusVisibleChangedListenerKey]
            );
            this[focusVisibleChangedListenerKey] = null;
          }
        });
      });
      this.addEventListener("focusin", () => {
        Promise.resolve().then(() => {
          if (this[state].focusVisible !== keyboardActive) {
            // Show the element as focused if the keyboard has been used.
            this[setState]({
              focusVisible: keyboardActive,
            });
          }
          if (!this[focusVisibleChangedListenerKey]) {
            // Listen to subsequent changes in focus visibility.
            this[focusVisibleChangedListenerKey] = () => refreshFocus(this);
            document.addEventListener(
              "focusvisiblechange",
              this[focusVisibleChangedListenerKey]
            );
          }
        });
      });
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        focusVisible: false,
      });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }

      // Suppress the component's normal `outline` style unless we know the
      // focus should be visible.
      if (changed.focusVisible) {
        const { focusVisible } = this[state];
        this.toggleAttribute("focus-visible", focusVisible);
      }
    }

    get [template]() {
      const result = super[template] || templateFrom.html``;
      result.content.append(fragmentFrom.html`
        <style>
          :host {
            outline: none;
          }

          :host([focus-visible]:focus-within) {
            outline-color: Highlight; /* Firefox */
            outline-color: -webkit-focus-ring-color; /* All other browsers */
            outline-style: auto;
          }
        </style>
      `);
      return result;
    }
  };
}

function refreshFocus(/** @type {ReactiveElement} */ element) {
  element[setState]({
    focusVisible: keyboardActive,
  });
}

function updateKeyboardActive(/** @type {boolean} */ newKeyboardActive) {
  if (keyboardActive !== newKeyboardActive) {
    keyboardActive = newKeyboardActive;
    const event = new CustomEvent("focusvisiblechange", {
      detail: {
        focusVisible: keyboardActive,
      },
    });
    document.dispatchEvent(event);
  }
}

// Listen for top-level keydown and mousedown events.
// Use capture phase so we detect events even if they're handled.
window.addEventListener(
  "keydown",
  () => {
    updateKeyboardActive(true);
  },
  { capture: true }
);

window.addEventListener(
  "mousedown",
  () => {
    updateKeyboardActive(false);
  },
  { capture: true }
);

/**
 * Delegates a component's focus to its first focusable shadow element.
 *
 * This mixin serves as a polyfill for the standard `delegatesFocus` shadow root
 * property. As of June 2020, that property is still only natively supported in
 * Chrome. The Chrome delegatesFocus implementation has some subtle issues;
 * until additional implementations are available, it's hard to know whether the
 * issues are with the definition of delegatesFocus, with Chrome's
 * implementation, or with Elix component code. Accordingly, for the time being
 * this polyfill is used even on Chrome.
 *
 * @module DelegateFocusMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function DelegateFocusMixin(Base) {
  // The class prototype added by the mixin.
  class DelegateFocus extends Base {
    /**
     * Returns true if the component is delegating its focus.
     *
     * A component using `DelegateFocusMixin` will always have this property be
     * true unless a class takes measures to override it.
     *
     * @type {boolean}
     * @default true
     */
    get [delegatesFocus]() {
      return true;
    }

    /**
     * If someone tries to put the focus on us, delegate the focus to the first
     * focusable element in the composed tree below our shadow root.
     *
     * @ignore
     * @param {FocusOptions=} focusOptions
     */
    focus(focusOptions) {
      // On browsers that support delegatesFocus natively, we should just be
      // able to let the browser handle the focus method. However, we hit a bug
      // in June 2020 where the native focus method in Chrome did not always
      // produce the expected results if delegatesFocus is set.
      //
      // Specific bug: a PopupButton would like to delegates focus to its source
      // button. Tabbing to a PopupButton focused on the source button as
      // expected. Moreover, programmatically setting focus on the button also
      // worked. However, when a PopupButton's popup was closed with the Escape
      // key, OverlayMixin attemped to set programmatically focus to the
      // PopupButton. This did *not* work as expecte, and focus ended up on the
      // body. Until we have a second native implementation to compare against,
      // it's difficult to determine whether this is a bug in the definition of
      // delegatesFocus, Chrome's implementation, or our code.

      // /** @type {any} */ const cast = this[shadowRoot];
      // if (cast.delegatesFocus) {
      //   // Native support for delegatesFocus, so don't need to do anything.
      //   super.focus(focusOptions);
      //   return;
      // }
      const focusElement = this[focusTarget];
      if (focusElement) {
        focusElement.focus(focusOptions);
      }
    }

    get [focusTarget]() {
      // HACK: The commented-out code lets us rely on the browser to indicate
      // which element should be focused on in browsers that don't support
      // native delegatesFocus. However, this code creates subtle focus problems
      // in components like AutoCompleteListBox: if the user clicks the toggle
      // button, the focus won't be placed on the top-level AutoCompleteComboBox
      // as expected; that element will be returned as the focus target, but if
      // it doesn't have a non-negative tabindex, forwardFocus won't think it's
      // focusable. A more correct solution would be for all components that are
      // focusable to give themselves a tabIndex of 0 by default or define a new
      // public `focusable` that components could use to indicate that they're
      // focusable. Until we have time to fully explore that, we workaround the
      // bug by providing the polyfill behavior even in browsers that have
      // delegatesFocus.

      // /** @type {any} */ const cast = this[shadowRoot];
      // return cast.delegatesFocus
      //   ? this
      //   : firstFocusableElement(this[shadowRoot]);
      return firstFocusableElement(this[shadowRoot]);
    }
  }

  return DelegateFocus;
}

const extendsKey = Symbol("extends");

const delegatedPropertySettersKey = Symbol("delegatedPropertySetters");

/* True if a standard element is focusable by default. */
/** @type {IndexedObject<boolean>} */
const focusableByDefault = {
  a: true,
  area: true,
  button: true,
  details: true,
  iframe: true,
  input: true,
  select: true,
  textarea: true,
};

/*
 * A set of events which, if fired by the inner standard element, should be
 * re-raised by the custom element.
 *
 * These are events which are spec'ed to NOT get retargetted across a Shadow DOM
 * boundary, organized by which element(s) raise the events. To properly
 * simulate these, we will need to listen for the real events, then re-raise a
 * simulation of the original event. For more information, see
 * https://www.w3.org/TR/shadow-dom/#h-events-that-are-not-leaked-into-ancestor-trees.
 *
 * It appears that we do *not* need to re-raise the non-bubbling "focus" and
 * "blur" events. These appear to be automatically re-raised as expected -- but
 * it's not clear why that happens.
 *
 * The list below is reasonably complete. It omits elements that cannot be
 * wrapped (see class notes above). Also, we haven't actually tried wrapping
 * every element in this list; some of the more obscure ones might not actually
 * work as expected, but it was easier to include them for completeness than
 * to actually verify whether or not the element can be wrapped.
 */
/** @type {IndexedObject<string[]>} */
const reraiseEvents = {
  address: ["scroll"],
  blockquote: ["scroll"],
  caption: ["scroll"],
  center: ["scroll"],
  dd: ["scroll"],
  dir: ["scroll"],
  div: ["scroll"],
  dl: ["scroll"],
  dt: ["scroll"],
  fieldset: ["scroll"],
  form: ["reset", "scroll"],
  frame: ["load"],
  h1: ["scroll"],
  h2: ["scroll"],
  h3: ["scroll"],
  h4: ["scroll"],
  h5: ["scroll"],
  h6: ["scroll"],
  iframe: ["load"],
  img: ["abort", "error", "load"],
  input: ["abort", "change", "error", "select", "load"],
  li: ["scroll"],
  link: ["load"],
  menu: ["scroll"],
  object: ["error", "scroll"],
  ol: ["scroll"],
  p: ["scroll"],
  script: ["error", "load"],
  select: ["change", "scroll"],
  tbody: ["scroll"],
  tfoot: ["scroll"],
  thead: ["scroll"],
  textarea: ["change", "select", "scroll"],
};

/*
 * Mouse events that should be disabled if the inner component is disabled.
 */
const mouseEventNames = [
  "click",
  "dblclick",
  "mousedown",
  "mouseenter",
  "mouseleave",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "wheel",
];

// Keep track of which re-raised events should bubble.
/** @type {IndexedObject<boolean>} */
const eventBubbles = {
  abort: true,
  change: true,
  reset: true,
};

// Elements which are display: block by default.
// Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
const blockElements = [
  "address",
  "article",
  "aside",
  "blockquote",
  "canvas",
  "dd",
  "div",
  "dl",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "li",
  "main",
  "nav",
  "noscript",
  "ol",
  "output",
  "p",
  "pre",
  "section",
  "table",
  "tfoot",
  "ul",
  "video",
];

// Standard attributes that don't have corresponding properties.
// These need to be delegated from the wrapper to the inner element.
const attributesWithoutProperties = [
  "accept-charset",
  "autoplay",
  "buffered",
  "challenge",
  "codebase",
  "colspan",
  "contenteditable",
  "controls",
  "crossorigin",
  "datetime",
  "dirname",
  "for",
  "formaction",
  "http-equiv",
  "icon",
  "ismap",
  "itemprop",
  "keytype",
  "language",
  "loop",
  "manifest",
  "maxlength",
  "minlength",
  "muted",
  "novalidate",
  "preload",
  "radiogroup",
  "readonly",
  "referrerpolicy",
  "rowspan",
  "scoped",
  "usemap",
];

const Base$a = DelegateFocusMixin(ReactiveElement);

/**
 * Wraps a standard HTML element so it can be extended
 *
 * The typical way to use this class is via its static `wrap` method.
 *
 * @inherits ReactiveElement
 * @mixes DelegateFocusMixin
 * @part inner - the inner standard HTML element
 */
class WrappedStandardElement extends Base$a {
  constructor() {
    super();
    /** @type {any} */ const cast = this;
    if (!this[nativeInternals] && cast.attachInternals) {
      this[nativeInternals] = cast.attachInternals();
    }
  }

  /**
   *
   * Wrapped standard elements need to forward some attributes to the inner
   * element in cases where the attribute does not have a corresponding
   * property. These attributes include those prefixed with "aria-", and some
   * unusual standard attributes like contenteditable. To handle those, this
   * class defines its own attributeChangedCallback.
   *
   * @ignore
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const forwardAttribute = attributesWithoutProperties.indexOf(name) >= 0;
    if (forwardAttribute) {
      const innerAttributes = Object.assign({}, this[state].innerAttributes, {
        [name]: newValue,
      });
      this[setState]({ innerAttributes });
    } else {
      // Rely on the base attributeChangedCallback provided by
      // AttributeMarshallingMixin.
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  // Delegate method defined by HTMLElement.
  blur() {
    this.inner.blur();
  }

  // One HTMLElement we *don't* delegate is `click`. Generally speaking, a click
  // on the outer wrapper should behave the same as a click on the inner
  // element. Also, we want to ensure outside event listeners get a click event
  // when the click method is invoked. But a click on the inner element will
  // raise a click event that won't be re-raised by default across the shadow
  // boundary. The precise behavior seems to be slightly different in Safari
  // than other browsers, but it seems safer to not delegate click.
  //
  // click() {}

  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      innerAttributes: {},
    });
  }

  get [defaultTabIndex]() {
    return focusableByDefault[this.extends] ? 0 : -1;
  }

  /**
   * The tag name of the standard HTML element extended by this class.
   *
   * @returns {string}
   */
  get extends() {
    return this.constructor[extendsKey];
  }

  /**
   * Returns a reference to the inner standard HTML element.
   *
   * @type {HTMLElement}
   */
  get inner() {
    /** @type {any} */
    const result = this[ids] && this[ids].inner;
    if (!result) {
      /* eslint-disable no-console */
      console.warn(
        "Attempted to get an inner standard element before it was instantiated."
      );
    }
    return result;
  }

  static get observedAttributes() {
    // For our custom attributeChangedCallback to work, we need to observe
    // the attributes we want to forward.
    // @ts-ignore
    return [...super.observedAttributes, ...attributesWithoutProperties];
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    const inner = this.inner;
    if (this[firstRender]) {
      // Listen for any events raised by the inner element which will not
      // automatically be retargetted across the Shadow DOM boundary, and
      // re-raise those events when they happen.
      const eventNames = reraiseEvents[this.extends] || [];
      eventNames.forEach((eventName) => {
        inner.addEventListener(eventName, () => {
          const event = new Event(eventName, {
            bubbles: eventBubbles[eventName] || false,
          });
          this.dispatchEvent(event);
        });
      });

      // If inner element can be disabled, then listen to mouse events on the
      // *outer* element and absorb them if the inner element is disabled.
      // Without this, a mouse event like a click on the inner disabled element
      // would be treated as a click on the outer element. Someone listening to
      // clicks on the outer element would get a click event, even though the
      // overall element is supposed to be disabled.
      if ("disabled" in inner) {
        mouseEventNames.forEach((eventName) => {
          this.addEventListener(eventName, (event) => {
            if (/** @type {any} */ (inner).disabled) {
              event.stopImmediatePropagation();
            }
          });
        });
      }
    }

    if (changed.tabIndex) {
      inner.tabIndex = this[state].tabIndex;
    }

    if (changed.innerAttributes) {
      // Forward attributes to the inner element.
      // See notes at attributeChangedCallback.
      const { innerAttributes } = this[state];
      for (const name in innerAttributes) {
        applyAttribute(inner, name, innerAttributes[name]);
      }
    }

    // Forward delegated properties to the inner element.
    this.constructor[delegatedPropertySettersKey].forEach((property) => {
      if (changed[property]) {
        const value = this[state][property];

        // Inner selection properties needed to be handled specially.
        // See TrackTextSelectionMixin.
        const specialCase =
          (property === "selectionEnd" || property === "selectionStart") &&
          value === null;
        if (!specialCase) {
          inner[property] = value;
        }
      }
    });
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);

    // Apply disabled state.
    if (changed.disabled) {
      const { disabled } = this[state];
      if (disabled !== undefined) {
        setInternalState(this, "disabled", disabled);
      }
    }
  }

  /**
   * The template copied into the shadow tree of new instances of this element.
   *
   * The default value of this property is a template that includes an instance
   * the standard element being wrapped, with a `<slot>` element inside that
   * to pick up the element's light DOM content. For example, if you wrap an
   * `<a>` element, then the default template will look like:
   *
   *     <template>
   *       <style>
   *       :host {
   *         display: inline-block;
   *       }
   *       </style>
   *       <a id="inner">
   *         <slot></slot>
   *       </a>
   *     </template>
   *
   * The `display` styling applied to the host will be `block` for elements that
   * are block elements by default, and `inline-block` (not `inline`) for other
   * elements.
   *
   * If you'd like the template to include other elements, then override this
   * property and return a template of your own. The template should include an
   * instance of the standard HTML element you are wrapping, and the ID of that
   * element should be "inner".
   *
   * @type {(string|HTMLTemplateElement)}
   */
  get [template]() {
    const display = blockElements.includes(this.extends)
      ? "block"
      : "inline-block";
    const tag = this.extends;
    return templateFrom.html`
      <style>
        :host {
          display: ${display}
        }
        
        [part~="inner"] {
          box-sizing: border-box;
          height: 100%;
          width: 100%;
        }
      </style>
      <${tag} id="inner" part="inner ${tag}">
        <slot></slot>
      </${tag}>
    `;
  }

  /**
   * Creates a class that wraps a standard HTML element.
   *
   * Note that the resulting class is a subclass of WrappedStandardElement, not
   * the standard class being wrapped. E.g., if you call
   * `WrappedStandardElement.wrap('a')`, you will get a class whose shadow tree
   * will include an anchor element, but the class will *not* inherit from
   * HTMLAnchorElement.
   *
   * @static
   * @param {string} extendsTag - the standard HTML element tag to extend
   */
  static wrap(extendsTag) {
    // Create the new class.
    /** @type {Constructor<WrappedStandardElement>} */
    class Wrapped extends WrappedStandardElement {}

    // Indicate which tag it wraps.
    /** @type {any} */ (Wrapped)[extendsKey] = extendsTag;

    // Create getter/setters that delegate to the wrapped element.
    const element = document.createElement(extendsTag);
    defineDelegates(Wrapped, Object.getPrototypeOf(element));

    return Wrapped;
  }
}

/**
 * Update the given attribute on an element.
 *
 * Passing a non-null `value` acts like a call to `setAttribute(name, value)`.
 * If the supplied `value` is nullish, this acts like a call to
 * `removeAttribute(name)`.
 *
 * @private
 * @param {HTMLElement} element
 * @param {string} name
 * @param {string} value
 */
function applyAttribute(element, name, value) {
  if (standardBooleanAttributes[name]) {
    // Boolean attribute
    if (typeof value === "string") {
      element.setAttribute(name, "");
    } else if (value === null) {
      element.removeAttribute(name);
    }
  } else {
    // Regular string-valued attribute
    if (value != null) {
      element.setAttribute(name, value.toString());
    } else {
      element.removeAttribute(name);
    }
  }
}

/**
 * Create a delegate for the method or property identified by the descriptor.
 *
 * @private
 * @param {string} name
 * @param {PropertyDescriptor} descriptor
 */
function createDelegate(name, descriptor) {
  if (typeof descriptor.value === "function") {
    if (name !== "constructor") {
      return createMethodDelegate(name, descriptor);
    }
  } else if (
    typeof descriptor.get === "function" ||
    typeof descriptor.set === "function"
  ) {
    return createPropertyDelegate(name, descriptor);
  }
  return null;
}

/**
 * Create a delegate for the method identified by the descriptor.
 *
 * @private
 * @param {string} name
 * @param {PropertyDescriptor} descriptor
 */
function createMethodDelegate(name, descriptor) {
  const value = function (/** @type {any[]} */ ...args) {
    // @ts-ignore
    this.inner[name](...args);
  };
  const delegate = {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    value,
    writable: descriptor.writable,
  };
  return delegate;
}

/**
 * Create a delegate for the property identified by the descriptor.
 *
 * @private
 * @param {string} name
 * @param {PropertyDescriptor} descriptor
 */
function createPropertyDelegate(name, descriptor) {
  /** @type {PlainObject} */
  const delegate = {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
  };
  if (descriptor.get) {
    delegate.get = function () {
      return getInnerProperty(/** @type {any} */ (this), name);
    };
  }
  if (descriptor.set) {
    delegate.set = function (/** @type {any} */ value) {
      setInnerProperty(/** @type {any} */ (this), name, value);
    };
  }
  if (descriptor.writable) {
    delegate.writable = descriptor.writable;
  }
  return delegate;
}

/**
 * Define delegates for the given class for each property/method on the
 * indicated prototype.
 *
 * @private
 * @param {Constructor<Object>} cls
 * @param {Object} prototype
 */
function defineDelegates(cls, prototype) {
  const names = Object.getOwnPropertyNames(prototype);
  cls[delegatedPropertySettersKey] = [];
  names.forEach((name) => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if (!descriptor) {
      return;
    }
    const delegate = createDelegate(name, descriptor);
    if (delegate) {
      Object.defineProperty(cls.prototype, name, delegate);
      if (delegate.set) {
        cls[delegatedPropertySettersKey].push(name);
      }
    }
  });
}

/**
 * Return the value of the named property on the inner standard element.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {string} name
 */
function getInnerProperty(element, name) {
  // If we haven't rendered yet, use internal state value. Once we've
  // rendered, we get the value from the wrapped element itself. Return our
  // concept of the current property value from state. If the property hasn't
  // been defined, however, get the current value of the property from the
  // inner element.
  //
  // This is intended to support cases like an anchor element. If someone sets
  // `href` on a wrapped anchor, we'll know the value of `href` from state,
  // but we won't know the value of href-dependent calculated properties like
  // `protocol`. Using two sources of truth (state and the inner element)
  // seems fragile, but it's unclear how else to handle this without
  // reimplementing all HTML property interactions ourselves.
  //
  // This arrangement also means that, if an inner element property can change
  // in response to user interaction (e.g., an input element's value changes
  // as the user types), the component must listen to suitable events on the
  // inner element and update its state accordingly.
  const value = element[state][name];
  return value || (element[shadowRoot] && element.inner[name]);
}

/**
 * Set the named property on the inner standard element.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {string} name
 * @param {any} value
 */
function setInnerProperty(element, name, value) {
  // We normally don't check an existing state value before calling[setState],
  // relying instead on[setState] to do that check for us. However, we have
  // dangers in this particular component of creating infinite loops.
  //
  // E.g., setting the tabindex attibute will call attributeChangedCallback,
  // which will set the tabIndex property, which will want to set state, which
  // will cause a render, which will try to reflect the current value of the
  // tabIndex property to the tabindex attribute, causing a loop.
  //
  // To avoid this, we check the existing value before updating our state.
  if (element[state][name] !== value) {
    element[setState]({ [name]: value });
  }
}

const Base$9 = ComposedFocusMixin(
  DelegateInputLabelMixin(
    FocusVisibleMixin(WrappedStandardElement.wrap("button"))
  )
);

/**
 * Base class for custom buttons.
 *
 * `Button` wraps a standard HTML `button` element, allowing for custom styling
 * and behavior while ensuring standard keyboard and focus behavior.
 *
 * @inherits WrappedStandardElement
 * @mixes ComposedFocusMixin
 * @mixes DelegateInputLabelMixin
 * @mixes KeyboardMixin
 * @part button - the inner standard HTML button
 */
class Button extends Base$9 {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      role: "button",
    });
  }

  get [inputDelegate]() {
    return this[ids].inner;
  }

  // Respond to a simulated click.
  [tap]() {
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    this.dispatchEvent(clickEvent);
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          :host {
            display: inline-flex;
            outline: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }

          [part~="button"] {
            align-items: center;
            background: none;
            border: none;
            color: inherit;
            flex: 1;
            font: inherit;
            outline: none;
            padding: 0;
          }
        </style>
      `
    );
    return result;
  }
}

const wrap = Symbol("wrap");

/**
 * Adds previous/next arrow buttons to a carousel-like component.
 *
 * @module ArrowDirectionMixin
 * @param {Constructor<ReactiveElement>} Base
 * @part {Button} arrow-button - both of the arrow buttons
 * @part arrow-button-next - the arrow button that navigates to the next item
 * @part arrow-button-previous - the arrow button that navigates to the previous item
 */
function ArrowDirectionMixin(Base) {
  // The class prototype added by the mixin.
  class ArrowDirection extends Base {
    /**
     * True if the arrow buttons should overlap the component contents;
     * false if they should appear to the side of the contents.
     *
     * @type {boolean}
     * @default true
     */
    get arrowButtonOverlap() {
      return this[state].arrowButtonOverlap;
    }
    set arrowButtonOverlap(arrowButtonOverlap) {
      this[setState]({ arrowButtonOverlap });
    }

    /**
     * The class or tag used to create the `arrow-button` parts – the
     * previous/next arrow buttons.
     *
     * @type {PartDescriptor}
     */
    get arrowButtonPartType() {
      return this[state].arrowButtonPartType;
    }
    set arrowButtonPartType(arrowButtonPartType) {
      this[setState]({ arrowButtonPartType });
    }

    // TODO: Symbols
    arrowButtonPrevious() {
      if (super.arrowButtonPrevious) {
        return super.arrowButtonPrevious();
      } else {
        return this[goPrevious]();
      }
    }

    arrowButtonNext() {
      if (super.arrowButtonNext) {
        return super.arrowButtonNext();
      } else {
        return this[goNext]();
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "arrow-button-overlap") {
        this.arrowButtonOverlap = String(newValue) === "true";
      } else if (name === "show-arrow-buttons") {
        this.showArrowButtons = String(newValue) === "true";
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        arrowButtonOverlap: true,
        arrowButtonPartType: Button,
        orientation: "horizontal",
        showArrowButtons: true,
      });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (changed.arrowButtonPartType) {
        const arrowButtonPrevious = this[ids].arrowButtonPrevious;
        if (arrowButtonPrevious instanceof HTMLElement) {
          // Turn off focus handling for old previous button.
          forwardFocus(arrowButtonPrevious, null);
        }
        const arrowButtonNext = this[ids].arrowButtonNext;
        if (arrowButtonNext instanceof HTMLElement) {
          // Turn off focus handling for old next button.
          forwardFocus(arrowButtonNext, null);
        }
      }

      if (super[render]) {
        super[render](changed);
      }

      renderParts$1(this[shadowRoot], this[state], changed);

      if (changed.arrowButtonPartType) {
        /** @type {any} */
        const cast = this;

        const arrowButtonPrevious = this[ids].arrowButtonPrevious;
        if (arrowButtonPrevious instanceof HTMLElement) {
          forwardFocus(arrowButtonPrevious, cast);
        }
        const previousButtonHandler = createButtonHandler(this, () =>
          this.arrowButtonPrevious()
        );
        arrowButtonPrevious.addEventListener(
          "mousedown",
          previousButtonHandler
        );

        const arrowButtonNext = this[ids].arrowButtonNext;
        if (arrowButtonNext instanceof HTMLElement) {
          forwardFocus(arrowButtonNext, cast);
        }
        const nextButtonHandler = createButtonHandler(this, () =>
          this.arrowButtonNext()
        );
        arrowButtonNext.addEventListener("mousedown", nextButtonHandler);
      }

      const {
        arrowButtonOverlap,
        canGoNext,
        canGoPrevious,
        orientation,
        rightToLeft,
      } = this[state];
      const vertical = orientation === "vertical";
      /** @type {any} */ const arrowButtonPrevious = this[ids]
        .arrowButtonPrevious;
      /** @type {any} */ const arrowButtonNext = this[ids].arrowButtonNext;

      // Position the buttons.
      if (
        changed.arrowButtonOverlap ||
        changed.orientation ||
        changed.rightToLeft
      ) {
        this[ids].arrowDirection.style.flexDirection = vertical
          ? "column"
          : "row";
        this[ids].arrowDirectionContainer.style.maxHeight = vertical
          ? "100%"
          : "";

        const buttonStyle = {
          bottom: null,
          left: null,
          right: null,
          top: null,
        };
        if (arrowButtonOverlap) {
          Object.assign(buttonStyle, {
            position: "absolute",
            "z-index": 1,
          });
        } else {
          Object.assign(buttonStyle, {
            position: null,
            "z-index": null,
          });
        }
        let previousButtonStyle;
        let nextButtonStyle;
        if (arrowButtonOverlap) {
          if (vertical) {
            // Vertical
            Object.assign(buttonStyle, {
              left: 0,
              right: 0,
            });
            previousButtonStyle = {
              top: 0,
            };
            nextButtonStyle = {
              bottom: 0,
            };
          } else {
            // Horizontal
            Object.assign(buttonStyle, {
              bottom: 0,
              top: 0,
            });
            if (rightToLeft) {
              previousButtonStyle = {
                right: 0,
              };
              nextButtonStyle = {
                left: 0,
              };
            } else {
              // Typical condition: horizontal, left-to-right
              previousButtonStyle = {
                left: 0,
              };
              nextButtonStyle = {
                right: 0,
              };
            }
          }
        }
        Object.assign(
          arrowButtonPrevious.style,
          buttonStyle,
          previousButtonStyle
        );
        Object.assign(arrowButtonNext.style, buttonStyle, nextButtonStyle);
      }

      // Disable the previous/next buttons if we can't go in those directions.
      // WORKAROUND: We check to makes sure that can go previous/next state is
      // defined (which happens once the component has items). Without that
      // check, as of May 2019, a Chrome bug prevents the use of this mixin:
      // multiple carousel instances on a page will have their next button
      // initially disabled even when it should be enabled. Safari/Firefox do
      // not exhibit that issue. Since identifying the root cause proved too
      // difficult, this check was added.
      if (changed.canGoNext && canGoNext !== null) {
        arrowButtonNext.disabled = !canGoNext;
      }
      // See note for canGoNext above.
      if (changed.canGoPrevious && canGoPrevious !== null) {
        arrowButtonPrevious.disabled = !canGoPrevious;
      }

      if (changed.showArrowButtons) {
        const display = this[state].showArrowButtons ? null : "none";
        arrowButtonPrevious.style.display = display;
        arrowButtonNext.style.display = display;
      }
    }

    get showArrowButtons() {
      return this[state].showArrowButtons;
    }
    set showArrowButtons(showArrowButtons) {
      this[setState]({ showArrowButtons });
    }

    /**
     * Destructively wrap a node with elements to show arrow buttons.
     *
     * @param {Element} target - the node that should be wrapped by buttons
     */
    [wrap](target) {
      const arrowControls = fragmentFrom.html`
        <div
          id="arrowDirection"
          role="none"
          style="display: flex; flex: 1; overflow: hidden; position: relative;"
        >
          <div
            id="arrowButtonPrevious"
            part="arrow-button arrow-button-previous"
            exportparts="inner:arrow-button-inner"
            class="arrowButton"
            aria-hidden="true"
            tabindex="-1"
          >
            <slot name="arrowButtonPrevious"></slot>
          </div>
          <div
            id="arrowDirectionContainer"
            role="none"
            style="flex: 1; position: relative;"
          ></div>
          <div
            id="arrowButtonNext"
            part="arrow-button arrow-button-next"
            exportparts="inner:arrow-button-inner"
            class="arrowButton"
            aria-hidden="true"
            tabindex="-1"
          >
            <slot name="arrowButtonNext"></slot>
          </div>
        </div>
      `;

      renderParts$1(arrowControls, this[state]);

      // Wrap the target with the arrow controls.
      const container = arrowControls.getElementById("arrowDirectionContainer");
      if (container) {
        target.replaceWith(arrowControls);
        container.append(target);
      }
    }
  }

  return ArrowDirection;
}

/**
 * @private
 * @param {ReactiveElement} element
 * @param {function} callback
 * @returns {EventListener}
 */
function createButtonHandler(element, callback) {
  return async function mousedown(/** @type {Event} */ event) {
    // Only process events for the main (usually left) button.
    /** @type {any} */ const cast = event;
    if (cast.button !== 0) {
      return;
    }
    element[raiseChangeEvents] = true;
    const handled = callback();
    if (handled) {
      event.stopPropagation();
    }
    await Promise.resolve();
    element[raiseChangeEvents] = false;
  };
}

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts$1(root, state, changed) {
  if (!changed || changed.arrowButtonPartType) {
    const { arrowButtonPartType } = state;
    const arrowButtonPrevious = root.getElementById("arrowButtonPrevious");
    if (arrowButtonPrevious) {
      transmute(arrowButtonPrevious, arrowButtonPartType);
    }
    const arrowButtonNext = root.getElementById("arrowButtonNext");
    if (arrowButtonNext) {
      transmute(arrowButtonNext, arrowButtonPartType);
    }
  }
}

ArrowDirectionMixin.wrap = wrap;

/**
 * Maps direction semantics to cursor semantics.
 *
 * This turns a movement in a direction (go left, go right) into a cursor
 * operation (go previous, go next).
 *
 * This mixin can be used in conjunction with
 * [KeyboardDirectionMixin](KeyboardDirectionMixin) (which maps keyboard events
 * to directions) and a mixin that handles cursor operations like
 * [ItemsCursorMixin](ItemsCursorMixin).
 *
 * @module DirectionCursorMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function DirectionCursorMixin(Base) {
  // The class prototype added by the mixin.
  class DirectionCursor extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        canGoDown: null,
        canGoLeft: null,
        canGoRight: null,
        canGoUp: null,
      });
    }

    /**
     * Interprets `goDown` to mean "move to the next item".
     */
    [goDown]() {
      if (super[goDown]) {
        super[goDown]();
      }
      return this[goNext]();
    }

    /**
     * Interprets `goEnd` to mean "move to the last item".
     */
    [goEnd]() {
      if (super[goEnd]) {
        super[goEnd]();
      }
      return this[goLast]();
    }

    /**
     * Interprets `goLeft` to mean "move to the previous item".
     *
     * If the element has a `rightToLeft` property and it is true, then this
     * moves to the _next_ item.
     */
    [goLeft]() {
      if (super[goLeft]) {
        super[goLeft]();
      }
      return this[state] && this[state].rightToLeft
        ? this[goNext]()
        : this[goPrevious]();
    }

    /**
     * Interprets `goRight` to mean "move to the next item".
     *
     * If the element has a `rightToLeft` property and it is true, then this
     * moves to the _previous_ item.
     */
    [goRight]() {
      if (super[goRight]) {
        super[goRight]();
      }
      return this[state] && this[state].rightToLeft
        ? this[goPrevious]()
        : this[goNext]();
    }

    /**
     * Interprets `goStart` to mean "move to the first item".
     */
    [goStart]() {
      if (super[goStart]) {
        super[goStart]();
      }
      return this[goFirst]();
    }

    /**
     * Interprets `goUp` to mean "move to the previous item".
     */
    [goUp]() {
      if (super[goUp]) {
        super[goUp]();
      }
      return this[goPrevious]();
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // Update computed state members to track whether we can go
      // down/left/right/up.
      if (
        changed.canGoNext ||
        changed.canGoPrevious ||
        changed.languageDirection ||
        changed.orientation ||
        changed.rightToLeft
      ) {
        const { canGoNext, canGoPrevious, orientation, rightToLeft } = state;
        const horizontal =
          orientation === "horizontal" || orientation === "both";
        const vertical = orientation === "vertical" || orientation === "both";
        const canGoDown = vertical && canGoNext;
        const canGoLeft = !horizontal
          ? false
          : rightToLeft
          ? canGoNext
          : canGoPrevious;
        const canGoRight = !horizontal
          ? false
          : rightToLeft
          ? canGoPrevious
          : canGoNext;
        const canGoUp = vertical && canGoPrevious;
        Object.assign(effects, {
          canGoDown,
          canGoLeft,
          canGoRight,
          canGoUp,
        });
      }

      return effects;
    }
  }

  return DirectionCursor;
}

/**
 * Exposes a public API for navigating a cursor over a set of items
 *
 * This mixin expects a component to provide an `items` Array of all elements in
 * the list. This mixin also expects the component to apply
 * [ItemsCursorMixin](ItemsCursorMixin) or otherwise define a compatible
 * `currentIndex` state and other state members for navigating the current item.
 *
 * Given the above, this mixin exposes a consistent public API for reading and
 * manipulating the cursor.
 *
 * @module CursorAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function CursorAPIMixin(Base) {
  // The class prototype added by the mixin.
  class CursorAPI extends Base {
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "current-index") {
        this.currentIndex = Number(newValue);
      } else if (name === "current-item-required") {
        const value = booleanAttributeValue(name, newValue);
        if (this.currentItemRequired !== value) {
          this.currentItemRequired = value;
        }
      } else if (name === "cursor-operations-wrap") {
        const value = booleanAttributeValue(name, newValue);
        if (this.cursorOperationsWrap !== value) {
          this.cursorOperationsWrap = value;
        }
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    /**
     * The index of the current item, or -1 if no item is current.
     *
     * @type {number}
     */
    get currentIndex() {
      const { items, currentIndex } = this[state];
      return items && items.length > 0 ? currentIndex : -1;
    }
    set currentIndex(currentIndex) {
      if (!isNaN(currentIndex)) {
        this[setState]({ currentIndex });
      }
    }

    /**
     * The current item, or null if no item is current.
     *
     * @type {Element}
     */
    get currentItem() {
      const { items, currentIndex } = this[state];
      return items && items[currentIndex];
    }
    set currentItem(currentItem) {
      const { items } = this[state];
      if (!items) {
        return;
      }
      const currentIndex = items.indexOf(currentItem);
      this[setState]({ currentIndex });
    }

    /**
     * True if the list should always have a current item (if it has items).
     *
     * @type {boolean}
     * @default false
     */
    get currentItemRequired() {
      return this[state].currentItemRequired;
    }
    set currentItemRequired(currentItemRequired) {
      this[setState]({ currentItemRequired });
    }

    /**
     * True if cursor operations wrap from last to first, and vice versa.
     *
     * @type {boolean}
     * @default false
     */
    get cursorOperationsWrap() {
      return this[state].cursorOperationsWrap;
    }
    set cursorOperationsWrap(cursorOperationsWrap) {
      this[setState]({ cursorOperationsWrap });
    }

    /**
     * Moves to the first item in the list.
     *
     * @returns {Boolean} True if the current item changed, false if not.
     */
    goFirst() {
      if (super.goFirst) {
        super.goFirst();
      }
      return this[goFirst]();
    }

    /**
     * Move to the last item in the list.
     *
     * @returns {Boolean} True if the current item changed
     */
    goLast() {
      if (super.goLast) {
        super.goLast();
      }
      return this[goLast]();
    }

    /**
     * Move to the next item in the list.
     *
     * If the list has no current item, the first item will become current.
     *
     * @returns {Boolean} True if the current item changed
     */
    goNext() {
      if (super.goNext) {
        super.goNext();
      }
      return this[goNext]();
    }

    /**
     * Moves to the previous item in the list.
     *
     * If the list has no current item, the last item will become current.
     *
     * @returns {Boolean} True if the current item changed
     */
    goPrevious() {
      if (super.goPrevious) {
        super.goPrevious();
      }
      return this[goPrevious]();
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }
      if (changed.currentIndex && this[raiseChangeEvents]) {
        const { currentIndex } = this[state];
        /**
         * Raised when the `currentIndex` property changes.
         *
         * @event currentindexchange
         */
        const event = new CustomEvent("currentindexchange", {
          bubbles: true,
          detail: { currentIndex },
        });
        this.dispatchEvent(event);
      }
    }
  }

  return CursorAPI;
}

/**
 * Keeps the current item and selected item in sync.
 *
 * This can be used to connect [ItemsCursorMixin](ItemsCursorMixin) with
 * [SingleSelectAPIMixin](SingleSelectAPIMixin).
 *
 * @module CursorSelectMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function CursorSelectMixin(Base) {
  // The class prototype added by the mixin.
  return class CursorSelect extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        selectedIndex: -1,
        selectedItem: null,
      });
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      if (changed.currentIndex) {
        // Priority one: selected index tracks current index.
        Object.assign(effects, {
          selectedIndex: state.currentIndex,
        });
      } else if (changed.selectedIndex) {
        // Priority two: current index tracks selected index.
        // These priorities ensure that, both current index and selected index
        // are changed, current index wins.
        Object.assign(effects, {
          currentIndex: state.selectedIndex,
        });
      }

      // Same priorities as above.
      if (changed.currentItem) {
        Object.assign(effects, {
          selectedItem: state.currentItem,
        });
      } else if (changed.selectedItem) {
        Object.assign(effects, {
          currentItem: state.selectedItem,
        });
      }

      return effects;
    }
  };
}

/**
 * Exposes a public API for the set of items in a list-like element
 *
 * @module ItemsAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function ItemsAPIMixin(Base) {
  // The class prototype added by the mixin.
  class ItemsAPI extends Base {
    /**
     * The current set of items drawn from the element's current state.
     *
     * @type {ListItemElement[]} the element's current items
     */
    get items() {
      return this[state] ? this[state].items : null;
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      // Raise items-changed if items changed after the initial render. We'll
      // see changed.items on initial render, and raiseChangeEvents will be true
      // if we're using SlotContentMixin, but we don't want to actually raise
      // the event then because the items didn't change in response to user
      // activity.
      if (!this[firstRender] && changed.items && this[raiseChangeEvents]) {
        /**
         * Raised when the `items` property changes.
         *
         * @event itemschange
         */
        const event = new CustomEvent("itemschange", {
          bubbles: true,
        });
        this.dispatchEvent(event);
      }
    }
  }

  return ItemsAPI;
}

/**
 * Tracks and navigates the current item in a set of items
 *
 * @module ItemsCursorMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function ItemsCursorMixin(Base) {
  // The class prototype added by the mixin.
  class ItemsCursor extends Base {
    /**
     * Look for an item which is available in the given state..
     *
     * The `options` parameter can accept options for:
     *
     * * `direction`: 1 to move forward, -1 to move backward
     * * `index`: the index to start at, defaults to `state.currentIndex`
     * * `wrap`: whether to wrap around the ends of the `items` array, defaults
     *   to `state.cursorOperationsWrap`.
     *
     * If an available item was found, this returns its index. If no item was
     * found, this returns -1.
     *
     * @param {PlainObject} state
     * @param {PlainObject} options
     * @returns {number}
     */
    [closestAvailableItemIndex](state, options = {}) {
      const direction = options.direction !== undefined ? options.direction : 1;
      const index =
        options.index !== undefined ? options.index : state.currentIndex;
      const wrap =
        options.wrap !== undefined ? options.wrap : state.cursorOperationsWrap;

      const { items } = state;
      const count = items ? items.length : 0;

      if (count === 0) {
        // No items
        return -1;
      }

      if (wrap) {
        // Search with wrapping.

        // Modulus taking into account negative numbers.
        let i = ((index % count) + count) % count;
        const end = (((i - direction) % count) + count) % count;
        while (i !== end) {
          const available = state.availableItemFlags
            ? state.availableItemFlags[i]
            : true;
          if (available) {
            return i;
          }
          // See modulus note above.
          i = (((i + direction) % count) + count) % count;
        }
      } else {
        // Search without wrapping.
        for (let i = index; i >= 0 && i < count; i += direction) {
          const available = state.availableItemFlags
            ? state.availableItemFlags[i]
            : true;
          if (available) {
            return i;
          }
        }
      }

      return -1; // No item found
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        currentIndex: -1,
        desiredCurrentIndex: null,
        currentItem: null,
        currentItemRequired: false,
        cursorOperationsWrap: false,
      });
    }

    /**
     * Move to the first item in the set.
     *
     * @protected
     * @returns {Boolean} True if the current item changed, false if not.
     */
    [goFirst]() {
      if (super[goFirst]) {
        super[goFirst]();
      }
      return moveToIndex(this, 0, 1);
    }

    /**
     * Move to the last item in the set.
     *
     * @protected
     * @returns {Boolean} True if the current item changed, false if not.
     */
    [goLast]() {
      if (super[goLast]) {
        super[goLast]();
      }
      return moveToIndex(this, this[state].items.length - 1, -1);
    }

    /**
     * Move to the next item in the set.
     *
     * If no item is current, move to the first item.
     *
     * @protected
     * @returns {Boolean} True if the current item changed, false if not.
     */
    [goNext]() {
      if (super[goNext]) {
        super[goNext]();
      }
      const { currentIndex, items } = this[state];
      const start = currentIndex < 0 && items ? 0 : currentIndex + 1;
      return moveToIndex(this, start, 1);
    }

    /**
     * Move to the previous item in the set.
     *
     * If no item is current, move to the last item.
     *
     * @protected
     * @returns {Boolean} True if the current item changed, false if not.
     */
    [goPrevious]() {
      if (super[goPrevious]) {
        super[goPrevious]();
      }
      const { currentIndex, items } = this[state];
      const start =
        currentIndex < 0 && items ? items.length - 1 : currentIndex - 1;
      return moveToIndex(this, start, -1);
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // Ensure currentIndex is valid.
      if (
        changed.availableItemFlags ||
        changed.items ||
        changed.currentIndex ||
        changed.currentItemRequired
      ) {
        const {
          currentIndex,
          desiredCurrentIndex,
          currentItem,
          currentItemRequired,
          items,
        } = state;

        const count = items ? items.length : 0;

        // Determine the desired index: the one we want irrespective of whether
        // we have items or their availability.
        // Assume we'll stick with the same desired index we already have.
        let newDesiredIndex = desiredCurrentIndex;
        if (
          changed.items &&
          !changed.currentIndex &&
          currentItem &&
          count > 0 &&
          items[currentIndex] !== currentItem
        ) {
          // The items changed, and the item at the cursor is no longer the
          // same. See if we can find that item again in the list of items.
          const newItemIndex = items.indexOf(currentItem);
          if (newItemIndex >= 0) {
            // Found the item again; try to use its index.
            newDesiredIndex = newItemIndex;
          }
        } else if (
          changed.currentIndex &&
          ((currentIndex < 0 && currentItem !== null) ||
            (currentIndex >= 0 &&
              (count === 0 || items[currentIndex] !== currentItem)) ||
            desiredCurrentIndex === null)
        ) {
          // Someone explicitly moved the cursor, which trumps any previously
          // desired index.
          newDesiredIndex = currentIndex;
        }

        // If an item is required and there's no selection, we'll implicitly try
        // to get the first available item.
        if (currentItemRequired && newDesiredIndex < 0) {
          newDesiredIndex = 0;
        }

        // Now that we know what index we want, see how close we can get to it.
        let newIndex;
        if (newDesiredIndex < 0) {
          // All negative indices are equivalent to -1.
          newDesiredIndex = -1;
          newIndex = -1;
        } else if (count === 0) {
          // No items yet.
          newIndex = -1;
        } else {
          // See how close we can get to the desired index.
          // First clamp index to existing array bounds.
          newIndex = Math.max(Math.min(count - 1, newDesiredIndex), 0);
          // Look for an available item going forward.
          newIndex = this[closestAvailableItemIndex](state, {
            direction: 1,
            index: newIndex,
            wrap: false,
          });
          if (newIndex < 0) {
            // Next best: look for an available item going backward.
            newIndex = this[closestAvailableItemIndex](state, {
              direction: -1,
              index: newIndex - 1,
              wrap: false,
            });
          }
        }

        const newItem = (items && items[newIndex]) || null;
        Object.assign(effects, {
          currentIndex: newIndex,
          desiredCurrentIndex: newDesiredIndex,
          currentItem: newItem,
        });
      }

      return effects;
    }
  }

  return ItemsCursor;
}

/**
 * Update currentIndex and return true if it changed.
 *
 * @private
 * @param {Element} element
 * @param {number} index
 * @param {number} direction
 */
function moveToIndex(element, index, direction) {
  const newIndex = element[closestAvailableItemIndex](element[state], {
    direction,
    index,
  });
  if (newIndex < 0) {
    // Couldn't find an item to move to.
    return false;
  }
  // Normally we don't check to see if state is going to change before setting
  // state, but the methods defined by this mixin want to be able to return true
  // if the index is actually going to change.
  const changed = element[state].currentIndex !== newIndex;
  if (changed) {
    element[setState]({
      currentIndex: newIndex,
    });
  }
  return changed;
}

/**
 * Lets an element determine whether it resides in right-to-left text.
 *
 * @module LanguageDirectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function LanguageDirectionMixin(Base) {
  // The class prototype added by the mixin.
  return class LanguageDirection extends Base {
    // The only way to get text direction is to wait for the component to
    // connect and then inspect the computed style on its root element. We set
    // state before calling super so the new state will be included when
    // ReactiveMixin calls render.
    connectedCallback() {
      /** @type {any} */ const element = this;
      const languageDirection = getComputedStyle(element).direction;
      const rightToLeft = languageDirection === "rtl";
      this[setState]({ rightToLeft });
      super.connectedCallback();
    }
  };
}

/**
 * Utilities for working with scrolling.
 *
 * @module defaultScrollTarget
 */

/**
 * Returns true if the given target or any of its ancestors can be scrolled
 * in the indicated direction.
 *
 * This is used, e.g., by gesture event handlers to predict if the default
 * behavior for a given event is likely to result in scrolling.
 *
 * @param {EventTarget} target
 * @param {'horizontal'|'vertical'} orientation
 * @param {boolean} downOrRight
 */
function canScrollInDirection(target, orientation, downOrRight) {
  if (!(target instanceof Node)) {
    return false;
  }
  for (const ancestor of selfAndComposedAncestors(target)) {
    if (ancestor instanceof HTMLElement) {
      const style = getComputedStyle(ancestor);
      const vertical = orientation === "vertical";
      const scrollAxisMatch =
        (vertical &&
          (style.overflowY === "scroll" || style.overflowY === "auto")) ||
        (!vertical &&
          (style.overflowX === "scroll" || style.overflowX === "auto"));
      if (scrollAxisMatch) {
        // Found an ancestor that can potentially scroll in this orientation.
        const scrollEdge = vertical ? "scrollTop" : "scrollLeft";
        if (!downOrRight && ancestor[scrollEdge] > 0) {
          // Target has room to scroll up or left.
          return true;
        }
        const scrollLength = vertical ? "scrollHeight" : "scrollWidth";
        const clientLength = vertical ? "clientHeight" : "clientWidth";
        const scrollMax = ancestor[scrollLength] - ancestor[clientLength];
        if (downOrRight && ancestor[scrollEdge] < scrollMax) {
          // Target has room to scroll down or right.
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * This helper returns a guess as to what portion of the given element can be
 * scrolled. This is used by [CursorInViewMixin](CursorInViewMixin) to
 * provide a default implementation of [scrollTarget].
 *
 * If the element has a shadow root containing a default (unnamed) slot, this
 * returns the first ancestor of that slot that has either `overflow-x` or
 * `overflow-y` styled as `auto` or `scroll`. If the element has no default
 * slot, or no scrolling ancestor is found, the element itself is returned.
 *
 * @param {Element} element – the component to examine for a scrolling
 * element
 * @returns {Element}
 */
function defaultScrollTarget(element) {
  const root = element[shadowRoot];
  const slot = root && root.querySelector("slot:not([name])");
  const scrollingParent =
    slot &&
    slot.parentNode instanceof Element &&
    getScrollableElement(slot.parentNode);
  return scrollingParent || element;
}

/**
 * Return true if the given element can be scrolled.
 *
 * @private
 * @param {HTMLElement} element
 */
function isElementScrollable(element) {
  const style = getComputedStyle(element);
  const overflowX = style.overflowX;
  const overflowY = style.overflowY;
  return (
    overflowX === "scroll" ||
    overflowX === "auto" ||
    overflowY === "scroll" ||
    overflowY === "auto"
  );
}

/**
 * If the given element can be scrolled, return that. If not, return the closest
 * ancestor that can be scrolled. If no such ancestor is found, return null.
 *
 * @param {Element} node
 * @returns {Element|null}
 */
function getScrollableElement(node) {
  for (const ancestor of selfAndComposedAncestors(node)) {
    if (ancestor instanceof HTMLElement && isElementScrollable(ancestor)) {
      return ancestor;
    }
  }
  return null;
}

/**
 * Scrolls to ensure the current item is visible
 *
 * When the current item in a list-like component changes, the current item
 * should be brought into view so that the user can confirm their selection.
 *
 * This mixin expects an `items` collection, such as that provided by
 * [ContentItemsMixin](ContentItemsMixin). It also expects a
 * `state.currentItem` member indicating which item is current. You
 * can supply that yourself, or use
 * [ItemsCursorMixin](ItemsCursorMixin).
 *
 * @module CursorInViewMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function CursorInViewMixin(Base) {
  // The class prototype added by the mixin.
  class CursorInView extends Base {
    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      if (changed.currentItem) {
        this.scrollCurrentItemIntoView();
      }
    }

    /**
     * Scroll the current item completely into view, minimizing the degree of
     * scrolling performed.
     *
     * Blink has a `scrollIntoViewIfNeeded()` function that does something
     * similar, but unfortunately it's non-standard, and in any event often ends
     * up scrolling more than is absolutely necessary.
     *
     * This scrolls the containing element defined by the `scrollTarget`
     * property. By default, it will scroll the element itself.
     */
    scrollCurrentItemIntoView() {
      if (super.scrollCurrentItemIntoView) {
        super.scrollCurrentItemIntoView();
      }

      const { currentItem, items } = this[state];
      if (!currentItem || !items) {
        return;
      }

      // Determine the bounds of the scroll target and item. We use
      // getBoundingClientRect instead of .offsetTop, etc., because the latter
      // round values, and we want to handle fractional values.
      const scrollTargetRect = this[scrollTarget].getBoundingClientRect();
      const itemRect = currentItem.getBoundingClientRect();

      // Determine how far the item is outside the viewport.
      const bottomDelta = itemRect.bottom - scrollTargetRect.bottom;
      const leftDelta = itemRect.left - scrollTargetRect.left;
      const rightDelta = itemRect.right - scrollTargetRect.right;
      const topDelta = itemRect.top - scrollTargetRect.top;

      // Scroll the target as necessary to bring the item into view.
      // If an `orientation` state member is defined, only scroll along that
      // axis. Otherwise, assume the orientation is "both".
      const orientation = this[state].orientation || "both";
      if (orientation === "horizontal" || orientation === "both") {
        if (rightDelta > 0) {
          this[scrollTarget].scrollLeft += rightDelta; // Scroll right
        } else if (leftDelta < 0) {
          this[scrollTarget].scrollLeft += Math.ceil(leftDelta); // Scroll left
        }
      }
      if (orientation === "vertical" || orientation === "both") {
        if (bottomDelta > 0) {
          this[scrollTarget].scrollTop += bottomDelta; // Scroll down
        } else if (topDelta < 0) {
          this[scrollTarget].scrollTop += Math.ceil(topDelta); // Scroll up
        }
      }
    }

    /**
     * The element that should be scrolled to get the selected item into view.
     *
     * By default, this uses the [defaultScrollTarget](defaultScrollTarget)
     * helper to find the most likely candidate for scrolling. You can override
     * this property to directly identify which element should be scrolled.
     *
     * See also [scrollTarget](internal#internal.scrollTarget).
     */
    get [scrollTarget]() {
      const base = super[scrollTarget];
      /** @type {any} */
      const element = this;
      return base || defaultScrollTarget(element);
    }
  }

  return CursorInView;
}

/**
 * Allows a component to participate in HTML form submission.
 *
 * The mixin expects the component to define a `value` property of type
 * `string`.
 *
 * @module FormElementMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function FormElementMixin(Base) {
  // The class prototype added by the mixin.
  class FormElement extends Base {
    constructor() {
      super();
      /** @type {any} */ const cast = this;
      if (!this[nativeInternals] && cast.attachInternals) {
        this[nativeInternals] = cast.attachInternals();
      }
    }

    checkValidity() {
      return this[nativeInternals].checkValidity();
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        name: "",
        validationMessage: "",
        valid: true,
      });
    }

    // Uncomment for debugging only
    get internals() {
      return this[nativeInternals];
    }

    static get formAssociated() {
      return true;
    }

    /**
     * The ID of the `form` element with which this element is associated,
     * or `null` if the element is not associated with any form. This is provided
     * for consistency with the native HTML
     * [form](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form)
     * property.
     *
     * @type {string}
     */
    get form() {
      return this[nativeInternals].form;
    }

    /**
     * The name of the form field that will be filled with this element's
     * `value`. This is an analogue of the standard HTML
     * [name](https://developer.mozilla.org/en-US/docs/Web/API/Element/name)
     * property.
     *
     * @type {string}
     */
    get name() {
      return this[state] ? this[state].name : "";
    }
    set name(name) {
      const s = String(name);
      if ("name" in Base.prototype) {
        super.name = s;
      }
      this[setState]({
        name: s,
      });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }

      // Reflect name property to attribute so form will pick it up.
      if (changed.name) {
        const { name } = this[state];
        if (name) {
          this.setAttribute("name", name);
        } else {
          this.removeAttribute("name");
        }
      }

      if (this[nativeInternals] && this[nativeInternals].setValidity) {
        // Reflect validity state to internals.
        if (changed.valid || changed.validationMessage) {
          const { valid, validationMessage } = this[state];
          if (valid) {
            this[nativeInternals].setValidity({});
          } else {
            this[nativeInternals].setValidity(
              {
                customError: true,
              },
              validationMessage
            );
          }
        }
      }
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }
      if (changed.value) {
        if (this[nativeInternals] && this[nativeInternals].setFormValue) {
          this[nativeInternals].setFormValue(this[state].value, this[state]);
        }
      }
    }

    reportValidity() {
      return this[nativeInternals].reportValidity();
    }

    /**
     * The "type" of the form field, provided for consistency with the
     * native HTML
     * [type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type)
     * property.
     *
     * If a base class provides a `type` property, that will be returned. (If
     * this mixin is applied to a class defined by WrappedStandardElement, this
     * will return the `type` of the inner standard element.) Otherwise, the
     * default value of this property will be the same as the HTML tag name
     * registered for the custom element.
     *
     * @type {string}
     */
    get type() {
      // Defer to base class value.
      return super.type || this.localName;
    }

    get validationMessage() {
      return this[state].validationMessage;
    }

    get validity() {
      return this[nativeInternals].validity;
    }

    get willValidate() {
      return this[nativeInternals].willValidate;
    }
  }

  return FormElement;
}

/**
 * Helpers for working with element content.
 *
 * @module content
 */

// These are tags for elements that can appear in the document body, but do not
// seem to have any user-visible manifestation.
// See https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const auxiliarycustomTags = [
  "applet", // deprecated
  "basefont", // deprecated
  "embed",
  "font", // deprecated
  "frame", // deprecated
  "frameset", // deprecated
  "isindex", // deprecated
  "keygen", // deprecated
  "link",
  "multicol", // deprecated
  "nextid", // deprecated
  "noscript",
  "object",
  "param",
  "script",
  "style",
  "template",
  "noembed", // deprecated
];

/**
 * Use a heuristic to extract text from the given item.
 *
 * This looks, in order, at: the `aria-label` attribute, the `alt` attribute,
 * `innerText`, or `textContent`.
 *
 * This function is used as the default implementation of the
 * [getItemText](internal#getItemText) function in several mixins.
 *
 * @param {Element} element
 * @returns {string}
 */
function getDefaultText(element) {
  return (
    element.getAttribute("aria-label") ||
    element.getAttribute("alt") ||
    /** @type {any} */ (element).innerText ||
    element.textContent ||
    ""
  );
}

/**
 * Return true if the given node is likely to be useful as component content.
 *
 * This will be `true` for nodes that are: a) instances of `Element`
 * (`HTMLElement` or `SVGElement`), and b) not on a blacklist of normally
 * invisible elements (such as `style` or `script`). Among other things, this
 * returns `false` for Text nodes.
 *
 * This is used by [ContentItemsMixin](ContentItemsMixin) to filter out nodes
 * which are unlikely to be interesting as list items. This is intended to
 * satisfy the Gold Standard checklist criteria [Auxiliary
 * Content](https://github.com/webcomponents/gold-standard/wiki/Auxiliary-Content),
 * so that a component does not inadvertently treat `<style>` and other invisible
 * items as element content.
 *
 * @param {Node} node
 * @returns {boolean}
 */
function isSubstantiveElement(node) {
  return (
    node instanceof Element &&
    (!node.localName || auxiliarycustomTags.indexOf(node.localName) < 0)
  );
}

/**
 * Exposes the text content of a list's items as an array of strings.
 *
 * @module ItemsTextMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function ItemsTextMixin(Base) {
  // The class prototype added by the mixin.
  class ItemsText extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        texts: null,
      });
    }

    /**
     * Extract the text from the given item.
     *
     * The default implementation returns an item's `aria-label`, `alt`
     * attribute, `innerText`, or `textContent`, in that order. You can override
     * this to return the text that should be used.
     *
     * @param {Element} item
     * @returns {string}
     */
    [getItemText](item) {
      return super[getItemText]
        ? super[getItemText](item)
        : getDefaultText(item);
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // Regenerate texts when items change.
      if (changed.items) {
        const { items } = state;
        const texts = getTextsFromItems(items, this[getItemText]);
        if (texts) {
          Object.freeze(texts);
          Object.assign(effects, { texts });
        }
      }

      return effects;
    }
  }

  return ItemsText;
}

/**
 * Extract the text from the given items.
 *
 * @private
 * @param {Element[]} items
 */
function getTextsFromItems(items, getText) {
  return items ? Array.from(items, (item) => getText(item)) : null;
}

/**
 * Maps direction keys to direction semantics.
 *
 * This mixin is useful for components that want to map direction keys (Left,
 * Right, etc.) to movement in the indicated direction (go left, go right,
 * etc.).
 *
 * This mixin expects the component to invoke a `keydown` method when a key is
 * pressed. You can use [KeyboardMixin](KeyboardMixin) for that
 * purpose, or wire up your own keyboard handling and call `keydown` yourself.
 *
 * This mixin calls methods such as `goLeft` and `goRight`. You can define
 * what that means by implementing those methods yourself. If you want to use
 * direction keys to navigate a selection, use this mixin with
 * [DirectionCursorMixin](DirectionCursorMixin).
 *
 * If the component defines a property called `orientation`, the value of that
 * property will constrain navigation to the horizontal or vertical axis.
 *
 * @module KeyboardDirectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function KeyboardDirectionMixin(Base) {
  // The class prototype added by the mixin.
  class KeyboardDirection extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState], {
        handleBubblingDirectionKeys: false,
      });
    }

    /**
     * Invoked when the user wants to go/navigate down.
     * The default implementation of this method does nothing.
     */
    [goDown]() {
      if (super[goDown]) {
        return super[goDown]();
      }
    }

    /**
     * Invoked when the user wants to go/navigate to the end (e.g., of a list).
     * The default implementation of this method does nothing.
     */
    [goEnd]() {
      if (super[goEnd]) {
        return super[goEnd]();
      }
    }

    /**
     * Invoked when the user wants to go/navigate left.
     * The default implementation of this method does nothing.
     */
    [goLeft]() {
      if (super[goLeft]) {
        return super[goLeft]();
      }
    }

    /**
     * Invoked when the user wants to go/navigate right.
     * The default implementation of this method does nothing.
     */
    [goRight]() {
      if (super[goRight]) {
        return super[goRight]();
      }
    }

    /**
     * Invoked when the user wants to go/navigate to the start (e.g., of a
     * list). The default implementation of this method does nothing.
     */
    [goStart]() {
      if (super[goStart]) {
        return super[goStart]();
      }
    }

    /**
     * Invoked when the user wants to go/navigate up.
     * The default implementation of this method does nothing.
     */
    [goUp]() {
      if (super[goUp]) {
        return super[goUp]();
      }
    }

    [keydown](/** @type {KeyboardEvent} */ event) {
      let handled = false;

      // Direction keys generally are low-priority keys: if a shadow element
      // like an input has focus, we want to let that focused element handle
      // direction keys. So we only handle the event if we're the target.
      //
      // (We'd really like to be able to provide direction key handling as a
      // default — i.e., if the focused element doesn't handle a key, then we
      // would handle it here. Unfortunately, there doesn't seem to be any
      // general way for us to do that.)
      if (this[state].handleBubblingDirectionKeys || event.target === this) {
        // Respect orientation state if defined, otherwise assume "both".
        const orientation = this[state].orientation || "both";
        const horizontal =
          orientation === "horizontal" || orientation === "both";
        const vertical = orientation === "vertical" || orientation === "both";

        // Ignore Left/Right keys when metaKey or altKey modifier is also pressed,
        // as the user may be trying to navigate back or forward in the browser.
        switch (event.key) {
          case "ArrowDown":
            if (vertical) {
              handled = event.altKey ? this[goEnd]() : this[goDown]();
            }
            break;

          case "ArrowLeft":
            if (horizontal && !event.metaKey && !event.altKey) {
              handled = this[goLeft]();
            }
            break;

          case "ArrowRight":
            if (horizontal && !event.metaKey && !event.altKey) {
              handled = this[goRight]();
            }
            break;

          case "ArrowUp":
            if (vertical) {
              handled = event.altKey ? this[goStart]() : this[goUp]();
            }
            break;

          case "End":
            handled = this[goEnd]();
            break;

          case "Home":
            handled = this[goStart]();
            break;
        }
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[keydown] && super[keydown](event)) || false;
    }
  }

  return KeyboardDirection;
}

/**
 * Manages keyboard handling for a component.
 *
 * This mixin handles several keyboard-related features.
 *
 * First, it wires up a single keydown event handler that can be shared by
 * multiple mixins on a component. The event handler will invoke a `keydown`
 * method with the event object, and any mixin along the prototype chain that
 * wants to handle that method can do so.
 *
 * If a mixin wants to indicate that keyboard event has been handled, and that
 * other mixins should *not* handle it, the mixin's `keydown` handler should
 * return a value of true. The convention that seems to work well is that a
 * mixin should see if it wants to handle the event and, if not, then ask the
 * superclass to see if it wants to handle the event. This has the effect of
 * giving the mixin that was applied last the first chance at handling a
 * keyboard event.
 *
 * Example:
 *
 *     [keydown](event) {
 *       let handled;
 *       switch (event.key) {
 *         // Handle the keys you want, setting handled = true if appropriate.
 *       }
 *       // Prefer mixin result if it's defined, otherwise use base result.
 *       return handled || (super[keydown] && super[keydown](event));
 *     }
 *
 * A second feature provided by this mixin is that it implicitly makes the
 * component a tab stop if it isn't already, by setting `tabindex` to 0. This
 * has the effect of adding the component to the tab order in document order.
 *
 * @module KeyboardMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function KeyboardMixin(Base) {
  // The class prototype added by the mixin.
  class Keyboard extends Base {
    constructor() {
      // @ts-ignore
      super();
      this.addEventListener("keydown", async (event) => {
        this[raiseChangeEvents] = true;
        // For use with FocusVisibleMixin.
        if (!this[state].focusVisible) {
          // The user may have begun interacting with this element using the
          // mouse/touch, but has now begun using the keyboard, so show focus.
          this[setState]({
            focusVisible: true,
          });
        }
        const handled = this[keydown](event);
        if (handled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        await Promise.resolve();
        this[raiseChangeEvents] = false;
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "tabindex") {
        // Parse the passed value, which could be a string or null.
        let parsed;
        if (newValue === null) {
          // tabindex attribute was removed.
          parsed = -1;
        } else {
          parsed = Number(newValue);
          if (isNaN(parsed)) {
            // Non-numeric tabindex falls back to default value (if defined).
            parsed = this[defaultTabIndex] ? this[defaultTabIndex] : 0;
          }
        }
        this.tabIndex = parsed;
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    // @ts-ignore
    get [defaultState]() {
      // If we're using DelegateFocusMixin, we don't need or want to set a
      // tabindex on the host; we'll rely on the inner shadow elements to take
      // the focus and raise keyboard events. Otherwise, we do set a tabindex on
      // the host, so that we can get keyboard events.
      const tabIndex = this[delegatesFocus] ? -1 : 0;
      const state = Object.assign(super[defaultState] || {}, {
        tabIndex,
      });

      return state;
    }

    /**
     * See the [symbols](internal#internal.keydown) documentation for details.
     */
    [keydown](/** @type {KeyboardEvent} */ event) {
      if (super[keydown]) {
        return super[keydown](event);
      }
      return false;
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }
      if (changed.tabIndex) {
        this.tabIndex = this[state].tabIndex;
      }
    }

    // Record our own notion of the state of the tabIndex property so we can
    // rerender if necessary.
    get tabIndex() {
      return super.tabIndex;
    }
    set tabIndex(tabIndex) {
      // If value has changed, invoke the super setter.
      if (super.tabIndex !== tabIndex) {
        super.tabIndex = tabIndex;
      }

      // The tabIndex setter can get called during rendering when we render our
      // own notion of the tabIndex state, in which case we don't need or want
      // to set state again.
      if (!this[rendering]) {
        // Record the new tabIndex in our state.
        this[setState]({
          tabIndex,
        });
      }
    }
  }

  return Keyboard;
}

/**
 * Maps the Page Up and Page Down keys to item cursor operations.
 *
 * The keyboard interaction model generally follows that of Microsoft Windows'
 * list boxes instead of those in OS X:
 *
 * * The Page Up/Down and Home/End keys actually move the item cursor, rather
 *   than just scrolling. The former behavior seems more generally useful for
 *   keyboard users.
 *
 * * Pressing Page Up/Down will first move the cursor to the topmost/bottommost
 *   visible item if the cursor is not already there. Thereafter, the key
 *   will move the cursor up/down by a page, and (per the above point) make
 *   the current item visible.
 *
 * To ensure the current item is in view following use of Page Up/Down, use
 * the related [CursorInViewMixin](CursorInViewMixin).
 *
 * This mixin expects the component to provide:
 *
 * * A `[keydown]` method invoked when a key is pressed. You can use
 *   [KeyboardMixin](KeyboardMixin) for that purpose, or wire up your own
 *   keyboard handling and call `[keydown]` yourself.
 * * A `currentIndex` state member updatable via [setState]`.
 *
 * @module KeyboardPagedCursorMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function KeyboardPagedCursorMixin(Base) {
  // The class prototype added by the mixin.
  class KeyboardPagedCursor extends Base {
    [keydown](/** @type {KeyboardEvent} */ event) {
      let handled = false;
      const orientation = this.orientation;
      if (orientation !== "horizontal") {
        switch (event.key) {
          case "PageDown":
            handled = this.pageDown();
            break;

          case "PageUp":
            handled = this.pageUp();
            break;
        }
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[keydown] && super[keydown](event));
    }

    // Default orientation implementation defers to super,
    // but if not found, looks in state.
    get orientation() {
      return (
        super.orientation || (this[state] && this[state].orientation) || "both"
      );
    }

    /**
     * Scroll down one page.
     */
    pageDown() {
      if (super.pageDown) {
        super.pageDown();
      }
      return scrollOnePage(this, true);
    }

    /**
     * Scroll up one page.
     */
    pageUp() {
      if (super.pageUp) {
        super.pageUp();
      }
      return scrollOnePage(this, false);
    }

    /**
     * The element that will be scrolled when the user presses Page Up or
     * Page Down. The default value is calculated by
     * [defaultScrollTarget](defaultScrollTarget#defaultScrollTarget).
     *
     * See [scrollTarget](internal#internal.scrollTarget).
     *
     * @type {HTMLElement}
     */
    get [scrollTarget]() {
      /** @type {any} */
      const element = this;
      return super[scrollTarget] || defaultScrollTarget(element);
    }
  }

  return KeyboardPagedCursor;
}

/**
 * Return the item whose content spans the given y position (relative to the
 * top of the list's scrolling client area), or null if not found.
 *
 * If downward is true, move down the list of items to find the first item
 * found at the given y position; if downward is false, move up the list of
 * items to find the last item at that position.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {number} y
 * @param {boolean} downward
 */
function getIndexOfItemAtY(element, y, downward) {
  const items = element[state].items;
  const start = downward ? 0 : items.length - 1;
  const end = downward ? items.length : 0;
  const step = downward ? 1 : -1;

  // Find the item spanning the indicated y coordinate.
  let index;
  /** @type {HTMLElement|SVGElement|null} */ let item = null;
  let itemRect;
  const { availableItemFlags } = element[state];
  for (index = start; index !== end; index += step) {
    // Only consider items available in the element's current state.
    const available = availableItemFlags ? availableItemFlags[index] : true;
    if (available) {
      itemRect = items[index].getBoundingClientRect();
      if (itemRect.top <= y && y <= itemRect.bottom) {
        // Item spans the indicated y coordinate.
        item = items[index];
        break;
      }
    }
  }

  if (!item || !itemRect) {
    return null;
  }

  // We may have found an item whose padding spans the given y coordinate,
  // but whose content is actually above/below that point.
  // TODO: If the item has a border, then padding should be included in
  // considering a hit.
  const itemStyle = getComputedStyle(item);
  const itemPaddingTop = itemStyle.paddingTop
    ? parseFloat(itemStyle.paddingTop)
    : 0;
  const itemPaddingBottom = itemStyle.paddingBottom
    ? parseFloat(itemStyle.paddingBottom)
    : 0;
  const contentTop = itemRect.top + itemPaddingTop;
  const contentBottom =
    contentTop + item.clientHeight - itemPaddingTop - itemPaddingBottom;
  if ((downward && contentTop <= y) || (!downward && contentBottom >= y)) {
    // The indicated coordinate hits the actual item content.
    return index;
  } else {
    // The indicated coordinate falls within the item's padding. Back up to
    // the item below/above the item we found and return that.
    return index - step;
  }
}

/**
 * Move by one page downward (if downward is true), or upward (if false).
 * Return true if we ended up moving the cursor, false if not.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {boolean} downward
 */
function scrollOnePage(element, downward) {
  const items = element[state].items;
  const currentIndex = element[state].currentIndex;

  // Determine the item visible just at the edge of direction we're heading.
  // We'll move to that item if it's not already current.
  const targetRect = element[scrollTarget].getBoundingClientRect();
  const edge = downward ? targetRect.bottom : targetRect.top;
  const indexOfItemAtEdge = getIndexOfItemAtY(element, edge, downward);

  let newIndex;
  if (indexOfItemAtEdge && currentIndex === indexOfItemAtEdge) {
    // The item at the edge was already current, so scroll in the indicated
    // direction by one page, measuring from the bounds of the current item.
    // Leave the new item at that edge current.
    const currentItem = items[currentIndex];
    const currentRect = currentItem.getBoundingClientRect();
    const pageHeight = element[scrollTarget].clientHeight;
    const y = downward
      ? currentRect.bottom + pageHeight
      : currentRect.top - pageHeight;
    newIndex = getIndexOfItemAtY(element, y, downward);
  } else {
    // The item at the edge wasn't current yet. Instead of scrolling, we'll just
    // move to that item. That is, the first attempt to page up/down usually
    // just moves the cursor to the edge in that direction.
    newIndex = indexOfItemAtEdge;
  }

  if (!newIndex) {
    // We went past the first/last item without finding an item. Move to the
    // last item (if moving downward) or first item (if moving upward).
    const index = downward ? items.length - 1 : 0;
    newIndex = element[closestAvailableItemIndex]
      ? element[closestAvailableItemIndex](element[state], {
          direction: downward ? -1 /* Work up */ : 1 /* Work down */,
          index,
        })
      : index;
  }

  const changed = newIndex !== currentIndex;
  if (changed) {
    // If external code causes an operation that scrolls the page, it's
    // impossible for it to predict where the currentIndex is going to end up.
    // Accordingly, we raise change events.
    const saveRaiseChangesEvents = element[raiseChangeEvents];
    element[raiseChangeEvents] = true;
    element[setState]({
      currentIndex: newIndex,
    });
    element[raiseChangeEvents] = saveRaiseChangesEvents;
  }
  return changed;
}

/**
 * Constants used by Elix mixins and components
 *
 * Sharing these constants allows for greater consistency in things such as user
 * interface timings.
 *
 * @module constants
 */

/**
 * Time in milliseconds after which the user is considered to have stopped
 * typing.
 *
 * This is used by
 * [KeyboardPrefixCursorMixin](KeyboardPrefixCursorMixin).
 *
 * @const {number} TYPING_TIMEOUT_DURATION
 */
const TYPING_TIMEOUT_DURATION = 1000;

// Symbols for private data members on an element.
const typedPrefixKey = Symbol("typedPrefix");
const prefixTimeoutKey = Symbol("prefixTimeout");

/**
 * Lets a user navigate an item cursor by typing the beginning of items
 *
 * Example: suppose a component using this mixin has the following items:
 *
 *     <sample-list-component>
 *       <div>Apple</div>
 *       <div>Apricot</div>
 *       <div>Banana</div>
 *       <div>Blackberry</div>
 *       <div>Blueberry</div>
 *       <div>Cantaloupe</div>
 *       <div>Cherry</div>
 *       <div>Lemon</div>
 *       <div>Lime</div>
 *     </sample-list-component>
 *
 * If this component receives the focus, and the user presses the "b" or "B"
 * key, the item cursor will move to "Banana", because it's the first item that
 * matches the prefix "b". (Matching is case-insensitive.) If the user now
 * presses the "l" or "L" key quickly, the prefix to match becomes "bl", so the
 * cursor will move to "Blackberry".
 *
 * The prefix typing feature has a one second timeout — the prefix to match will
 * be reset after a second has passed since the user last typed a key. If, in
 * the above example, the user waits a second between typing "b" and "l", the
 * prefix will become "l", so the cursor would move to "Lemon".
 *
 * This mixin expects the component to invoke a `keydown` method when a key is
 * pressed. You can use [KeyboardMixin](KeyboardMixin) for that purpose, or wire
 * up your own keyboard handling and call `keydown` yourself.
 *
 * This mixin also expects the component to provide an `items` property. The
 * `textContent` of those items will be used for purposes of prefix matching.
 *
 * @module KeyboardPrefixCursorMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function KeyboardPrefixCursorMixin(Base) {
  // The class prototype added by the mixin.
  class KeyboardPrefixCursor extends Base {
    constructor() {
      // @ts-ignore
      super();
      resetTypedPrefix(this);
    }

    /**
     * Go to the first item whose text content begins with the given prefix.
     *
     * @param {string} prefix - The prefix string to search for
     * @returns {boolean}
     */
    [goToItemWithPrefix](prefix) {
      if (super[goToItemWithPrefix]) {
        super[goToItemWithPrefix](prefix);
      }
      if (prefix == null || prefix.length === 0) {
        return false;
      }
      // Find item that begins with the prefix. Ignore case.
      const searchText = prefix.toLowerCase();
      /** @type {string[]} */ const texts = this[state].texts;
      const index = texts.findIndex(
        (text) => text.substr(0, prefix.length).toLowerCase() === searchText
      );
      if (index >= 0) {
        const previousIndex = this[state].currentIndex;
        this[setState]({ currentIndex: index });
        return this[state].currentIndex !== previousIndex;
      } else {
        return false;
      }
    }

    [keydown](/** @type {KeyboardEvent} */ event) {
      let handled;

      switch (event.key) {
        case "Backspace":
          handleBackspace(this);
          handled = true;
          break;

        case "Escape":
          // Pressing Escape lets user quickly start typing a new prefix.
          resetTypedPrefix(this);
          break;

        default:
          if (
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey &&
            event.key.length === 1
          ) {
            handlePlainCharacter(this, event.key);
          }
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[keydown] && super[keydown](event));
    }
  }

  return KeyboardPrefixCursor;
}

/**
 * Handle the Backspace key: remove the last character from the prefix.
 *
 * @private
 * @param {ReactiveElement} element
 */
function handleBackspace(element) {
  /** @type {any} */ const cast = element;
  const length = cast[typedPrefixKey] ? cast[typedPrefixKey].length : 0;
  if (length > 0) {
    cast[typedPrefixKey] = cast[typedPrefixKey].substr(0, length - 1);
  }
  element[goToItemWithPrefix](cast[typedPrefixKey]);
  setPrefixTimeout(element);
}

/**
 * Add a plain character to the prefix.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {string} char
 */
function handlePlainCharacter(element, char) {
  /** @type {any} */ const cast = element;
  const prefix = cast[typedPrefixKey] || "";
  cast[typedPrefixKey] = prefix + char;
  element[goToItemWithPrefix](cast[typedPrefixKey]);
  setPrefixTimeout(element);
}

/**
 * Stop listening for typing.
 *
 * @private
 * @param {ReactiveElement} element
 */
function resetPrefixTimeout(element) {
  /** @type {any} */ const cast = element;
  if (cast[prefixTimeoutKey]) {
    clearTimeout(cast[prefixTimeoutKey]);
    cast[prefixTimeoutKey] = false;
  }
}

/**
 * Clear the prefix under construction.
 *
 * @private
 * @param {ReactiveElement} element
 */
function resetTypedPrefix(element) {
  /** @type {any} */ (element)[typedPrefixKey] = "";
  resetPrefixTimeout(element);
}

/**
 * Wait for the user to stop typing.
 *
 * @private
 * @param {ReactiveElement} element
 */
function setPrefixTimeout(element) {
  resetPrefixTimeout(element);
  /** @type {any} */ (element)[prefixTimeoutKey] = setTimeout(() => {
    resetTypedPrefix(element);
  }, TYPING_TIMEOUT_DURATION);
}

/**
 * Exposes a public API for the selected text of a list-like element.
 *
 * This mixin exists for list-like components that want to provide a more
 * convenient way to get/set the selected item using text. It adds a `selectedText`
 * property that gets the `textContent` of a component's `selectedItem`. The
 * `selectedText` property can also be set to set the selection to the first item in
 * the `items` collection that has the requested `textContent`. If the indicated
 * text is not found in `items`, the selection is cleared.
 *
 * This mixin expects a component to provide an `items` array of all elements in
 * the list. A standard way to do that with is
 * [ContentItemsMixin](ContentItemsMixin). This also expects the definition of a
 * `selectedIndex` state, which can be obtained from
 * [CursorSelectMixin](CursorSelectMixin).
 *
 * @module SelectedTextAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function SelectedTextAPIMixin(Base) {
  // The class prototype added by the mixin.
  class SelectedTextAPI extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        selectedText: "",
      });
    }

    /**
     * Extract the text from the given item.
     *
     * The default implementation returns an item's `aria-label`, `alt`
     * attribute, `innerText`, or `textContent`, in that order. You can override
     * this to return the text that should be used.
     *
     * @param {Element} item
     * @returns {string}
     */
    [getItemText](item) {
      return super[getItemText]
        ? super[getItemText](item)
        : getDefaultText(item);
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // selectedText tracks text of selected item
      if (changed.items || changed.selectedIndex) {
        const { items, selectedIndex } = state;
        const selectedItem = items ? items[selectedIndex] : null;
        const selectedText = selectedItem
          ? this[getItemText](selectedItem)
          : "";
        Object.assign(effects, { selectedText });
      }

      return effects;
    }

    /**
     * The text content of the selected item.
     *
     * Setting this value to a string will attempt to select the first list item
     * whose text matches that string. Setting this to a string not matching any
     * list item will result in no selection.
     *
     * @type {string}
     */
    get selectedText() {
      return this[state].selectedText;
    }
    set selectedText(selectedText) {
      // Find index of item with desired text.
      const { items } = this[state];
      const selectedIndex = items
        ? indexOfItemWithText(items, this[getItemText], String(selectedText))
        : -1;
      this[setState]({ selectedIndex });
    }
  }

  return SelectedTextAPI;
}

/**
 * @private
 * @param {Element[]} items
 * @param {string} text
 */
function indexOfItemWithText(items, getText, text) {
  return items.findIndex((item) => getText(item) === text);
}

/**
 * Exposes a public API for the value of a list-like element.
 *
 * @module SelectedValueAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function SelectedValueAPIMixin(Base) {
  // The class prototype added by the mixin.
  class SelectedValueAPI extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        value: "",
      });
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // Value tracks the value attribute on the selected item.
      if (changed.items || changed.selectedIndex) {
        const { items, selectedIndex } = state;
        const selectedItem = items ? items[selectedIndex] : null;
        const value = selectedItem ? selectedItem.getAttribute("value") : "";
        Object.assign(effects, { value });
      }

      return effects;
    }

    /**
     * The value attribute of the selected item.
     *
     * Setting this to a string will attempt to select the first list item whose
     * value attribute matches that string. Setting this to a string not
     * matching any value attribute will result in no selection.
     *
     * @type {string}
     */
    get value() {
      return this[state].value;
    }
    set value(value) {
      // Find index of item with desired value.
      const { items } = this[state];
      const selectedIndex = items
        ? indexOfItemWithValue(items, String(value))
        : -1;
      this[setState]({ selectedIndex });
    }
  }

  return SelectedValueAPI;
}

/**
 * @private
 * @param {Element[]} items
 * @param {string} value
 */
function indexOfItemWithValue(items, value) {
  return items.findIndex((item) => item.getAttribute("value") === value);
}

/**
 * Exposes a public API for single selection on a list-like element
 *
 * This mixin expects a component to provide an `items` Array of all elements in
 * the list. This mixin also expects the component to apply
 * [ItemsCursorMixin](ItemsCursorMixin) and
 * [CursorSelectMixin](CursorSelectMixin) or otherwise define a compatible
 * `selectedIndex` state and other state members for navigating the current
 * item.
 *
 * Given the above, this mixin exposes a consistent public API for reading and
 * manipulating the current item as a selection. This includes public members
 * `selectedIndex` and `selectedItem`, selection navigation methods, and a
 * `selected-index-changed` event.
 *
 * This mixin does not produce any user-visible effects to represent selection;
 * that is up to the component to provide.
 *
 * @module SingleSelectAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function SingleSelectAPIMixin(Base) {
  // The class prototype added by the mixin.
  class SingleSelectAPI extends Base {
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "selected-index") {
        this.selectedIndex = Number(newValue);
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      if (changed.selectedIndex && this[raiseChangeEvents]) {
        const selectedIndex = this[state].selectedIndex;
        /**
         * Raised when the `selectedIndex` property changes.
         *
         * @event selectedindexchange
         */
        const event = new CustomEvent("selectedindexchange", {
          bubbles: true,
          detail: { selectedIndex },
        });
        this.dispatchEvent(event);
      }
    }

    /**
     * The index of the selected item, or -1 if no item is selected.
     *
     * @type {number}
     */
    get selectedIndex() {
      const { items, selectedIndex } = this[state];
      return items && items.length > 0 ? selectedIndex : -1;
    }
    set selectedIndex(selectedIndex) {
      if (!isNaN(selectedIndex)) {
        this[setState]({ selectedIndex });
      }
    }

    /**
     * The selected item, or null if no item is selected.
     *
     * @type {Element}
     */
    get selectedItem() {
      const { items, selectedIndex } = this[state];
      return items && items[selectedIndex];
    }
    set selectedItem(selectedItem) {
      const { items } = this[state];
      if (!items) {
        return;
      }
      const index = items.indexOf(selectedItem);
      if (index >= 0) {
        this[setState]({ selectedIndex: index });
      }
    }
  }

  return SingleSelectAPI;
}

/**
 * Treats an element's content nodes as list items.
 *
 * Items differ from nodes contents in several ways:
 *
 * * They are often referenced via index.
 * * They may have a selection state.
 * * It's common to do work to initialize the appearance or state of a new
 *   item.
 * * Text nodes are filtered out.
 * * Auxiliary invisible child elements are filtered out and not counted as
 *   items. Auxiliary elements include link, script, style, and template
 *   elements. This filtering ensures that those auxiliary elements can be
 *   used in markup inside of a list without being treated as list items.
 *
 * This mixin expects a component to provide a `content` state member returning
 * a raw set of elements. You can provide that yourself, or use
 * [SlotContentMixin](SlotContentMixin).
 *
 * Most Elix [elements](elements) use `ContentItemsMixin`, including
 * [ListBox](ListBox), [Modes](Modes), and [Tabs](Tabs).
 *
 * @module ContentItemsMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function ContentItemsMixin(Base) {
  return class ContentItems extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        items: null,
      });
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // Regenerate items when content changes.
      if (changed.content) {
        /** @type {Node[]} */ const content = state.content;
        const items = content
          ? Array.prototype.filter.call(content, (/** @type {Node} */ item) =>
              isSubstantiveElement(item)
            )
          : null;
        if (items) {
          Object.freeze(items);
        }
        Object.assign(effects, { items });
      }

      return effects;
    }
  };
}

/**
 * Defines a component's content as the flattened set of nodes assigned to a
 * slot.
 *
 * This mixin defines a component's `content` state member as the flattened
 * set of nodes assigned to a slot, typically the default slot.
 *
 * If the set of assigned nodes changes, the `content` state will be updated.
 * This helps a component satisfy the Gold Standard checklist item for
 * monitoring
 * [Content Changes](https://github.com/webcomponents/gold-standard/wiki/Content-Changes).
 *
 * By default, the mixin looks in the component's shadow subtree for a default
 * (unnamed) `slot` element. You can specify that a different slot should be
 * used by overriding the `internal.contentSlot` property.
 *
 * Most Elix [elements](elements) use `SlotContentMixin`, including
 * [ListBox](ListBox), [Modes](Modes), and [Tabs](Tabs).
 *
 * @module SlotContentMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function SlotContentMixin(Base) {
  // The class prototype added by the mixin.
  class SlotContent extends Base {
    /**
     * See [contentSlot](internal#internal.contentSlot).
     */
    get [contentSlot]() {
      /** @type {HTMLSlotElement|null} */ const slot =
        this[shadowRoot] && this[shadowRoot].querySelector("slot:not([name])");
      if (!this[shadowRoot] || !slot) {
        /* eslint-disable no-console */
        console.warn(
          `SlotContentMixin expects ${this.constructor.name} to define a shadow tree that includes a default (unnamed) slot.\nSee https://elix.org/documentation/SlotContentMixin.`
        );
      }
      return slot;
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        content: null,
      });
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      if (this[firstRender]) {
        // Listen to changes on the default slot.
        const slot = this[contentSlot];
        if (slot) {
          slot.addEventListener("slotchange", async () => {
            // Although slotchange isn't generally a user-driven event, it's
            // impossible for us to know whether a change in slot content is going
            // to result in effects that the host of this element can predict.
            // To be on the safe side, we raise any change events that come up
            // during the processing of this event.
            this[raiseChangeEvents] = true;

            // The nodes assigned to the given component have changed.
            // Update the component's state to reflect the new content.
            const content = slot.assignedNodes({ flatten: true });
            Object.freeze(content);
            this[setState]({ content });

            await Promise.resolve();
            this[raiseChangeEvents] = false;
          });
        }
      }
    }
  }

  return SlotContent;
}

/**
 * Treats the elements assigned to the default slot as list items
 *
 * This is simply a combination of
 * [ContentItemsMixin](ContentItemsMixin) and
 * [SlotContentMixin](SlotContentMixin).
 *
 * @module SlotItemsMixin
 * @mixes ContentItemsMixin
 * @mixes SlotContentMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function SlotItemsMixin(Base) {
  return ContentItemsMixin(SlotContentMixin(Base));
}

/**
 * A tap/mousedown on a list item makes that item current.
 *
 * This simple mixin is useful in list-like elements like [ListBox](ListBox),
 * where a tap/mousedown on a list item implicitly selects it.
 *
 * The standard use for this mixin is in list-like elements. Native list
 * boxes don't appear to be consistent with regard to whether they select
 * on mousedown or click/mouseup. This mixin assumes the use of mousedown.
 * On touch devices, that event appears to trigger when the touch is *released*.
 *
 * This mixin only listens to mousedown events for the primary mouse button
 * (typically the left button). Right clicks are ignored so that the browser may
 * display a context menu.
 *
 * This mixin expects the component to provide an `state.items` member. It also
 * expects the component to define a `state.currentIndex` member; you can
 * provide that yourself, or use [ItemsCursorMixin](ItemsCursorMixin).
 *
 * If the component receives an event that doesn't correspond to an item (e.g.,
 * the user taps on the element background visible between items), the cursor
 * will be removed. However, if the component sets `state.currentItemRequired` to
 * true, a background tap will *not* remove the cursor.
 *
 * @module TapCursorMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function TapCursorMixin(Base) {
  // The class prototype added by the mixin.
  return class TapCursor extends Base {
    constructor() {
      // @ts-ignore
      super();
      this.addEventListener("mousedown", (event) => {
        // Only process events for the main (usually left) button.
        if (event.button !== 0) {
          return;
        }
        this[raiseChangeEvents] = true;
        this[tap](event);
        this[raiseChangeEvents] = false;
      });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }
      if (this[firstRender]) {
        Object.assign(this.style, {
          touchAction: "manipulation", // for iOS Safari
          mozUserSelect: "none",
          msUserSelect: "none",
          webkitUserSelect: "none",
          userSelect: "none",
        });
      }
    }

    [tap](/** @type {MouseEvent} */ event) {
      // In some situations, the event target will not be the child which was
      // originally clicked on. E.g., if the item clicked on is a button, the
      // event seems to be raised in phase 2 (AT_TARGET) — but the event target
      // will be the component, not the item that was clicked on. Instead of
      // using the event target, we get the first node in the event's composed
      // path.
      // @ts-ignore
      const target = event.composedPath
        ? event.composedPath()[0]
        : event.target;

      // Find which item was clicked on and, if found, make it current. Ignore
      // clicks on disabled items.
      //
      // For elements which don't require a cursor, a background click will
      // determine the item was null, in which we case we'll remove the cursor.
      const { items, currentItemRequired } = this[state];
      if (items && target instanceof Node) {
        const targetIndex = indexOfItemContainingTarget(items, target);
        const item = targetIndex >= 0 ? items[targetIndex] : null;
        if ((item && !item.disabled) || (!item && !currentItemRequired)) {
          this[setState]({
            currentIndex: targetIndex,
          });
          event.stopPropagation();
        }
      }
    }
  };
}

const Base$8 = AriaListMixin(
  ComposedFocusMixin(
    CursorAPIMixin(
      CursorInViewMixin(
        CursorSelectMixin(
          DirectionCursorMixin(
            FocusVisibleMixin(
              FormElementMixin(
                ItemsAPIMixin(
                  ItemsCursorMixin(
                    ItemsTextMixin(
                      KeyboardDirectionMixin(
                        KeyboardMixin(
                          KeyboardPagedCursorMixin(
                            KeyboardPrefixCursorMixin(
                              LanguageDirectionMixin(
                                SingleSelectAPIMixin(
                                  SelectedTextAPIMixin(
                                    SelectedValueAPIMixin(
                                      SlotItemsMixin(
                                        TapCursorMixin(ReactiveElement)
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
);

/**
 * Single-selection list box
 *
 * This component supports ARIA support and full keyboard navigation. See
 * [KeyboardDirectionMixin](KeyboardDirectionMixin),
 * [KeyboardPagedCursorMixin](KeyboardPagedCursorMixin), and
 * [KeyboardPrefixCursorMixin](KeyboardPrefixCursorMixin) for keyboard
 * details.
 *
 * @inherits ReactiveElement
 * @mixes AriaListMixin
 * @mixes ComposedFocusMixin
 * @mixes CursorInViewMixin
 * @mixes CursorAPIMixin
 * @mixes DirectionCursorMixin
 * @mixes FocusVisibleMixin
 * @mixes FormElementMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes ItemsTextMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes KeyboardPagedCursorMixin
 * @mixes KeyboardPrefixCursorMixin
 * @mixes LanguageDirectionMixin
 * @mixes SelectedTextAPIMixin
 * @mixes SelectedValueAPIMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @mixes TapCursorMixin
 */
class ListBox extends Base$8 {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      orientation: "vertical",
    });
  }

  get orientation() {
    return this[state].orientation;
  }
  set orientation(orientation) {
    this[setState]({ orientation });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (changed.items || changed.currentIndex) {
      // Apply `selected` style to the selected item only.
      const { currentIndex, items } = this[state];
      if (items) {
        items.forEach((item, index) => {
          item.toggleAttribute("selected", index === currentIndex);
        });
      }
    }
    if (changed.orientation) {
      // Update list orientation styling.
      const style =
        this[state].orientation === "vertical"
          ? {
              display: "block",
              flexDirection: "",
              overflowX: "hidden",
              overflowY: "auto",
            }
          : {
              display: "flex",
              flexDirection: "row",
              overflowX: "auto",
              overflowY: "hidden",
            };
      Object.assign(this[ids].container.style, style);
    }
  }

  // @ts-ignore
  get [scrollTarget]() {
    return this[ids].container;
  }

  get [template]() {
    const result = super[template];
    result.content.append(fragmentFrom.html`
      <style>
        :host {
          box-sizing: border-box;
          cursor: default;
          display: flex;
          overflow: hidden; /* Container element is responsible for scrolling */
          -webkit-tap-highlight-color: transparent;
        }

        #container {
          display: flex;
          flex: 1;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        }
      </style>
      <div id="container" role="none">
        <slot id="slot"></slot>
      </div>
    `);
    return result;
  }
}

const Base$7 = CursorAPIMixin(
  CursorSelectMixin(
    ItemsAPIMixin(
      ItemsCursorMixin(SingleSelectAPIMixin(SlotItemsMixin(ReactiveElement)))
    )
  )
);

/**
 * Shows a single panel at a time
 *
 * This can be useful when a given UI element has multiple modes that present
 * substantially different elements, or for displaying a single item from a set
 * at a time.
 *
 * This component doesn't provide any UI for changing which mode is shown. A
 * common pattern in which buttons select the mode are tabs, a pattern
 * implemented by the [Tabs](Tabs) component.
 *
 * @inherits ReactiveElement
 * @mixes CursorAPIMixin
 * @mixes CursorSelectMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 */
class Modes extends Base$7 {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentItemRequired: true,
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    // Show the selected item only. Also, apply `selected` attribute to the
    // selected item only.
    if (changed.items || changed.currentIndex) {
      const { currentIndex, items } = this[state];
      if (items) {
        items.forEach((item, index) => {
          const selected = index === currentIndex;
          item.style.display = selected ? "" : "none";
          item.toggleAttribute("selected", selected);
        });
      }
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-flex;
        }
        
        #modesContainer {
          display: flex;
          flex: 1;
          position: relative;
        }
      </style>
      <div id="modesContainer">
        <slot></slot>
      </div>
    `;
  }
}

// Does a list position imply a lateral arrangement of list and stage?
/** @type {IndexedObject<boolean>} */
const lateralPositions = {
  end: true,
  left: true,
  right: true,
  start: true,
};

const Base$6 = CursorAPIMixin(
  CursorSelectMixin(
    ItemsAPIMixin(
      ItemsCursorMixin(
        LanguageDirectionMixin(
          SingleSelectAPIMixin(SlotItemsMixin(ReactiveElement))
        )
      )
    )
  )
);

/**
 * Combines a list with an area focusing on a single selected item.
 *
 * @inherits ReactiveElement
 * @mixes CursorAPIMixin
 * @mixes CursorSelectMixin
 * @mixes ItemsCursorMixin
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @part {div} proxy - an element representing an item in the list
 * @part {ListBox} proxy-list - the container for the list of proxies
 * @part {Modes} stage - the main element showing a single item from the list
 */
class Explorer extends Base$6 {
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "proxy-list-overlap") {
      this.proxyListOverlap = String(newValue) === "true";
    } else {
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  /**
   * True if the item cursor can be moved to the next item, false if not (the
   * current item is the last item in the list).
   *
   * @type {boolean}
   */
  get canGoNext() {
    return this[state].canGoNext;
  }

  /**
   * True if the item cursor can be moved to the previous item, false if not
   * (the current item is the first one in the list).
   *
   * @type {boolean}
   */
  get canGoPrevious() {
    return this[state].canGoPrevious;
  }

  [checkSize]() {
    if (super[checkSize]) {
      super[checkSize]();
    }
    if (this[ids].stage[checkSize]) {
      this[ids].stage[checkSize]();
    }
    if (this[ids].proxyList[checkSize]) {
      this[ids].proxyList[checkSize]();
    }
  }

  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentItemRequired: true,
      proxies: [],
      proxiesAssigned: false,
      proxyListOverlap: false,
      proxyListPartType: ListBox,
      proxyListPosition: "top",
      proxyPartType: "div",
      stagePartType: Modes,
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (this[firstRender]) {
      // When proxy slot's assigned nodes change, determine whether we need to
      // generate default proxies or (if assigned nodes are present) treat the
      // assigned nodes as the proxies.
      this[ids].proxySlot.addEventListener("slotchange", () => {
        const proxySlot = /** @type {any} */ (this[ids].proxySlot);
        const proxies = proxySlot.assignedNodes({ flatten: true });
        const proxiesAssigned = proxies.length > 0;
        if (proxiesAssigned) {
          // Nodes assigned to slot become proxies.
          this[setState]({
            proxiesAssigned,
            proxies,
          });
        } else {
          // No nodes assigned -- we'll need to generate proxies.
          this[setState]({ proxiesAssigned });
        }
      });
    }

    /** @type {any} */
    const handleSelectedIndexChanged = (/** @type {CustomEvent} */ event) => {
      // The proxy list and stage may raise events before they've actually
      // had a chance to sync up their items to reflect the current state
      // of the explorer component, so we only handle their events if
      // their count of items matches ours.
      /** @type {any} */ const cast = event.target;
      if (cast && this.items.length === cast.items.length) {
        const selectedIndex = event.detail.selectedIndex;
        if (this.selectedIndex !== selectedIndex) {
          this[raiseChangeEvents] = true;
          this.selectedIndex = selectedIndex;
          this[raiseChangeEvents] = false;
        }
      }
    };

    renderParts(this[shadowRoot], this[state], changed);

    if (changed.proxyListPartType) {
      this[ids].proxyList.addEventListener(
        "selectedindexchange",
        handleSelectedIndexChanged
      );
    }

    if (changed.stagePartType) {
      this[ids].stage.addEventListener(
        "selectedindexchange",
        handleSelectedIndexChanged
      );
      this[ids].stage.addEventListener("selectioneffectend", (event) => {
        const { selectedIndex } = /** @type {any} */ (event).detail;
        /**
         * This event is raised if the current `stage` applies a transition
         * effect when changing the selection, and the selection effect has
         * completed. [CrossfadeStage](CrossfadeStage) applies such an effect,
         * for example.
         *
         * The order of events when the `selectedIndex` property changes is
         * therefore: `selectedindexchange` (occurs immediately when the index
         * changes), followed by `selectioneffectend` (occurs some time later).
         *
         * @event selectioneffectend
         */
        const selectedEffectEndEvent = new CustomEvent("selectioneffectend", {
          bubbles: true,
          detail: { selectedIndex },
        });
        this.dispatchEvent(selectedEffectEndEvent);
      });
    }

    const proxyList = this[ids].proxyList;
    const stage = this[ids].stage;
    if (changed.proxies || changed.proxiesAssigned) {
      // Render the default proxies.
      const { proxies, proxiesAssigned } = this[state];
      const childNodes = proxiesAssigned
        ? [this[ids].proxySlot]
        : [this[ids].proxySlot, ...proxies];
      updateChildNodes(this[ids].proxyList, childNodes);
    }

    if (
      changed.proxyListOverlap ||
      changed.proxyListPosition ||
      changed.proxyListPartType
    ) {
      const { proxyListOverlap, proxyListPosition } = this[state];
      const lateralPosition = lateralPositions[proxyListPosition];
      Object.assign(proxyList.style, {
        height: lateralPosition ? "100%" : null,
        position: proxyListOverlap ? "absolute" : null,
        width: lateralPosition ? null : "100%",
        zIndex: proxyListOverlap ? "1" : null,
      });
    }

    if (changed.proxyListPosition || changed.rightToLeft) {
      // Map the relative position of the list vis-a-vis the stage to a position
      // from the perspective of the list.
      const cast = /** @type {any} */ (proxyList);
      if ("position" in cast) {
        const { proxyListPosition, rightToLeft } = this[state];
        let position;
        switch (proxyListPosition) {
          case "end":
            position = rightToLeft ? "left" : "right";
            break;
          case "start":
            position = rightToLeft ? "right" : "left";
            break;
          default:
            position = proxyListPosition;
            break;
        }
        cast.position = position;
      }
    }

    if (changed.proxyListPosition || changed.proxyListPartType) {
      setListAndStageOrder(this, this[state]);
      const { proxyListPosition } = this[state];
      const lateralPosition = lateralPositions[proxyListPosition];
      this[ids].explorerContainer.style.flexDirection = lateralPosition
        ? "row"
        : "column";
      Object.assign(proxyList.style, {
        bottom: proxyListPosition === "bottom" ? "0" : null,
        left: proxyListPosition === "left" ? "0" : null,
        right: proxyListPosition === "right" ? "0" : null,
        top: proxyListPosition === "top" ? "0" : null,
      });
    }

    if (changed.currentIndex || changed.proxyListPartType) {
      if ("selectedIndex" in proxyList) {
        const { currentIndex } = this[state];
        /** @type {any} */ (proxyList).selectedIndex = currentIndex;
      }
    }

    if (changed.currentIndex || changed.stagePartType) {
      if ("selectedIndex" in stage) {
        const { currentIndex } = this[state];
        /** @type {any} */ (stage).selectedIndex = currentIndex;
      }
    }

    if (changed.currentItemRequired || changed.proxyListPartType) {
      if ("selectionRequired" in proxyList) {
        const { selectionRequired } = this[state];
        /** @type {any} */ (proxyList).selectionRequired = selectionRequired;
      }
    }

    if (changed.swipeFraction || changed.proxyListPartType) {
      if ("swipeFraction" in proxyList) {
        const { swipeFraction } = this[state];
        /** @type {any} */ (proxyList).swipeFraction = swipeFraction;
      }
    }

    if (changed.swipeFraction || changed.stagePartType) {
      if ("swipeFraction" in stage) {
        const { swipeFraction } = this[state];
        /** @type {any} */ (stage).swipeFraction = swipeFraction;
      }
    }
  }

  /**
   * The current set of proxy elements that correspond to the component's
   * main `items`. If you have assigned elements to the `proxy` slot, this
   * returns the collection of those elements. Otherwise, this will return
   * a collection of default proxies generated by the component, one for
   * each item.
   *
   * @type {Element[]}
   */
  get proxies() {
    return this[state].proxies;
  }

  /**
   * True if the list of proxies should overlap the stage, false if not.
   *
   * @type {boolean}
   * @default false
   */
  get proxyListOverlap() {
    return this[state].proxyListOverlap;
  }
  set proxyListOverlap(proxyListOverlap) {
    this[setState]({ proxyListOverlap });
  }

  /**
   * The position of the proxy list relative to the stage.
   *
   * The `start` and `end` values refer to text direction: in left-to-right
   * languages such as English, these are equivalent to `left` and `right`,
   * respectively.
   *
   * @type {('bottom'|'end'|'left'|'right'|'start'|'top')}
   * @default 'start'
   */
  get proxyListPosition() {
    return this[state].proxyListPosition;
  }
  set proxyListPosition(proxyListPosition) {
    this[setState]({ proxyListPosition });
  }

  /**
   * The class or tag used to create the `proxy-list` part - the list
   * of selectable proxies representing the items in the list.
   *
   * @type {PartDescriptor}
   * @default ListBox
   */
  get proxyListPartType() {
    return this[state].proxyListPartType;
  }
  set proxyListPartType(proxyListPartType) {
    this[setState]({ proxyListPartType });
  }

  /**
   * The class or tag used to create the `proxy` parts - the default
   * representations for the list's items.
   *
   * @type {PartDescriptor}
   * @default 'div'
   */
  get proxyPartType() {
    return this[state].proxyPartType;
  }
  set proxyPartType(proxyPartType) {
    this[setState]({ proxyPartType });
  }

  /**
   * The class or tag used for the main "stage" element that shows a
   * single item at a time.
   *
   * @type {PartDescriptor}
   * @default Modes
   */
  get stagePartType() {
    return this[state].stagePartType;
  }
  set stagePartType(stagePartType) {
    this[setState]({ stagePartType });
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // If items for default proxies have changed, recreate the proxies.
    // If nodes have been assigned to the proxy slot, use those instead.
    if (changed.items || changed.proxiesAssigned || changed.proxyPartType) {
      const { items, proxiesAssigned, proxyPartType } = state;
      if ((changed.items || changed.proxyPartType) && !proxiesAssigned) {
        // Generate sufficient default proxies.
        Object.assign(effects, {
          proxies: createDefaultProxies(items, proxyPartType),
        });
      }
    }

    // Update computed state members canGoNext/canGoPrevious.
    if (
      changed.currentIndex ||
      changed.cursorOperationsWrap ||
      changed.filter ||
      changed.items
    ) {
      const { currentIndex, items } = state;
      // Can go next/previous if there are items but no cursor.
      const specialCase = items && items.length > 0 && currentIndex < 0;
      const canGoNext =
        specialCase ||
        this[closestAvailableItemIndex](state, {
          direction: 1,
          index: currentIndex + 1,
        }) >= 0;
      const canGoPrevious =
        specialCase ||
        this[closestAvailableItemIndex](state, {
          direction: -1,
          index: currentIndex - 1,
        }) >= 0;
      Object.assign(effects, {
        canGoNext,
        canGoPrevious,
      });
    }

    return effects;
  }

  get [template]() {
    const result = templateFrom.html`
      <style>
        :host {
          display: inline-flex;
        }
        
        #explorerContainer {
          display: flex;
          flex: 1;
          max-width: 100%; /* For Firefox */
          position: relative;
        }

        [part~="proxy-list"] {
          box-sizing: border-box;
        }

        [part~="stage"] {
          flex: 1;
        }
      </style>
      <div id="explorerContainer" role="none">
        <div id="proxyList" part="proxy-list"><slot id="proxySlot" name="proxy"></slot></div>
        <div id="stage" part="stage" role="none"><slot></slot></div>
      </div>
    `;

    renderParts(result.content, this[state]);

    return result;
  }
}

/**
 * Return the default list generated for the given items.
 *
 * @private
 * @param {ListItemElement[]} items
 * @param {PartDescriptor} proxyPartType
 */
function createDefaultProxies(items, proxyPartType) {
  const proxies = items ? items.map(() => createElement(proxyPartType)) : [];
  proxies.forEach((proxy) => {
    // As of February 2020, the `part` property is not available in all
    // browsers, so we set it as an attribute instead.
    /** @type {any} */ (proxy).setAttribute("part", "proxy");
  });
  // Make the array immutable to avoid accidental mutation.
  Object.freeze(proxies);
  return proxies;
}

/**
 * Find the child of root that is or contains the given node.
 *
 * @private
 * @param {Node} root
 * @param {Node} node
 * @returns {Node|null}
 */
function findChildContainingNode(root, node) {
  const parentNode = node.parentNode;
  return parentNode === root
    ? node
    : parentNode
    ? findChildContainingNode(root, parentNode)
    : null;
}

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts(root, state, changed) {
  if (!changed || changed.proxyListPartType) {
    const proxyList = root.getElementById("proxyList");
    if (proxyList) {
      const { proxyListPartType } = state;
      transmute(proxyList, proxyListPartType);
    }
  }
  if (!changed || changed.stagePartType) {
    const stage = root.getElementById("stage");
    if (stage) {
      const { stagePartType } = state;
      transmute(stage, stagePartType);
    }
  }
}

/**
 * Physically reorder the list and stage to reflect the desired arrangement. We
 * could change the visual appearance by reversing the order of the flex box,
 * but then the visual order wouldn't reflect the document order, which
 * determines focus order. That would surprise a user trying to tab through the
 * controls.
 *
 * @private
 * @param {Explorer} element
 * @param {PlainObject} state
 */
function setListAndStageOrder(element, state) {
  const { proxyListPosition, rightToLeft } = state;
  const listInInitialPosition =
    proxyListPosition === "top" ||
    proxyListPosition === "start" ||
    (proxyListPosition === "left" && !rightToLeft) ||
    (proxyListPosition === "right" && rightToLeft);
  const container = element[ids].explorerContainer;
  const stage = findChildContainingNode(container, element[ids].stage);
  const list = findChildContainingNode(container, element[ids].proxyList);
  const firstElement = listInInitialPosition ? list : stage;
  const lastElement = listInInitialPosition ? stage : list;
  if (firstElement && lastElement) {
    const nextElementSibling = /** @type {any} */ (firstElement)
      .nextElementSibling;
    if (nextElementSibling !== lastElement) {
      element[ids].explorerContainer.insertBefore(firstElement, lastElement);
    }
  }
}

/**
 * Simple foundation for component with visual effects
 *
 * At present, this mixin's only responsibility to ensure that a component
 * does not show visual effects when it is initially rendered.
 *
 * @module EffectMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function EffectMixin(Base) {
  // The class prototype added by the mixin.
  class Transition extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        enableEffects: false,
      });
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      if (this[firstRender]) {
        // Once everything's finished rendering, enable transition effects.
        setTimeout(() => {
          this[setState]({ enableEffects: true });
        });
      }
    }
  }

  return Transition;
}

/**
 * Helpers for rendering transitions between selection states
 *
 * These functions help a component work with "fractional selection". This
 * notion can be very helpful in modeling components such as carousels (e.g.,
 * [Carousel](Carousel), in which the selection state during user
 * interaction may be partway between one item and the next. With fractional
 * selection, we add a real number between 0 and 1 to a selected index to obtain
 * a fractional selection value.
 *
 * Consider a carousel displaying a set of images. Suppose the image at index 3
 * is selected. The carousel's `selectedIndex` state at this point is 3. The
 * user begins dragging the carousel with their finger. Image 3 moves out of
 * view, and the image 4 moves into view. When the user is halfway through this
 * operation, we might say that the fractional selection value is 3.5.
 * Eventually, the user releases their finger, and the carousel shows the image
 * 4 selected; the `selectedIndex` is 4.
 *
 * These functions help components work consistently with fractional selection.
 *
 * @module fractionalSelection
 */

/**
 * Dampen a selection that goes past the beginning or end of a list. This is
 * generally used to produce a visual effect of tension as the user tries to
 * go further in a direction that has no more items.
 *
 * Example: suppose `itemCount` is 5, indicating a list of 5 items. The index of
 * the last item is 4. If the `selection` parameter is 4.5, the user is trying
 * to go past this last item. When a damping function is applied, the resulting
 * value will be less than 4.5 (the actual value will be 4.25). When this
 * selection state is rendered, the user will see that, each unit distance the
 * drag travels has less and less visible effect. This is perceived as tension.
 *
 * @param {number} selection - A real number indicating a selection position
 * @param {number} itemCount - An integer for the number of items in the list
 * @returns {number} A real number representing the damped selection value.
 */
function dampenListSelection(selection, itemCount) {
  const bound = itemCount - 1;
  let damped;
  if (selection < 0) {
    // Trying to go past beginning of list. Apply tension from the left edge.
    damped = -dampen(-selection);
  } else if (selection >= bound) {
    // Trying to go past end of list. Apply tension from the right edge.
    damped = bound + dampen(selection - bound);
  } else {
    // No damping required.
    damped = selection;
  }
  return damped;
}

/**
 * Calculate damping as a function of the distance past the minimum/maximum
 * values.
 *
 * We want to asymptotically approach an absolute minimum of 1 unit
 * below/above the actual minimum/maximum. This requires calculating a
 * hyperbolic function.
 *
 * We use the formula `y = (-1/(x+1))+1`.
 * (See a [graph of this
 * function](http://www.wolframalpha.com/input/?i=y%3D(-1%2F(x%2B1))%2B1).)
 * The only portion of that function we care about is when x is zero or greater.
 * An important consideration is that the curve be tangent to the diagonal line
 * x=y at (0, 0). This ensures smooth continuity with the normal drag behavior,
 * in which the visible sliding is linear with the distance the touchpoint has
 * been dragged.
 *
 * @param {number} x - The number of dampen
 * @returns {number}
 */
function dampen(x) {
  const y = -1 / (x + 1) + 1;
  return y;
}

const Base$5 = CursorAPIMixin(
  CursorSelectMixin(
    EffectMixin(
      ItemsAPIMixin(
        ItemsCursorMixin(
          LanguageDirectionMixin(
            SingleSelectAPIMixin(SlotItemsMixin(ReactiveElement))
          )
        )
      )
    )
  )
);

/**
 * Slides between selected items on a horizontal axis
 *
 * This displays a single item completely visible at a time. When changing which
 * item is selected, it displays a simple sliding transition.
 *
 * This component is used as the main stage for a [Carousel](Carousel).
 *
 * @inherits ReactiveElement
 * @mixes CursorAPIMixin
 * @mixes CursorSelectMixin
 * @mixes EffectMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 */
class SlidingStage extends Base$5 {
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "swipe-fraction") {
      this.swipeFraction = parseFloat(newValue);
    } else {
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentItemRequired: true,
      orientation: "horizontal",
    });
  }

  get orientation() {
    return this[state].orientation;
  }
  set orientation(orientation) {
    this[setState]({ orientation });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    // Apply `selected` attribute to the selected item only.
    if (changed.items || changed.currentIndex) {
      const { currentIndex, items } = this[state];
      if (items) {
        items.forEach((item, index) => {
          item.toggleAttribute("selected", index === currentIndex);
        });
      }
    }

    // Translate the container to show the selected item.
    if (
      changed.currentIndex ||
      changed.enableEffects ||
      changed.orientation ||
      changed.swipeFraction
    ) {
      const { orientation, rightToLeft, currentIndex, items } = this[state];
      const vertical = orientation === "vertical";
      const sign = vertical ? -1 : rightToLeft ? 1 : -1;
      const swiping = this[state].swipeFraction != null;
      const swipeFraction = this[state].swipeFraction || 0;
      let translation;
      if (currentIndex >= 0) {
        const selectionFraction = currentIndex + sign * swipeFraction;
        const count = items ? items.length : 0;
        const dampedSelection = dampenListSelection(
          selectionFraction,
          count
        );
        translation = sign * dampedSelection * 100;
      } else {
        translation = 0;
      }

      const slidingStageContent = this[ids].slidingStageContent;
      const axis = vertical ? "Y" : "X";
      slidingStageContent.style.transform = `translate${axis}(${translation}%)`;

      const showTransition = this[state].enableEffects && !swiping;
      slidingStageContent.style.transition = showTransition
        ? "transform 0.25s"
        : "none";
    }
    if (changed.orientation) {
      const { orientation } = this[state];
      const vertical = orientation === "vertical";
      this[ids].slidingStageContent.style.flexDirection = vertical
        ? "column"
        : "";
    }
  }

  get swipeFraction() {
    return this[state].swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    this[setState]({ swipeFraction });
  }

  get [template]() {
    // The trick here is to give the slotted elements a flex-basis of 100%. This
    // makes them each as big as the component, spreading them out equally. The
    // slidingStageContent container will only big as big as the host too, but
    // all the elements slotted inside it will still be visible even if they
    // fall outside its bounds. By translating the container left or right, we
    // can cause any individual slotted item to become the sole visible item.
    return templateFrom.html`
      <style>
        :host {
          display: inline-flex;
          overflow: hidden;
          position: relative;
        }

        #slidingStageContent {
          display: flex;
          height: 100%;
          min-width: 100%;
          will-change: transform;
        }

        ::slotted(*) {
          flex: 0 0 100%;
          max-width: 100%; /* For Firefox */
        }
      </style>
      <div id="slidingStageContent" role="none">
        <slot></slot>
      </div>
    `;
  }
}

/**
 * Map swipe gestures to direction semantics.
 *
 * @module SwipeDirectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function SwipeDirectionMixin(Base) {
  // The class prototype added by the mixin.
  return class SwipeDirection extends Base {
    /**
     * Invokes the [goUp](internal#internal.goUp) method.
     */
    [swipeDown]() {
      this[goUp]();
    }

    /**
     * Invokes the [goRight](internal#internal.goRight) method.
     */
    [swipeLeft]() {
      this[goRight]();
    }

    /**
     * Invokes the [goLeft](internal#internal.goLeft) method.
     */
    [swipeRight]() {
      this[goLeft]();
    }

    /**
     * Invokes the [goDown](internal#internal.goDown) method.
     */
    [swipeUp]() {
      this[goDown]();
    }
  };
}

/** @type {any} */
const deferToScrollingKey$1 = Symbol("deferToScrolling");
/** @type {any} */
const multiTouchKey = Symbol("multiTouch");
const previousTimeKey = Symbol("previousTime");
const previousVelocityKey = Symbol("previousVelocity");
const previousXKey = Symbol("previousX");
const previousYKey = Symbol("previousY");
const startXKey = Symbol("startX");
const startYKey = Symbol("startY");
const touchSequenceAxisKey = Symbol("touchSequenceAxis");

/**
 * Map touch events to swipe gestures.
 *
 * @module TouchSwipeMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function TouchSwipeMixin(Base) {
  // The class prototype added by the mixin.
  return class TouchSwipe extends Base {
    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }

      if (this[firstRender]) {
        // In all touch events, only handle single touches. We don't want to
        // inadvertently do work when the user's trying to pinch-zoom for
        // example. TODO: Touch events should probably be factored out into its
        // own mixin.

        // Prefer using the older touch events if supported.
        // See the rationale for this in the comments for rendered.
        if ("TouchEvent" in window) {
          this.addEventListener("touchstart", async (event) => {
            this[raiseChangeEvents] = true;
            if (this[multiTouchKey]) {
              return;
            } else if (event.touches.length === 1) {
              const { clientX, clientY } = event.changedTouches[0];
              gestureStart(this, clientX, clientY);
            } else {
              this[multiTouchKey] = true;
            }
            await Promise.resolve();
            this[raiseChangeEvents] = false;
          });

          this.addEventListener("touchmove", async (event) => {
            this[raiseChangeEvents] = true;
            if (
              !this[multiTouchKey] &&
              event.touches.length === 1 &&
              event.target
            ) {
              const { clientX, clientY } = event.changedTouches[0];
              const handled = gestureContinue(
                this,
                clientX,
                clientY,
                event.target
              );
              if (handled) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
            await Promise.resolve();
            this[raiseChangeEvents] = false;
          });

          this.addEventListener("touchend", async (event) => {
            this[raiseChangeEvents] = true;
            if (event.touches.length === 0 && event.target) {
              // All touches removed; gesture is complete.
              if (!this[multiTouchKey]) {
                // Single-touch swipe has finished.
                const { clientX, clientY } = event.changedTouches[0];
                gestureEnd(this, clientX, clientY, event.target);
              }
              this[multiTouchKey] = false;
            }
            await Promise.resolve();
            this[raiseChangeEvents] = false;
          });
        } else if ("PointerEvent" in window) {
          // Use pointer events.
          this.addEventListener("pointerdown", async (event) => {
            this[raiseChangeEvents] = true;
            if (isEventForPenOrPrimaryTouch(event)) {
              const { clientX, clientY } = event;
              gestureStart(this, clientX, clientY);
            }
            await Promise.resolve();
            this[raiseChangeEvents] = false;
          });

          this.addEventListener("pointermove", async (event) => {
            this[raiseChangeEvents] = true;
            if (isEventForPenOrPrimaryTouch(event) && event.target) {
              const { clientX, clientY } = event;
              const handled = gestureContinue(
                this,
                clientX,
                clientY,
                event.target
              );
              if (handled) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
            await Promise.resolve();
            this[raiseChangeEvents] = false;
          });

          this.addEventListener("pointerup", async (event) => {
            this[raiseChangeEvents] = true;
            if (isEventForPenOrPrimaryTouch(event) && event.target) {
              const { clientX, clientY } = event;
              gestureEnd(this, clientX, clientY, event.target);
            }
            await Promise.resolve();
            this[raiseChangeEvents] = false;
          });
        }

        //
        // Choosing a touch-action value is unfortunately fraught with issues.
        //
        // As best as we can tell, touch-action has different behavior with the
        // older TouchEvents and the newer PointerEvents.
        //
        // With TouchEvents, we can set touch-action: manipulation, and get what
        // we want in all cases. In particular, a touch-sensitive component on a
        // scrolling surface will still be able to scroll if TouchSwipeMixin
        // declines to handle a touch event. (It appears that more specific
        // touch-action values like "pan-x" would prevent touch scrolling in the
        // cross-axis, where as "manipulation" allows cross-axis scrolling.)
        //
        // With PointerEvents, it looks like we can get what we want in many
        // cases with touch-action: none, but that has the unfortunate
        // side-effect of disabling useful default interactions like scrolling
        // with touch.
        //
        // For this reason, we currently prefer using TouchEvents. Those are
        // supported In Chrome, Safari, and Firefox. (As of Oct 2018, MDN says
        // TouchEvents are not supported in Safari, but as far as we can tell,
        // they actually are.) On those browsers, we set touch-action:
        // manipulation.
        //
        // That leaves Edge, where we're forced to use PointerEvents, and the best
        // touch-action we can find is "none". That allows many use cases to
        // function properly. However, components using TouchSwipeMixin on a
        // scrolling surface in Edge won't be able to retain support for built-in
        // touch features like scrolling.
        //
        this.style.touchAction =
          "TouchEvent" in window ? "manipulation" : "none";
      }
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        swipeAxis: "horizontal",
        swipeDownWillCommit: false,
        swipeFraction: null,
        swipeFractionMax: 1,
        swipeFractionMin: -1,
        swipeLeftWillCommit: false,
        swipeRightWillCommit: false,
        swipeStartX: null,
        swipeStartY: null,
        swipeUpWillCommit: false,
      });
    }

    /**
     * See [swipeTarget](internal#internal.swipeTarget).
     *
     * @property internal.swipeTarget
     * @memberof TouchSwipeMixin
     * @type {HTMLElement}
     */
    get [swipeTarget]() {
      const base = super[swipeTarget];
      return base || this;
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // If the swipeFraction crosses the -0.5 or 0.5 mark, update our notion of
      // whether we'll commit an operation if the swipe were to finish at that
      // point. This definition is compatible with one defined by
      // TrackpadSwipeMixin.
      if (changed.swipeFraction) {
        const { swipeAxis, swipeFraction } = state;
        if (swipeFraction !== null) {
          if (swipeAxis === "horizontal") {
            Object.assign(effects, {
              swipeLeftWillCommit: swipeFraction <= -0.5,
              swipeRightWillCommit: swipeFraction >= 0.5,
            });
          } else {
            Object.assign(effects, {
              swipeUpWillCommit: swipeFraction <= -0.5,
              swipeDownWillCommit: swipeFraction >= 0.5,
            });
          }
        }
      }

      return effects;
    }
  };
}

/**
 * Return true if the pointer event is for the pen, or the primary touch point.
 *
 * @private
 * @param {PointerEvent} event
 */
function isEventForPenOrPrimaryTouch(event) {
  return (
    event.pointerType === "pen" ||
    (event.pointerType === "touch" && event.isPrimary)
  );
}

/**
 * Invoked when the user has moved during a touch operation.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {number} clientX
 * @param {number} clientY
 * @param {EventTarget} eventTarget
 */
function gestureContinue(element, clientX, clientY, eventTarget) {
  /** @type {any} */ const cast = element;

  // Calculate and save the velocity since the last event. If this is the last
  // movement of the gesture, this velocity will be used to determine whether
  // the user is trying to flick.
  const { swipeAxis, swipeFractionMax, swipeFractionMin } = element[state];
  const deltaX = clientX - cast[previousXKey];
  const deltaY = clientY - cast[previousYKey];
  const now = Date.now();
  const deltaTime = now - cast[previousTimeKey];
  const deltaAlongAxis = swipeAxis === "vertical" ? deltaY : deltaX;
  const velocity = (deltaAlongAxis / deltaTime) * 1000;

  cast[previousXKey] = clientX;
  cast[previousYKey] = clientY;
  cast[previousTimeKey] = now;
  cast[previousVelocityKey] = velocity;

  // Was this specific event more vertical or more horizontal?
  const eventAxis =
    Math.abs(deltaY) > Math.abs(deltaX) ? "vertical" : "horizontal";

  // Is this the first touch move event in a swipe sequence?
  const eventBeginsSequence = cast[touchSequenceAxisKey] === null;
  if (eventBeginsSequence) {
    // This first event's axis will determine which axis we'll respect for the
    // rest of the sequence.
    cast[touchSequenceAxisKey] = eventAxis;
  } else if (eventAxis !== cast[touchSequenceAxisKey]) {
    // This event continues a sequence. If the event's axis is perpendicular to
    // the sequence's axis, we'll absorb this event. E.g., if the user started a
    // vertical swipe (to scroll, say), then we absorb all subsequent horizontal
    // touch events in the sequence.
    return true;
  }

  if (eventAxis !== swipeAxis) {
    // Move wasn't along the axis we care about, ignore it.
    return false;
  }

  // Scrolling initially takes precedence over swiping.
  if (cast[deferToScrollingKey$1]) {
    // Predict whether the browser's default behavior for this event would cause
    // the swipe target or any of its ancestors to scroll.
    const downOrRight = deltaAlongAxis < 0;
    const willScroll = canScrollInDirection(
      eventTarget,
      swipeAxis,
      downOrRight
    );
    if (willScroll) {
      // Don't interfere with scrolling.
      return false;
    }
  }

  // Since we know we're not defering to scrolling, we can start tracking
  // the start of the swipe.
  if (!cast[startXKey]) {
    cast[startXKey] = clientX;
  }
  if (!cast[startYKey]) {
    cast[startYKey] = clientY;
  }

  const fraction = getSwipeFraction(element, clientX, clientY);
  const swipeFraction = Math.max(
    Math.min(fraction, swipeFractionMax),
    swipeFractionMin
  );
  if (element[state].swipeFraction === swipeFraction) {
    // Already at min or max; no need for us to do anything.
    return false;
  }

  // If we get this far, we have a touch event we want to handle.

  // From this point on, swiping will take precedence over scrolling.
  cast[deferToScrollingKey$1] = false;

  element[setState]({ swipeFraction });

  // Indicate that the event was handled. It'd be nicer if we didn't have
  // to do this so that, e.g., a user could be swiping left and right
  // while simultaneously scrolling up and down. (Native touch apps can do
  // that.) However, Mobile Safari wants to handle swipe events near the
  // page and interpret them as navigations. To avoid having a horiziontal
  // swipe misintepreted as a navigation, we indicate that we've handled
  // the event, and prevent default behavior.
  return true;
}

/**
 * Invoked when the user has finished a touch operation.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {number} clientX
 * @param {number} clientY
 * @param {EventTarget} eventTarget
 */
/* eslint-disable no-unused-vars */
function gestureEnd(element, clientX, clientY, eventTarget) {
  // Examine velocity of last movement to see if user is flicking.
  const velocity = /** @type {any} */ (element)[previousVelocityKey];
  const flickThresholdVelocity = 800; // speed in pixels/second

  const { swipeAxis, swipeFraction } = element[state];
  const vertical = swipeAxis === "vertical";

  // Scrolling takes precedence over flick gestures.
  let willScroll = false;
  if (element[deferToScrollingKey$1]) {
    // Predict whether the browser's default behavior for this event would cause
    // the swipe target or any of its ancestors to scroll.
    const downOrRight = velocity < 0;
    willScroll = canScrollInDirection(eventTarget, swipeAxis, downOrRight);
  }

  // We only count a flick if the swipe wasn't already going in the opposite
  // direction. E.g., if the user begins a swipe to the left, then flicks right,
  // that doesn't count, because the user may have simply been trying to
  // undo/cancel the swipe to the left.
  if (!willScroll) {
    let flickPositive;
    if (velocity >= flickThresholdVelocity && swipeFraction >= 0) {
      // Flicked right/down at high speed.
      flickPositive = true;
      if (vertical) {
        element[setState]({
          swipeDownWillCommit: true,
        });
      } else {
        element[setState]({
          swipeRightWillCommit: true,
        });
      }
    } else if (velocity <= -flickThresholdVelocity && swipeFraction <= 0) {
      // Flicked left/up at high speed.
      flickPositive = false;
      if (vertical) {
        element[setState]({
          swipeUpWillCommit: true,
        });
      } else {
        element[setState]({
          swipeLeftWillCommit: true,
        });
      }
    } else {
      // Finished at low speed.
      // If the user swiped far enough to commit a gesture, handle it now.
      if (
        element[state].swipeLeftWillCommit ||
        element[state].swipeUpWillCommit
      ) {
        flickPositive = false;
      } else if (
        element[state].swipeRightWillCommit ||
        element[state].swipeDownWillCommit
      ) {
        flickPositive = true;
      }
    }

    if (typeof flickPositive !== "undefined") {
      const gesture = vertical
        ? flickPositive
          ? swipeDown
          : swipeUp
        : flickPositive
        ? swipeRight
        : swipeLeft;
      // If component has method for indicated gesture, invoke it.
      if (gesture && element[gesture]) {
        element[gesture]();
      }
    }
  }

  /** @type {any} */ (element)[touchSequenceAxisKey] = null;

  element[setState]({
    swipeFraction: null,
  });
}

/**
 * Invoked when the user has begun a touch operation.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {number} clientX
 * @param {number} clientY
 */
function gestureStart(element, clientX, clientY) {
  /** @type {any} */ const cast = element;
  cast[deferToScrollingKey$1] = true;
  cast[previousTimeKey] = Date.now();
  cast[previousVelocityKey] = 0;
  cast[previousXKey] = clientX;
  cast[previousYKey] = clientY;
  cast[startXKey] = null;
  cast[startYKey] = null;
  cast[touchSequenceAxisKey] = null;

  element[setState]({
    swipeFraction: 0,
  });

  // Let component know a swipe is starting.
  if (element[swipeStart]) {
    element[swipeStart](clientX, clientY);
  }
}

/**
 * Return the fraction represented by the swipe to the given x/y.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {number} x
 * @param {number} y
 */
function getSwipeFraction(element, x, y) {
  const { swipeAxis } = element[state];
  /** @type {any} */ const cast = element;
  const vertical = swipeAxis === "vertical";
  const dragDistance = vertical ? y - cast[startYKey] : x - cast[startXKey];
  const swipeTargetSize = vertical
    ? element[swipeTarget].offsetHeight
    : element[swipeTarget].offsetWidth;
  const fraction = swipeTargetSize > 0 ? dragDistance / swipeTargetSize : 0;
  return fraction;
}

const absorbDecelerationKey = Symbol("absorbDeceleration");
const deferToScrollingKey = Symbol("deferToScrolling");
const lastDeltaXKey = Symbol("lastDeltaX");
const lastDeltaYKey = Symbol("lastDeltaY");
const lastWheelTimeoutKey = Symbol("lastWheelTimeout");
const postGestureDelayCompleteKey = Symbol("postGestureDelayComplete");
const wheelDistanceKey = Symbol("wheelDistance");
const wheelSequenceAxisKey = Symbol("wheelSequenceAxis");

// Time we wait following a gesture before paying attention to wheel events
// again.
const POST_GESTURE_TIME = 250;

// Time we wait after the last wheel event before we reset things.
const WHEEL_TIME = 100;

/**
 * Map trackpad events to swipe gestures.
 *
 * @module TrackpadSwipeMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function TrackpadSwipeMixin(Base) {
  // The class prototype added by the mixin.
  return class TrackpadSwipe extends Base {
    constructor() {
      // @ts-ignore
      super();
      this.addEventListener("wheel", async (event) => {
        this[raiseChangeEvents] = true;
        const handled = handleWheel(this, event);
        if (handled) {
          event.preventDefault();
          event.stopPropagation();
        }
        await Promise.resolve();
        this[raiseChangeEvents] = false;
      });
      resetWheelTracking(this);
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        swipeAxis: "horizontal",
        swipeDownWillCommit: false,
        swipeFraction: null,
        swipeFractionMax: 1,
        swipeFractionMin: -1,
        swipeLeftWillCommit: false,
        swipeRightWillCommit: false,
        swipeUpWillCommit: false,
      });
    }

    /**
     * See [swipeTarget](internal#internal.swipeTarget).
     *
     * @property internal.swipeTarget
     * @memberof TrackpadSwipeMixin
     * @type {HTMLElement}
     */
    get [swipeTarget]() {
      const base = super[swipeTarget];
      return base || this;
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // If the swipeFraction crosses the -0.5 or 0.5 mark, update our notion of
      // whether we'll commit an operation if the swipe were to finish at that
      // point. This definition is compatible with one defined by
      // TouchSwipeMixin.
      if (changed.swipeFraction) {
        const { swipeAxis, swipeFraction } = state;
        if (swipeFraction !== null) {
          if (swipeAxis === "horizontal") {
            Object.assign(effects, {
              swipeLeftWillCommit: swipeFraction <= -0.5,
              swipeRightWillCommit: swipeFraction >= 0.5,
            });
          } else {
            Object.assign(effects, {
              swipeUpWillCommit: swipeFraction <= -0.5,
              swipeDownWillCommit: swipeFraction >= 0.5,
            });
          }
        }
      }

      return effects;
    }
  };
}

/**
 * A wheel event has been generated. This could be a real wheel event, or it
 * could be fake (see notes in the header).
 *
 * This handler uses several strategies to try to approximate native trackpad
 * swipe gesture.
 *
 * If the user has dragged enough to cause a gesture, then for a short delay
 * following that gesture, subsequent wheel events will be ignored.
 *
 * Furthermore, following a gesture, we ignore all wheel events until we receive
 * at least one event where the event's deltaX (distance traveled) is *greater*
 * than the previous event's deltaX. This helps us filter out the fake wheel
 * events generated by the browser to simulate deceleration.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {WheelEvent} event
 */
function handleWheel(element, event) {
  /** @type {any} */ const cast = element;

  // Since we have a new wheel event, reset our timer waiting for the last
  // wheel event to pass.
  if (cast[lastWheelTimeoutKey]) {
    clearTimeout(cast[lastWheelTimeoutKey]);
  }
  cast[lastWheelTimeoutKey] = setTimeout(async () => {
    element[raiseChangeEvents] = true;
    wheelTimedOut(element);
    await Promise.resolve();
    cast[raiseChangeEvents] = false;
  }, WHEEL_TIME);

  const deltaX = event.deltaX;
  const deltaY = event.deltaY;

  // See if component event represents acceleration or deceleration.
  const { swipeAxis, swipeFractionMax, swipeFractionMin } = element[state];
  const vertical = swipeAxis === "vertical";
  const acceleration = vertical
    ? Math.sign(deltaY) * (deltaY - cast[lastDeltaYKey])
    : Math.sign(deltaX) * (deltaX - cast[lastDeltaXKey]);
  cast[lastDeltaXKey] = deltaX;
  cast[lastDeltaYKey] = deltaY;

  // Is this the first wheel event in a swipe sequence?
  const eventBeginsSwipe = cast[wheelSequenceAxisKey] === null;

  // Was this specific event more vertical or more horizontal?
  const eventAxis =
    Math.abs(deltaY) > Math.abs(deltaX) ? "vertical" : "horizontal";

  if (!eventBeginsSwipe && eventAxis !== cast[wheelSequenceAxisKey]) {
    // This event continues a sequence. If the event's axis is perpendicular to
    // the sequence's axis, we'll absorb this event. E.g., if the user started a
    // vertical swipe (to scroll, say), then we absorb all subsequent horizontal
    // wheel events in the sequence.
    return true;
  }

  if (eventAxis !== swipeAxis) {
    // Move wasn't along the axis we care about, ignore it.
    return false;
  }

  if (!cast[postGestureDelayCompleteKey]) {
    // It's too soon after a gesture; absorb the event.
    return true;
  }

  if (acceleration > 0) {
    // The events are not (or are no longer) decelerating, so we can start
    // paying attention to them again.
    cast[absorbDecelerationKey] = false;
  } else if (cast[absorbDecelerationKey]) {
    // The wheel event was likely faked to simulate deceleration; absorb it.
    return true;
  }

  // Scrolling initially takes precedence over swiping.
  if (cast[deferToScrollingKey]) {
    // Predict whether the browser's default behavior for this event would cause
    // the swipe target or any of its ancestors to scroll.
    const target = element[scrollTarget] || element;
    const deltaAlongAxis = vertical ? deltaY : deltaX;
    const downOrRight = deltaAlongAxis > 0;
    const willScroll = canScrollInDirection(target, swipeAxis, downOrRight);
    if (willScroll) {
      // Don't interfere with scrolling.
      return false;
    }
  }

  // If we get this far, we have a wheel event we want to handle.

  // From this point on, swiping will take precedence over scrolling.
  cast[deferToScrollingKey] = false;

  if (eventBeginsSwipe) {
    // This first event's axis will determine which axis we'll respect for the
    // rest of the sequence.
    cast[wheelSequenceAxisKey] = eventAxis;
    if (element[swipeStart]) {
      // Let component know a swipe is starting.
      element[swipeStart](event.clientX, event.clientY);
    }
  }

  cast[wheelDistanceKey] -= vertical ? deltaY : deltaX;

  // Update the travel fraction of the component being navigated.
  const targetDimension = vertical
    ? cast[swipeTarget].offsetHeight
    : cast[swipeTarget].offsetWidth;
  let fraction =
    targetDimension > 0 ? cast[wheelDistanceKey] / targetDimension : 0;
  fraction = Math.sign(fraction) * Math.min(Math.abs(fraction), 1);
  const swipeFraction = Math.max(
    Math.min(fraction, swipeFractionMax),
    swipeFractionMin
  );

  // If the user has dragged enough to reach the previous/next item, then
  // perform the gesture immediately. (We don't need to wait for the wheel to
  // time out.)
  let gesture;
  if (swipeFraction === -1) {
    gesture = vertical ? swipeUp : swipeLeft;
  } else if (swipeFraction === 1) {
    gesture = vertical ? swipeDown : swipeRight;
  }
  if (gesture) {
    performImmediateGesture(element, gesture);
  } else {
    element[setState]({ swipeFraction });
  }

  return true;
}

/**
 * Immediately perform the indicated gesture.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {string} gesture
 */
function performImmediateGesture(element, gesture) {
  if (element[gesture]) {
    element[gesture]();
  }
  // Reset our tracking following the gesture. Because the user may still be
  // swiping on the trackpad, we reset things slightly differently than when the
  // wheel times out.
  /** @type {any} */ const cast = element;
  cast[absorbDecelerationKey] = true;
  cast[deferToScrollingKey] = true;
  cast[postGestureDelayCompleteKey] = false;
  cast[wheelDistanceKey] = 0;
  cast[wheelSequenceAxisKey] = null;
  setTimeout(() => {
    cast[postGestureDelayCompleteKey] = true;
  }, POST_GESTURE_TIME);
  // We've handled a gesture, so reset notion of what gestures are in progress.
  element[setState]({
    swipeDownWillCommit: false,
    swipeFraction: null,
    swipeLeftWillCommit: false,
    swipeRightWillCommit: false,
    swipeUpWillCommit: false,
  });
}

/**
 * Reset all state related to the tracking of the wheel.
 *
 * @private
 * @param {ReactiveElement} element
 */
function resetWheelTracking(element) {
  /** @type {any} */ const cast = element;
  cast[absorbDecelerationKey] = false;
  cast[deferToScrollingKey] = true;
  cast[lastDeltaXKey] = 0;
  cast[lastDeltaYKey] = 0;
  cast[postGestureDelayCompleteKey] = true;
  cast[wheelDistanceKey] = 0;
  cast[wheelSequenceAxisKey] = null;
  if (cast[lastWheelTimeoutKey]) {
    clearTimeout(cast[lastWheelTimeoutKey]);
    cast[lastWheelTimeoutKey] = null;
  }
}

/**
 * A sufficiently long period of time has passed since the last wheel event.
 * We snap the selection to the closest item, then reset our state.
 *
 * @private
 * @param {ReactiveElement} element
 */
async function wheelTimedOut(element) {
  // If the user swiped far enough to commit a gesture, handle it now.
  let gesture;
  if (element[state].swipeDownWillCommit) {
    gesture = swipeDown;
  } else if (element[state].swipeLeftWillCommit) {
    gesture = swipeLeft;
  } else if (element[state].swipeRightWillCommit) {
    gesture = swipeRight;
  } else if (element[state].swipeUpWillCommit) {
    gesture = swipeUp;
  }

  resetWheelTracking(element);
  element[setState]({
    swipeDownWillCommit: false,
    swipeFraction: null,
    swipeLeftWillCommit: false,
    swipeRightWillCommit: false,
    swipeUpWillCommit: false,
  });

  if (gesture && element[gesture]) {
    await element[gesture]();
  }
}

const Base$4 = AriaListMixin(
  ArrowDirectionMixin(
    DirectionCursorMixin(
      FocusVisibleMixin(
        KeyboardDirectionMixin(
          KeyboardMixin(
            SwipeDirectionMixin(TouchSwipeMixin(TrackpadSwipeMixin(Explorer)))
          )
        )
      )
    )
  )
);

/**
 * Carousel with a sliding effect and navigation controls
 *
 * Allows a user to navigate a horizontal set of items with touch, mouse,
 * keyboard, or trackpad. This component shows a small dot for each of its
 * items, and displays a sliding effect when moving between items.
 *
 * @inherits Explorer
 * @mixes AriaListMixin
 * @mixes ArrowDirectionMixin
 * @mixes DirectionCursorMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes SwipeDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 * @part {SlidingStage} stage
 */
class Carousel extends Base$4 {
  // @ts-ignore
  get [defaultState]() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    // As of Mar 14 2018, Firefox does not yet support pointer queries, in which
    // case we assume use of a mouse.
    const pointerQuery = "(pointer: fine)";
    const mediaQueryList = window.matchMedia(pointerQuery);
    const showArrowButtons =
      mediaQueryList.media === pointerQuery ? mediaQueryList.matches : true;
    return Object.assign(super[defaultState], {
      orientation: "horizontal",
      proxyListOverlap: true,
      proxyListPosition: "bottom",
      showArrowButtons,
      stagePartType: SlidingStage,
    });
  }

  get orientation() {
    return this[state].orientation;
  }
  set orientation(orientation) {
    this[setState]({ orientation });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    if (changed.proxyListPartType && this[ids].proxyList) {
      // Turn off focus handling for old proxy list.
      const proxyList = this[ids].proxyList;
      if (proxyList instanceof HTMLElement) {
        forwardFocus(proxyList, null);
      }
    }

    super[render](changed);

    if (changed.stagePartType || changed.orientation) {
      /** @type {any} */ const cast = this[ids].stage;
      if ("orientation" in cast) {
        cast.orientation = this[state].orientation;
      }
    }

    if (changed.proxyListPartType) {
      // Keep focus off of the proxies and onto the carousel itself.
      const proxyList = this[ids].proxyList;
      if (proxyList instanceof HTMLElement) {
        forwardFocus(proxyList, this);
      }
      proxyList.removeAttribute("tabindex");
    }

    if (changed.orientation || changed.proxyListPartType) {
      /** @type {any} */ const cast = this[ids].proxyList;
      if ("orientation" in cast) {
        cast.orientation = this[state].orientation;
      }
    }

    if (changed.stagePartType) {
      this[ids].stage.removeAttribute("tabindex");
    }

    const proxies = this.proxies;
    if (changed.proxies && proxies) {
      // Make proxies not focusable.
      proxies.forEach((proxy) => {
        if (proxy instanceof HTMLElement) {
          proxy.tabIndex = -1;
        }
      });
    }
  }

  // @ts-ignore
  get [swipeTarget]() {
    const base = super[swipeTarget];
    const stage = this[ids].stage;
    return stage instanceof HTMLElement ? stage : base;
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // When orientation changes, have swipe axis follow suit, and also
    // set the default proxy list position.
    if (changed.orientation) {
      const proxyListPosition =
        state.orientation === "horizontal" ? "bottom" : "right";
      Object.assign(effects, {
        proxyListPosition,
        swipeAxis: state.orientation,
      });
    }

    return effects;
  }

  get [template]() {
    const result = super[template];

    const stage = result.content.querySelector("#stage");
    /** @type {any} */ const cast = this;
    cast[ArrowDirectionMixin.wrap](stage);

    const proxyList = result.content.getElementById("proxyList");
    if (proxyList) {
      proxyList.removeAttribute("tabindex");
    }

    result.content.append(
      fragmentFrom.html`
        <style>
          [part~="stage"] {
            height: 100%;
            width: 100%;
          }
        </style>
      `
    );

    return result;
  }
}

// Elements listening for changes in prefers-color-scheme.
const colorSchemeElements = new Set();

/**
 * Lets a component automatically or explicitly configure itself for dark backgrounds
 *
 * @module DarkModeMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function DarkModeMixin(Base) {
  return class dark extends Base {
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "dark") {
        const value = booleanAttributeValue(name, newValue);
        if (this.dark !== value) {
          this.dark = value;
        }
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      // This element no longer needs to listen to changes in color scheme.
      colorSchemeElements.delete(this);
    }

    /**
     * True if the component should configure itself for display on a dark background;
     * false if the component should assume a light background.
     *
     * The default value of this property is inferred when the component is
     * initially added to the page. The component will look up its hierarchy for
     * an ancestor that has an explicit background color. If the color's
     * lightness value in the HSL cylindrical-coordinate system is below 50%,
     * the background is assumed to be dark and `dark` will default to true.
     * If the color is lighter than that, or no explicit background color can be
     * found, the default value of `dark` will be false.
     *
     * @type {boolean}
     */
    get dark() {
      return this[state].dark;
    }
    set dark(dark) {
      this[setState]({ dark });
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        dark: false,
        detectDarkMode: "auto",
      });
    }

    /**
     * Determines whether the component should automatially try to detect
     * whether it should apply dark mode.
     *
     * @type {'auto'|'off'}
     * @default 'auto'
     */
    get detectDarkMode() {
      return this[state].detectDarkMode;
    }
    set detectDarkMode(detectDarkMode) {
      if (detectDarkMode === "auto" || detectDarkMode === "off") {
        this[setState]({ detectDarkMode });
      }
    }

    [render](changed) {
      if (super[render]) {
        super[render](changed);
      }

      if (changed.dark) {
        const { dark } = this[state];
        setInternalState(this, "dark", dark);
      }
    }

    [rendered](changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      if (changed.detectDarkMode) {
        const { detectDarkMode } = this[state];
        // Add/remove element to/from list of elements listening to color
        // scheme.
        if (detectDarkMode === "auto") {
          colorSchemeElements.add(this);
          setDarkModeFromBackgroundColor(this);
        } else {
          colorSchemeElements.delete(this);
        }
      }
    }
  };
}

// Infer dark mode from effective background color.
function setDarkModeFromBackgroundColor(element) {
  const backgroundColor = findBackgroundColor(element);
  const rgb = parseRgb(backgroundColor);
  if (rgb) {
    const hsl = rgbToHsl(rgb);
    // We consider any lightness below 50% to be dark.
    const dark = hsl.l < 0.5;
    element[setState]({ dark });
  }
}

/**
 * Return the background color of the given element. If the color is
 * "transparent" (the default in Mozilla) or "rgba(0, 0, 0, 0)" (the default
 * transparent value in Blink and Webkit), walk up the parent chain until a
 * non-transparent color is found.
 *
 * @private
 * @param {Element} element
 * @returns {string}
 */
function findBackgroundColor(element) {
  const defaultBackgroundColor = "rgb(255,255,255)";
  if (element instanceof Document) {
    // This element has no background, assume white.
    return defaultBackgroundColor;
  }
  const backgroundColor = getComputedStyle(element).backgroundColor;
  const hasColor =
    backgroundColor !== "transparent" && backgroundColor !== "rgba(0, 0, 0, 0)";
  if (backgroundColor && hasColor) {
    return backgroundColor;
  }
  if (element.assignedSlot) {
    return findBackgroundColor(element.assignedSlot);
  }
  const parent = element.parentNode;
  if (parent instanceof ShadowRoot) {
    return findBackgroundColor(parent.host);
  } else if (parent instanceof Element) {
    return findBackgroundColor(parent);
  } else {
    return defaultBackgroundColor;
  }
}

// Return the individual RGB values from a CSS RGB/RGBA color string.
function parseRgb(/** @type {string} */ rgbString) {
  const rgbRegex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/;
  const match = rgbRegex.exec(rgbString);
  if (match) {
    const r = match[1];
    const g = match[2];
    const b = match[3];
    return { r, g, b };
  } else {
    return null;
  }
}

// Convert an RGB color to an HSL color.
// From https://stackoverflow.com/a/3732187/76472.
function rgbToHsl(/** @type {PlainObject} */ rgb) {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0; // achromatic
  let s = 0;
  let l = (max + min) / 2;

  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - d) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
}

// Listen to changes in user preference for dark mode.
window.matchMedia("(prefers-color-scheme: dark)").addListener(() => {
  colorSchemeElements.forEach((element) => {
    setDarkModeFromBackgroundColor(element);
  });
});

/**
 * Button styles in the Plain reference design system
 *
 * @module PlainButtonMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function PlainButtonMixin(Base) {
  return class PlainButton extends Base {
    get [template]() {
      const result = super[template];
      result.content.append(fragmentFrom.html`
        <style>
          :host([disabled]) ::slotted(*) {
            opacity: 0.5;
          }

          [part~="button"] {
            display: inline-flex;
            justify-content: center;
            margin: 0;
            position: relative;
          }
        </style>
      `);
      return result;
    }
  };
}

/**
 * Button component in the Plain reference design system
 *
 * @inherits Button
 */
class PlainButton extends PlainButtonMixin(Button) {}

const Base$3 = DarkModeMixin(PlainButton);

/**
 * Left/right arrow button in the Plain reference design system
 *
 * This component is used by
 * [PlainArrowDirectionMixin](PlainArrowDirectionMixin) for its default
 * left/right arrow buttons.
 *
 * @inherits PlainButton
 * @mixes DarkModeMixin
 */
class PlainArrowDirectionButton extends Base$3 {
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          :host {
            color: rgba(0, 0, 0, 0.7);
          }

          :host(:not([disabled]):hover) {
            background: rgba(0, 0, 0, 0.2);
            color: rgba(0, 0, 0, 0.8);
            cursor: pointer;
          }

          :host([disabled]) {
            color: rgba(0, 0, 0, 0.3);
          }

          [part~="button"] {
            fill: currentcolor;
          }

          :host([dark]) {
            color: rgba(255, 255, 255, 0.7);
          }

          :host([dark]:not([disabled]):hover) {
            background: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.8);
          }

          :host([dark][disabled]) {
            color: rgba(255, 255, 255, 0.3);
          }
        </style>
      `
    );
    return result;
  }
}

/**
 * ArrowDirectionMixin styles in the Plain reference design system
 *
 * @module PlainArrowDirectionMixin
 * @param {Constructor<ReactiveElement>} Base
 * @part {PlainArrowDirectionButton} arrow-button
 * @part arrow-icon - both of the default arrow icons used in the arrow buttons
 * @part arrow-icon-next - the arrow icon that points to the next item
 * @part arrow-icon-previous - the arrow icon that points to the previous item
 */
function PlainArrowDirectionMixin(Base) {
  return class PlainArrowDirection extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        arrowButtonPartType: PlainArrowDirectionButton,
      });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      super[render](changed);

      // Rotate the default icons for vertical orientation, flip the default
      // icons for right-to-left.
      if (changed.orientation || changed.rightToLeft) {
        const { orientation, rightToLeft } = this[state];
        const vertical = orientation === "vertical";
        const transform = vertical
          ? "rotate(90deg)"
          : rightToLeft
          ? "rotateZ(180deg)"
          : "";
        if (this[ids].arrowIconPrevious) {
          this[ids].arrowIconPrevious.style.transform = transform;
        }
        if (this[ids].arrowIconNext) {
          this[ids].arrowIconNext.style.transform = transform;
        }
      }

      // Apply dark mode to buttons.
      if (changed.dark) {
        const { dark } = this[state];
        /** @type {any} */ const arrowButtonPrevious = this[ids]
          .arrowButtonPrevious;
        /** @type {any} */ const arrowButtonNext = this[ids].arrowButtonNext;
        if ("dark" in arrowButtonPrevious) {
          /** @type {any} */ (arrowButtonPrevious).dark = dark;
        }
        if ("dark" in arrowButtonNext) {
          /** @type {any} */ (arrowButtonNext).dark = dark;
        }
      }
    }

    get [template]() {
      const result = super[template];

      // Insert our icons into the button slots.
      const arrowButtonPrevious = result.content.querySelector(
        'slot[name="arrowButtonPrevious"]'
      );
      if (arrowButtonPrevious) {
        arrowButtonPrevious.append(
          fragmentFrom.html`
            <svg
              id="arrowIconPrevious"
              part="arrow-icon arrow-icon-previous"
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
              style="fill: currentColor; height: 1em; width: 1em;"
            >
              <g>
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
              </g>
            </svg>
          `
        );
      }
      const arrowButtonNext = result.content.querySelector(
        'slot[name="arrowButtonNext"]'
      );
      if (arrowButtonNext) {
        arrowButtonNext.append(
          fragmentFrom.html`
            <svg
              id="arrowIconNext"
              part="arrow-icon arrow-icon-next"
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
              style="fill: currentColor; height: 1em; width: 1em;"
            >
              <g>
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
              </g>
            </svg>
          `
        );
      }

      return result;
    }
  };
}

/** @type {any} */ let resizeObserver;

/**
 * Lets a component know when it has been resized.
 *
 * If/when the component changes size, this mixin updates the `clientHeight` and
 * `clientWidth` state members.
 *
 * This mixin requires `ResizeObserver`, which (as of May 2020) is supported in
 * all modern browsers.
 *
 * @module ResizeMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function ResizeMixin(Base) {
  return class Resize extends Base {
    // Check this element's current height and width and, if either has changed,
    // update the corresponding state members.
    [checkSize]() {
      if (super[checkSize]) {
        super[checkSize]();
      }
      const { clientHeight, clientWidth } = this;
      const sizeChanged =
        clientHeight !== this[state].clientHeight ||
        clientWidth !== this[state].clientWidth;
      if (sizeChanged) {
        this[setState]({
          clientHeight,
          clientWidth,
        });
      }
    }

    connectedCallback() {
      super.connectedCallback();
      if (resizeObserver) {
        resizeObserver.observe(this);
      }
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        clientHeight: this.clientHeight,
        clientWidth: this.clientWidth,
      });
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      if (resizeObserver) {
        resizeObserver.unobserve(this);
      }
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      this[checkSize]();
    }
  };
}

// Is ResizeObserve supported?
const Observer = window["ResizeObserver"];
if (typeof Observer !== "undefined") {
  // Use ResizeObserver.
  resizeObserver = new Observer((/** @type {any[]} */ entries) => {
    entries.forEach((entry) => {
      // In theory, the "content size" reported by ResizeObserver appears to be
      // the same as the clientHeight/clientWidth. Neither should include
      // padding. But since this theory is not explicitly confirmed by the
      // ResizeObserver docs, it seems safest to reference the element's current
      // client size.
      const { target } = entry;
      const { clientHeight, clientWidth } = target;
      target[setState]({
        clientHeight,
        clientWidth,
      });
    });
  });
}

const Base$2 = CursorAPIMixin(
  CursorSelectMixin(
    EffectMixin(
      ItemsAPIMixin(
        ItemsCursorMixin(
          LanguageDirectionMixin(
            ResizeMixin(
              SingleSelectAPIMixin(
                SlotItemsMixin(TapCursorMixin(ReactiveElement))
              )
            )
          )
        )
      )
    )
  )
);

/**
 * Horizontal strip of items with the selected item centered
 *
 * This keeps the selected item centered unless that item is at either end of
 * the list.
 *
 * @inherits ReactiveElement
 * @mixes CursorAPIMixin
 * @mixes CursorSelectMixin
 * @mixes EffectMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes LanguageDirectionMixin
 * @mixes ResizeMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @mixes TapCursorMixin
 */
class CenteredStrip extends Base$2 {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentItemRequired: true,
      orientation: "horizontal",
    });
  }

  get orientation() {
    return this[state].orientation;
  }
  set orientation(orientation) {
    this[setState]({ orientation });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (
      changed.clientWidth ||
      changed.enableEffects ||
      changed.rightToLeft ||
      changed.currentIndex ||
      changed.swipeFraction
    ) {
      const { orientation, rightToLeft, currentIndex } = this[state];
      const sign = rightToLeft ? 1 : -1;
      const swiping = this[state].swipeFraction != null;
      const swipeFraction = this[state].swipeFraction || 0;
      const selectionFraction = currentIndex + sign * swipeFraction;

      const vertical = orientation === "vertical";
      const leadingEdge = vertical ? "offsetTop" : "offsetLeft";
      const dimension = vertical ? "offsetHeight" : "offsetWidth";

      // @ts-ignore
      const stripContainerDimension = this[ids].stripContainer[dimension];
      // @ts-ignore
      const stripDimension = this[ids].strip[dimension];

      // It seems this method can be invoked before the strip any height/width.
      // We only render if the height/width is positive.
      if (stripDimension > 0) {
        let translation = 0; // The amount by which we'll shift content horizontally
        let justifyContent = "";
        if (stripDimension <= stripContainerDimension) {
          // Container can show all items. Center all items.
          justifyContent = "center";
        } else {
          // Items are wider than container can show.
          // Center the selected item.
          // During swipes, center a pro-rated point between the midpoints
          // of the items on either side of the fractional selection.

          const itemBeforeIndex = Math.floor(selectionFraction);
          const itemBefore = this.items && this.items[itemBeforeIndex];
          const itemBeforeCenter =
            itemBefore instanceof HTMLElement
              ? itemBefore[leadingEdge] + itemBefore[dimension] / 2
              : 0;
          const itemAfterIndex = itemBeforeIndex + 1;
          const itemAfter = this.items && this.items[itemAfterIndex];
          const itemAfterCenter =
            itemAfter instanceof HTMLElement
              ? itemAfter[leadingEdge] + itemAfter[dimension] / 2
              : 0;

          let center = 0;
          if (itemBefore && !itemAfter) {
            center = itemBeforeCenter;
          } else if (!itemBefore && itemAfter) {
            center = itemAfterCenter;
          } else if (itemBefore && itemAfter) {
            const offsetFraction = selectionFraction - itemBeforeIndex;
            // TODO: sign
            center =
              itemBeforeCenter +
              offsetFraction * (itemAfterCenter - itemBeforeCenter);
          }
          if (!vertical && rightToLeft) {
            center = stripDimension - center;
          }

          // Try to center the selected item.
          translation = center - stripContainerDimension / 2;

          // Constrain x to avoid showing space on either end.
          translation = Math.max(translation, 0);
          translation = Math.min(
            translation,
            stripDimension - stripContainerDimension
          );

          translation *= sign;
        }

        const axis = vertical ? "Y" : "X";
        const transform = `translate${axis}(${translation}px)`;
        const showTransition = this[state].enableEffects && !swiping;
        Object.assign(this[ids].strip.style, {
          transform,
          transition: showTransition ? "transform 0.25s" : "none",
        });

        this[ids].stripContainer.style.justifyContent = justifyContent;
      }
    }
    if (changed.items || changed.currentIndex) {
      // Apply `selected` style to the selected item only.
      const { currentIndex, items } = this[state];
      if (items) {
        items.forEach((item, index) => {
          item.toggleAttribute("selected", index === currentIndex);
        });
      }
    }
    if (changed.orientation) {
      const flexDirection =
        this[state].orientation === "horizontal" ? "" : "column";
      this[ids].stripContainer.style.flexDirection = flexDirection;
      this[ids].strip.style.flexDirection = flexDirection;
    }
  }

  get swipeFraction() {
    return this[state].swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    this[setState]({ swipeFraction });
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          cursor: default;
          display: inline-flex;
          -webkit-tap-highlight-color: transparent;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
        }

        #stripContainer {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        #strip {
          display: inline-flex;
          position: relative;
          transition: transform 0.25s;
        }
      </style>
      <div id="stripContainer" role="none">
        <div id="strip" role="none">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

const opacityMinimum = 0.4;
const opacityMaximum = 1.0;

/**
 * Centered strip showing unselected items with partial opacity
 *
 * [`CenteredStripOpacity` is used by Carousel for dots or
 * thumbnails](/demos/centeredStripOpacity.html)
 *
 * For a variation that uses a highlight color instead of opacity, see
 * [CenteredStripHighlight](CenteredStripHighlight).
 *
 * @inherits CenteredStrip
 */
class PlainCenteredStripOpacity extends CenteredStrip {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      transitionDuration: 250,
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (
      changed.currentIndex ||
      changed.enableEffects ||
      changed.items ||
      changed.rightToLeft ||
      changed.swipeFraction ||
      changed.transitionDuration
    ) {
      // Apply opacity based on which item is current.
      const {
        currentIndex,
        enableEffects,
        items,
        rightToLeft,
        swipeFraction,
        transitionDuration,
      } = this[state];
      if (items) {
        const sign = rightToLeft ? 1 : -1;
        const swiping = swipeFraction != null;
        const selectionFraction = sign * (swipeFraction || 0);
        const showTransition = enableEffects && !swiping;
        const opacityTransitionValue = showTransition
          ? `${transitionDuration / 1000}s linear`
          : null;
        items.forEach((item, index) => {
          const existingTransition = getComputedStyle(item).transition;
          const transition = mergeSinglePropertyTransition(
            existingTransition,
            "opacity",
            opacityTransitionValue
          );
          const opacity = opacityForItemWithIndex(
            index,
            currentIndex,
            selectionFraction
          );
          Object.assign(item.style, {
            opacity,
            transition,
          });
        });
      }
    }
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          ::slotted(*) {
            opacity: ${opacityMinimum.toString()};
          }
        </style>
      `
    );
    return result;
  }

  get transitionDuration() {
    return this[state].transitionDuration;
  }
  set transitionDuration(transitionDuration) {
    this[setState]({ transitionDuration });
  }
}

/**
 * @private
 * @param {number} index
 * @param {number} currentIndex
 * @param {number} selectionFraction
 */
function opacityForItemWithIndex(index, currentIndex, selectionFraction) {
  const opacityRange = opacityMaximum - opacityMinimum;
  const fractionalIndex = currentIndex + selectionFraction;
  const leftIndex = Math.floor(fractionalIndex);
  const rightIndex = Math.ceil(fractionalIndex);
  let awayIndex = selectionFraction >= 0 ? leftIndex : rightIndex;
  let towardIndex = selectionFraction >= 0 ? rightIndex : leftIndex;
  const truncatedSwipeFraction =
    selectionFraction < 0
      ? Math.ceil(selectionFraction)
      : Math.floor(selectionFraction);
  const progress = selectionFraction - truncatedSwipeFraction;
  const opacityProgressThroughRange = Math.abs(progress) * opacityRange;

  let opacity;
  if (index === awayIndex) {
    opacity = opacityMaximum - opacityProgressThroughRange;
  } else if (index === towardIndex) {
    opacity = opacityMinimum + opacityProgressThroughRange;
  } else {
    opacity = null; // Element will pick up minimum opacity from CSS.
  }

  return opacity;
}

/**
 * Given an existing CSS `transition` value, merge a transition for the property
 * with the indicated name and value on top of it. If the value is null, remove
 * the transition for the indicated property. Return a new string that can be
 * set as the value of an element's `transition` style property.
 *
 * This helper exists because the DOM represents the entire set of property
 * transitions on an object as a single string, with no easy way to selectively
 * update just a single property value.
 *
 * @private
 * @param {string} transition
 * @param {string} name
 * @param {string|null} value
 */
function mergeSinglePropertyTransition(transition, name, value) {
  // Properties are a name, whitespace, value.
  const propertyRegex = /([\w-]+)\s+([^,]+)/g;
  let match = propertyRegex.exec(transition);
  while (match && match.groups) {
    if (match.groups.name === name) {
      break;
    }
    match = propertyRegex.exec(transition);
  }
  const definition = value ? `${name} ${value}` : "";
  if (match) {
    // Transition contains the indicated property.
    // Splice in a new value at that point.
    const start = match.index;
    const length = match[0].length;
    return (
      transition.substr(0, start) +
      definition +
      transition.substr(start + length)
    );
  } else {
    // Transition doesn't yet contain the indicated property; append it.
    return [transition, definition].join(", ");
  }
}

/**
 * Carousel styles in the Plain reference design system
 *
 * @module PlainCarouselMixin
 * @param {Constructor<ReactiveElement>} Base
 * @part {PlainCenteredStripOpacity} proxy-list
 */
function PlainCarouselMixin(Base) {
  return class PlainCarousel extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        proxyListPartType: PlainCenteredStripOpacity,
      });
    }

    [render](changed) {
      if (super[render]) {
        super[render](changed);
      }

      const proxies = this.proxies;
      if (
        (changed.dark || changed.detectDarkMode || changed.proxies) &&
        proxies
      ) {
        // Apply dark mode to proxies.
        const { dark, detectDarkMode } = this[state];
        proxies.forEach((proxy) => {
          /** @type {any} */ const cast = proxy;
          if ("dark" in cast) {
            cast.dark = dark;
          }
          if ("detectDarkMode" in cast) {
            cast.detectDarkMode = detectDarkMode;
          }
        });
      }
    }

    get [template]() {
      const result = super[template];
      result.content.append(
        fragmentFrom.html`
          <style>
            [part~="arrow-icon"] {
              font-size: 48px;
            }
          </style>
        `
      );
      return result;
    }
  };
}

/**
 * Tracks whether the element is currently selected.
 *
 * @module SelectableMixin
 * @state selected
 * @param {Constructor<ReactiveElement>} Base
 */
function SelectableMixin(Base) {
  // The class prototype added by the mixin.
  return class Selectable extends Base {
    constructor() {
      super();
      /** @type {any} */ const cast = this;
      if (!this[nativeInternals] && cast.attachInternals) {
        this[nativeInternals] = cast.attachInternals();
      }
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        selected: false,
      });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      super[render](changed);
      if (changed.selected) {
        const { selected } = this[state];
        setInternalState(this, "selected", selected);
      }
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      // TODO: How do we know whether to raise this if selection is set by Menu? */
      if (changed.selected /* && this[raiseChangeEvents] */) {
        const { selected } = this[state];
        /**
         * Raised when the `selected` property changes.
         *
         * @event selectedchange
         */
        const event = new CustomEvent("selectedchange", {
          bubbles: true,
          detail: { selected },
        });
        this.dispatchEvent(event);
      }
    }

    /**
     * True if the element is currently selected.
     *
     * @type {boolean}
     * @default false
     */
    get selected() {
      return this[state].selected;
    }
    set selected(selected) {
      // Note: AttributeMarshallingMixin will recognize `selected` as the name of
      // attribute that should be parsed as a boolean attribute, and so will
      // handling parsing it for us.
      this[setState]({ selected });
    }
  };
}

const Base$1 = SelectableMixin(Button);

/**
 * A button that tracks a selection state
 *
 * @inherits Button
 * @mixes SelectableMixin
 */
class SelectableButton extends Base$1 {}

const Base = DarkModeMixin(SelectableButton);

/**
 * A small dot component in the Plain reference design system
 *
 * This used as the default proxy element to represent items in carousels like
 * [PlainCarousel](PlainCarousel).
 *
 * @inherits SelectableButton
 * @mixes DarkModeMixin
 */
class PlainPageDot extends Base {
  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (this[firstRender]) {
      this.setAttribute("role", "none");
    }
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          :host {
            background-color: black;
            border-radius: 7px;
            box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.5);
            box-sizing: border-box;
            cursor: pointer;
            height: 8px;
            margin: 7px 5px;
            padding: 0;
            transition: opacity 0.2s;
            width: 8px;
          }

          :host([dark]) {
            background-color: white;
          }

          @media (min-width: 768px) {
            :host {
              height: 12px;
              width: 12px;
            }
          }
        </style>
      `
    );
    return result;
  }
}

/**
 * Carousel component in the Plain reference design system
 *
 * @inherits Carousel
 * @mixes DarkModeMixin
 * @mixes PlainArrowDirectionMixin
 * @mixes PlainCarouselMixin
 * @part {PlainPageDot} proxy
 */
class PlainCarousel extends DarkModeMixin(
  PlainArrowDirectionMixin(PlainCarouselMixin(Carousel))
) {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      proxyPartType: PlainPageDot,
    });
  }
}

class ElixCarousel extends PlainCarousel {}
customElements.define("elix-carousel", ElixCarousel);

/**
 * Carousel showing a thumbnail for each image
 *
 * @inherits Carousel
 * @part {img} proxy
 */
class CarouselWithThumbnails extends Carousel {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      proxyListOverlap: false,
      proxyPartType: "img",
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    /** @type {Element[]} */ const proxies = this[state].proxies;
    if ((changed.items || changed.proxies) && proxies) {
      // Update thumbnails.
      const { items } = this[state];
      proxies.forEach((proxy, index) => {
        /** @type {any} */ const item = items[index];
        /** @type {any} */ const cast = proxy;
        if (item && typeof item.src === "string" && "src" in cast) {
          cast.src = item.src;
        }
      });
    }
  }
}

/**
 * CarouselWithThumbnails component in the Plain reference design system
 *
 * @inherits CarouselWithThumbnails
 * @mixes DarkModeMixin
 * @mixes PlainArrowDirectionMixin
 * @mixes PlainCarouselMixin
 * @part {PlainArrowDirectionButton} arrow-button
 * @part {PlainCenteredStripOpacity} proxy-list
 */
class PlainCarouselWithThumbnails extends DarkModeMixin(
  PlainArrowDirectionMixin(PlainCarouselMixin(CarouselWithThumbnails))
) {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      arrowButtonPartType: PlainArrowDirectionButton,
    });
  }

  get [template]() {
    const result = super[template];

    result.content.append(
      fragmentFrom.html`
        <style>
          [part~="proxy"] {
            height: var(--elix-thumbnail-height, 4em);
            width: var(--elix-thumbnail-width, 6em);
            object-fit: contain;
          }
        </style>
      `
    );

    return result;
  }
}

class ElixCarouselWithThumbnails extends PlainCarouselWithThumbnails {}
customElements.define("elix-carousel-with-thumbnails", ElixCarouselWithThumbnails);
