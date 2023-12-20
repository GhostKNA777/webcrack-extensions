import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor(): {
        BinaryExpression: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.BinaryExpression>): void;
        };
        StringLiteral: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.StringLiteral>): void;
        };
        noScope: true;
    };
};
export default _default;
