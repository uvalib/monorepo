declare class FormDataEventPolyfill extends Event {
    formData: FormData;
    constructor(formData: FormData);
}
declare class FormDataPolyfill extends FormData {
    private form;
    constructor(form: HTMLFormElement);
    append(name: string, value: any): void;
}
declare function supportsFormDataEvent(): boolean;
declare function polyfillFormData(): void;
