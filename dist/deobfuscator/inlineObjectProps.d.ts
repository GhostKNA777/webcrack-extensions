import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
/**
 * Inline objects that only have string or numeric literal properties.
 * Used by the "String Array Calls Transform" option for moving the
 * decode call arguments into an object.
 * Example:
 * ```js
 * const obj = {
 *   c: 0x2f2,
 *   d: '0x396',
 * };
 * console.log(decode(obj.c, obj.d));
 * ```
 * ->
 * ```js
 * console.log(decode(0x2f2, '0x396'));
 * ```
 */
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor(): {
        VariableDeclarator(this: import("../transforms").TransformState, path: NodePath<t.VariableDeclarator>): void;
        noScope: true;
    };
};
export default _default;
