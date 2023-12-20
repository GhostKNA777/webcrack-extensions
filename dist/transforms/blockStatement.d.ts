import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor: () => {
        IfStatement: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.IfStatement>): void;
        };
        Loop: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.Loop>): void;
        };
        ArrowFunctionExpression: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.ArrowFunctionExpression>): void;
        };
        noScope: true;
    };
};
export default _default;
