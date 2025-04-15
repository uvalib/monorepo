/* gulpfile.js */

/**
* Import uswds-compile
*/
import uswds from "@uswds/compile";

/**
* USWDS version
* Set the major version of USWDS you're using
* (Current options are the numbers 2 or 3)
*/
uswds.settings.version = 3;

/**
* Path settings
* Set as many as you need
*/
//uswds.paths.dist.css = './assets/css';
//uswds.paths.dist.theme = './sass/uswds';

/**
* Exports
* Add as many as you need
*/
export const init = uswds.init;
export const compile = uswds.compile;
export const watch = uswds.watch;