import * as t from '@babel/types';
export declare class Module {
    #private;
    id: string;
    isEntry: boolean;
    path: string;
    /**
     * @internal
     */
    ast: t.File;
    constructor(id: string, ast: t.File, isEntry: boolean);
    /**
     * @internal
     */
    regenerateCode(): string;
    get code(): string;
    set code(code: string);
}
