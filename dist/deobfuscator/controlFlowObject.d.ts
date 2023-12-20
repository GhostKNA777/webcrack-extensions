import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
/**
 * Explanation: https://excalidraw.com/#json=0vehUdrfSS635CNPEQBXl,hDOd-UO9ETfSDWT9MxVX-A
 */
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor(): {
        VariableDeclarator: {
            exit(this: import("../transforms").TransformState, path: NodePath<t.VariableDeclarator>): void;
        };
        noScope: true;
    };
};
export default _default;
