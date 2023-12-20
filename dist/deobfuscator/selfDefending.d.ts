import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor(): {
        VariableDeclarator(this: import("../transforms").TransformState, path: NodePath<t.VariableDeclarator>): void;
        noScope: true;
    };
};
export default _default;
