import { Binding, NodePath } from '@babel/traverse';
import * as t from '@babel/types';
/**
 * Make sure the array is immutable and references are valid before using!
 *
 * Example:
 * `const arr = ["foo", "bar"]; console.log(arr[0]);` -> `console.log("foo");`
 */
export declare function inlineArrayElements(array: t.ArrayExpression, references: NodePath[]): void;
/**
 * Inline function used in control flow flattening (that only returns an expression)
 * Example:
 * fn: `function (a, b) { return a(b) }`
 * caller: `fn(a, 1)`
 * ->
 * `a(1)`
 */
export declare function inlineCfFunction(fn: t.FunctionExpression, caller: NodePath<t.CallExpression>): void;
/**
 * Example:
 * `function alias(a, b) { return decode(b - 938, a); alias(1071, 1077);`
 * ->
 * `decode(1077 - 938, 1071)`
 */
export declare function inlineFunctionAliases(binding: Binding): {
    changes: number;
};
/**
 * Recursively renames all references to the binding.
 * Make sure the binding name isn't shadowed anywhere!
 *
 * Example: `var alias = decoder; alias(1);` -> `decoder(1);`
 */
export declare function inlineVariableAliases(binding: Binding, targetName?: string): {
    changes: number;
};
