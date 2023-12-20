import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
/**
 * Replaces all references to `var alias = decode;` with `decode`
 */
declare const _default: {
    name: string;
    tags: "unsafe"[];
    run(ast: t.Node, state: import("../transforms").TransformState, decoder: NodePath<t.FunctionDeclaration> | undefined): void;
};
export default _default;
