import { registerThemePropertiesLoader } from "@ui5/webcomponents-base/dist/asset-registries/Themes.js";

import defaultThemeBase from "@ui5/webcomponents-theming/dist/generated/themes/sap_fiori_3/parameters-bundle.css.js";
import defaultTheme from "./sap_fiori_3/parameters-bundle.css.js";

registerThemePropertiesLoader("@ui5/webcomponents-theming", "sap_fiori_3", () => defaultThemeBase);
registerThemePropertiesLoader("@ui5/webcomponents", "sap_fiori_3", () => defaultTheme);
export default {packageName:"@ui5/webcomponents",fileName:"themes/SelectPopover.css",content:".ui5-select-popover:not(.ui5-select-popover-valuestate) [ui5-li]:first-child::part(native-li):after{border-top-left-radius:var(--_ui5_select_option_focus_border_radius);border-top-right-radius:var(--_ui5_select_option_focus_border_radius)}.ui5-select-popover [ui5-li]:last-child::part(native-li):after{border-bottom-left-radius:var(--_ui5_select_option_focus_border_radius);border-bottom-right-radius:var(--_ui5_select_option_focus_border_radius)}.ui5-select-popover::part(content),.ui5-select-popover::part(header){padding:0}.ui5-select-popover [ui5-li]{height:var(--_ui5_list_item_dropdown_base_height)}"}