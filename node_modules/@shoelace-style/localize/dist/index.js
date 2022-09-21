const connectedElements = new Set();
const documentElementObserver = new MutationObserver(update);
const translations = new Map();
let documentLanguage = document.documentElement.lang || navigator.language;
let fallback;
documentElementObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
});
export function registerTranslation(...translation) {
    translation.map(t => {
        const code = t.$code.toLowerCase();
        translations.set(code, t);
        if (!fallback) {
            fallback = t;
        }
    });
    update();
}
export function term(lang, key, ...args) {
    const code = lang.toLowerCase().slice(0, 2);
    const subcode = lang.length > 2 ? lang.toLowerCase() : '';
    const primary = translations.get(subcode);
    const secondary = translations.get(code);
    let term;
    if (primary && primary[key]) {
        term = primary[key];
    }
    else if (secondary && secondary[key]) {
        term = secondary[key];
    }
    else if (fallback && fallback[key]) {
        term = fallback[key];
    }
    else {
        console.error(`No translation found for: ${key}`);
        return key;
    }
    if (typeof term === 'function') {
        return term(...args);
    }
    return term;
}
export function date(lang, dateToFormat, options) {
    dateToFormat = new Date(dateToFormat);
    return new Intl.DateTimeFormat(lang, options).format(dateToFormat);
}
export function number(lang, numberToFormat, options) {
    numberToFormat = Number(numberToFormat);
    return isNaN(numberToFormat) ? '' : new Intl.NumberFormat(lang, options).format(numberToFormat);
}
export function relativeTime(lang, value, unit, options) {
    return new Intl.RelativeTimeFormat(lang, options).format(value, unit);
}
export function update() {
    documentLanguage = document.documentElement.lang || navigator.language;
    [...connectedElements.keys()].map((el) => {
        if (typeof el.requestUpdate === 'function') {
            el.requestUpdate();
        }
    });
}
export class LocalizeController {
    constructor(host) {
        this.host = host;
        this.host.addController(this);
    }
    hostConnected() {
        connectedElements.add(this.host);
    }
    hostDisconnected() {
        connectedElements.delete(this.host);
    }
    term(key, ...args) {
        return term(this.host.lang || documentLanguage, key, ...args);
    }
    date(dateToFormat, options) {
        return date(this.host.lang || documentLanguage, dateToFormat, options);
    }
    number(numberToFormat, options) {
        return number(this.host.lang || documentLanguage, numberToFormat, options);
    }
    relativeTime(value, unit, options) {
        return relativeTime(this.host.lang || documentLanguage, value, unit, options);
    }
}
