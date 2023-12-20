declare const _default: {
    name: string;
    tags: "safe"[];
    visitor(): {
        ExpressionStatement: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<import("@babel/types").ExpressionStatement>): void;
        };
        ReturnStatement: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<import("@babel/types").ReturnStatement>): void;
        };
        noScope: true;
    };
};
export default _default;
