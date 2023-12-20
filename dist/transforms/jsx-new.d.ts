import * as t from '@babel/types';
/**
 * https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md
 * https://new-jsx-transform.netlify.app/
 */
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
