import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor: () => {
        ExpressionStatement: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.ExpressionStatement>): void;
        };
        noScope: true;
    };
};
export default _default;
