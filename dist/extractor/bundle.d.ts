import * as m from '@codemod/matchers';
import { Module } from './module';
export declare class Bundle {
    type: 'webpack' | 'browserify';
    entryId: string;
    modules: Map<string, Module>;
    constructor(type: 'webpack' | 'browserify', entryId: string, modules: Map<string, Module>);
    applyMappings(mappings: Record<string, m.Matcher<unknown>>): void;
    /**
     * Saves each module to a file and the bundle metadata to a JSON file.
     * @param path Output directory
     */
    save(path: string): Promise<void>;
    applyTransforms(): void;
}
