import { WebpackModule } from './module';
/**
 * ```js
 * (function(global) {
 *   // ...
 * }.call(exports, require(7)))
 * ```
 * ->
 * ```js
 * var global = require(7);
 * // ...
 * ```
 */
export declare function inlineVarInjections(module: WebpackModule): void;
