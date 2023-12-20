declare const _default: {
    name: string;
    tags: "safe"[];
    visitor(): {
        FunctionDeclaration(this: import("../transforms").TransformState, path: import("@babel/traverse").NodePath<import("@babel/types").FunctionDeclaration>): void;
        noScope: true;
    };
};
export default _default;
