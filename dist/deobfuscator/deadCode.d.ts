import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "unsafe"[];
    visitor(): {
        'IfStatement|ConditionalExpression': {
            exit(this: import("../transforms").TransformState, _path: NodePath<t.Node>): void;
        };
        noScope: true;
    };
};
export default _default;
