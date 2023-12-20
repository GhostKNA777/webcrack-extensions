import * as t from '@babel/types';
/**
 * Merges object assignments into the object expression.
 * Example:
 * ```js
 * const obj = {};
 * obj.foo = 'bar';
 * ```
 * ->
 * ```js
 * const obj = { foo: 'bar' };
 * ```
 */
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor: () => {
        Program(this: import("../transforms").TransformState, path: import("@babel/traverse").NodePath<t.Program>): void;
        VariableDeclaration: {
            exit(this: import("../transforms").TransformState, path: import("@babel/traverse").NodePath<t.VariableDeclaration>): void;
        };
    };
};
export default _default;
