import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export interface StringArray {
    path: NodePath<t.FunctionDeclaration>;
    references: NodePath[];
    name: string;
    length: number;
}
export declare function findStringArray(ast: t.Node): StringArray | undefined;
