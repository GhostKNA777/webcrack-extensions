import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { StringArray } from './stringArray';
/**
 * A function that is called with >= 1 numeric/string arguments
 * and returns a string from the string array. It may also decode
 * the string with Base64 or RC4.
 */
export declare class Decoder {
    name: string;
    path: NodePath<t.FunctionDeclaration>;
    constructor(name: string, path: NodePath<t.FunctionDeclaration>);
    collectCalls(): NodePath<t.CallExpression>[];
}
export declare function findDecoders(stringArray: StringArray): Decoder[];
