import * as t from '@babel/types';
declare const _default: {
    name: string;
    tags: "safe"[];
    visitor(): {
        'MemberExpression|OptionalMemberExpression': {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.Node>): void;
        };
        'ObjectProperty|ClassProperty|ObjectMethod|ClassMethod': {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<t.Node>): void;
        };
        noScope: true;
    };
};
export default _default;
