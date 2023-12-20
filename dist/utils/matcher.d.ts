import { Binding, NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import * as m from '@codemod/matchers';
export declare function infiniteLoop(body?: m.Matcher<t.Statement>): m.Matcher<t.ForStatement | t.WhileStatement>;
export declare function constKey(name?: string | m.Matcher<string>): m.Matcher<t.Identifier | t.StringLiteral>;
export declare function constObjectProperty(key?: string | m.Matcher<string>, value?: m.Matcher<t.Expression>): m.Matcher<t.ObjectProperty>;
export declare function matchIife(body?: m.Matcher<t.Statement[]> | m.Matcher<t.Statement>[]): m.Matcher<t.CallExpression>;
export declare const iife: m.Matcher<t.CallExpression>;
export declare const emptyIife: m.Matcher<t.CallExpression>;
/**
 * Matches both identifier properties and string literal computed properties
 */
export declare function constMemberExpression(object: string | m.Matcher<t.Expression>, property?: string | m.Matcher<string>): m.Matcher<t.MemberExpression>;
export declare const trueMatcher: m.Matcher<t.BooleanLiteral | t.UnaryExpression>;
export declare const falseMatcher: m.Matcher<t.BooleanLiteral | t.UnaryExpression>;
export declare const truthyMatcher: m.Matcher<t.ArrayExpression | t.BooleanLiteral | t.UnaryExpression>;
/**
 * Starting at the parent path of the current `NodePath` and going up the
 * tree, return the first `NodePath` that causes the provided `matcher`
 * to return true, or `null` if the `matcher` never returns true.
 */
export declare function findParent<T extends t.Node>(path: NodePath, matcher: m.Matcher<T>): NodePath<T> | null;
/**
 * Starting at current `NodePath` and going up the tree, return the first
 * `NodePath` that causes the provided `matcher` to return true,
 * or `null` if the `matcher` never returns true.
 */
export declare function findPath<T extends t.Node>(path: NodePath, matcher: m.Matcher<T>): NodePath<T> | null;
/**
 * Function expression matcher that captures the parameters
 * and allows them to be referenced in the body.
 */
export declare function createFunctionMatcher(params: number, body: (...captures: m.Matcher<t.Identifier>[]) => m.Matcher<t.Statement[]> | m.Matcher<t.Statement>[]): m.Matcher<t.FunctionExpression>;
/**
 * Returns true if every reference is a member expression whose value is read
 */
export declare function isReadonlyObject(binding: Binding, memberAccess: m.Matcher<t.MemberExpression>): boolean;
