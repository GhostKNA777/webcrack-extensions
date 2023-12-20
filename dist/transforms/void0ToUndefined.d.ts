import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor: () => {
        UnaryExpression: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.UnaryExpression>): void;
        };
        noScope: true;
    };
};
export default _default;
