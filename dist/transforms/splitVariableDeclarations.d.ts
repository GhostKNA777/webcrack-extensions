import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor: () => {
        VariableDeclaration: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.VariableDeclaration>): void;
        };
        noScope: true;
    };
};
export default _default;
