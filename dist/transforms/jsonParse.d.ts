declare const _default: {
    name: string;
    tags: "safe"[];
    visitor: () => {
        CallExpression: {
            exit(this: import(".").TransformState, path: import("@babel/traverse").NodePath<import("@babel/types").CallExpression>): void;
        };
        noScope: true;
    };
};
export default _default;
