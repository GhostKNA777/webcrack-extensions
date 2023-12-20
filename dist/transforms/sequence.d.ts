import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor: () => {
        ExpressionStatement: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.ExpressionStatement>): void;
        };
        ReturnStatement: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.ReturnStatement>): void;
        };
        IfStatement: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.IfStatement>): void;
        };
        SwitchStatement: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.SwitchStatement>): void;
        };
        ThrowStatement: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.ThrowStatement>): void;
        };
        ForInStatement: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.ForInStatement>): void;
        };
        ForStatement: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.ForStatement>): void;
        };
        VariableDeclaration: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.VariableDeclaration>): void;
        };
        noScope: true;
    };
};
export default _default;
