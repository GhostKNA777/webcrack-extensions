import * as t from '@babel/types';
import { Module } from '../module';
export declare class BrowserifyModule extends Module {
    dependencies: Record<number, string>;
    constructor(id: string, ast: t.File, isEntry: boolean, dependencies: Record<number, string>);
}
