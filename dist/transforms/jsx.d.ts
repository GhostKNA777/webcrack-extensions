import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "unsafe"[];
    visitor: () => {
        CallExpression: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.CallExpression>): void;
        };
        noScope: true;
    };
};
export default _default;
