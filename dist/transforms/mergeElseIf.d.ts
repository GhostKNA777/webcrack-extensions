import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor(): {
        IfStatement: {
            exit(this: import(".").TransformState, path: NodePath<t.IfStatement>): void;
        };
        noScope: true;
    };
};
export default _default;
