import { Binding, NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export declare function renameFast(binding: Binding, newName: string): void;
export declare function renameParameters(path: NodePath<t.Function>, newNames: string[]): void;
