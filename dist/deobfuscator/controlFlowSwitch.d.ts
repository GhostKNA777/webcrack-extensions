import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor(): {
        BlockStatement: {
            exit(this: import("../transforms").TransformState, path: import("@babel/traverse").NodePath<t.BlockStatement>): void;
        };
        noScope: true;
    };
};
export default _default;
