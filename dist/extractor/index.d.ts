import * as t from '@babel/types';
import * as m from '@codemod/matchers';
import { Bundle } from './bundle';
export declare function unpackBundle(ast: t.Node, mappings?: Record<string, m.Matcher<unknown>>): Bundle | undefined;
