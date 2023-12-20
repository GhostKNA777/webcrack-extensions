import { NodePath } from '@babel/traverse';
import { CallExpression } from '@babel/types';
import { ArrayRotator } from './arrayRotator';
import { Decoder } from './decoder';
import { StringArray } from './stringArray';
export type Sandbox = (code: string) => Promise<unknown>;
export declare function createNodeSandbox(): Sandbox;
export declare function createBrowserSandbox(): Sandbox;
export declare class VMDecoder {
    decoders: Decoder[];
    private setupCode;
    private sandbox;
    constructor(sandbox: Sandbox, stringArray: StringArray, decoders: Decoder[], rotator?: ArrayRotator);
    decode(calls: NodePath<CallExpression>[]): Promise<unknown[]>;
}
