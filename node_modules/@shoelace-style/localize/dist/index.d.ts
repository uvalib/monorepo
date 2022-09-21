import type { ReactiveController, ReactiveControllerHost } from 'lit';
export declare type FunctionParams<T> = T extends (...args: infer U) => string ? U : never;
export interface Translation {
    $code: string;
    $name: string;
    $dir: 'ltr' | 'rtl';
    [key: string]: any;
}
export declare function registerTranslation(...translation: Translation[]): void;
export declare function term<K extends keyof Translation>(lang: string, key: K, ...args: FunctionParams<Translation[K]>): any;
export declare function date(lang: string, dateToFormat: Date | string, options?: Intl.DateTimeFormatOptions): string;
export declare function number(lang: string, numberToFormat: number | string, options?: Intl.NumberFormatOptions): string;
export declare function relativeTime(lang: string, value: number, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions): string;
export declare function update(): void;
export declare class LocalizeController implements ReactiveController {
    host: ReactiveControllerHost & HTMLElement;
    constructor(host: ReactiveControllerHost & HTMLElement);
    hostConnected(): void;
    hostDisconnected(): void;
    term<K extends keyof Translation>(key: K, ...args: FunctionParams<Translation[K]>): any;
    date(dateToFormat: Date | string, options?: Intl.DateTimeFormatOptions): string;
    number(numberToFormat: number | string, options?: Intl.NumberFormatOptions): string;
    relativeTime(value: number, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions): string;
}
