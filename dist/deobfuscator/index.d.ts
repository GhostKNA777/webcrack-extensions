import { Sandbox } from './vm';
declare const _default: {
    name: string;
    tags: "unsafe"[];
    run(ast: import("@babel/types").Node, state: import("../transforms").TransformState, sandbox: Sandbox | undefined): Promise<void>;
};
export default _default;
