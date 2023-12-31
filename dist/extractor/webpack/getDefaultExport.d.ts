import { WebpackBundle } from './bundle';
/**
 * Convert require.n calls to require the default export depending on the target module type
 * ```js
 * const m = require(1);
 * const getter = require.n(m);
 * console.log(getter.a.prop, getter().prop);
 * ```
 * ->
 * ```js
 * const m = require(1);
 * console.log(m.prop, m.prop);
 * ```
 */
export declare function convertDefaultRequire(bundle: WebpackBundle): void;
