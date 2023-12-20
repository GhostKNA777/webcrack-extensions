import * as t from '@babel/types';
import { VMDecoder } from './vm';
/**
 * Replaces calls to decoder functions with the decoded string.
 * E.g. `m(199)` -> `'log'`
 */
declare const _default: {
    name: string;
    tags: "unsafe"[];
    run(ast: t.Node, state: import("../transforms").TransformState, options: {
        vm: VMDecoder;
    } | undefined): Promise<void>;
};
export default _default;
