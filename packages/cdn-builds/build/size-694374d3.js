import { a9 as cssPartial, b as baseHeightMultiplier, d as density, e as designUnit } from './SiteStyleMapping-b3f47ce3.js';

/**
 * The CSS value for disabled cursors.
 * @public
 */
const disabledCursor = "not-allowed";

/**
 * A formula to retrieve the control height.
 * Use this as the value of any CSS property that
 * accepts a pixel size.
 */
const heightNumber = cssPartial `(${baseHeightMultiplier} + ${density}) * ${designUnit}`;

export { disabledCursor as d, heightNumber as h };
