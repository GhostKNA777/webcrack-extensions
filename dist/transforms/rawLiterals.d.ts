declare const _default: {
    name: string;
    tags: "safe"[];
    visitor: () => {
        StringLiteral(this: import(".").TransformState, path: import("@babel/traverse").NodePath<import("@babel/types").StringLiteral>): void;
        NumericLiteral(this: import(".").TransformState, path: import("@babel/traverse").NodePath<import("@babel/types").NumericLiteral>): void;
        noScope: true;
    };
};
export default _default;
