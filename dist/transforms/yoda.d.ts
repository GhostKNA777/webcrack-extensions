import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor: () => {
        BinaryExpression: {
            exit(this: import(".").TransformState, { node }: import("@babel/traverse").NodePath<t.BinaryExpression>): void;
        };
        noScope: true;
    };
};
export default _default;
