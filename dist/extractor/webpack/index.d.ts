import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { Bundle } from '../bundle';
export declare const unpackWebpack: {
    name: string;
    tags: "unsafe"[];
    visitor(options: {
        bundle: Bundle | undefined;
    } | undefined): {
        CallExpression(this: import("../../transforms").TransformState, path: NodePath<t.CallExpression>): void;
        noScope: true;
    };
};
