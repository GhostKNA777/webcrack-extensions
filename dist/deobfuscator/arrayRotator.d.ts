import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { StringArray } from './stringArray';
export type ArrayRotator = NodePath<t.ExpressionStatement>;
/**
 * Structure:
 * ```
 * iife (>= 2 parameters, called with 0 or 2 arguments)
 *  2 variable declarations (array and decoder)
 *  endless loop:
 *   try:
 *    if/break/parseInt/array.push(array.shift())
 *   catch:
 *    array.push(array.shift())
 * ```
 */
export declare function findArrayRotator(stringArray: StringArray): ArrayRotator | undefined;
