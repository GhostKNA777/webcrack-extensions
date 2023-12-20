import * as m from '@codemod/matchers';
import { Sandbox } from './deobfuscator/vm';
import { Bundle } from './extractor/bundle';
export interface WebcrackResult {
    code: string;
    bundle: Bundle | undefined;
    /**
     * Save the deobufscated code and the extracted bundle to the given directory.
     * @param path Output directory
     */
    save(path: string): Promise<void>;
}
export interface Options {
    /**
     * Decompile react components to JSX.
     * @default true
     */
    jsx?: boolean;
    /**
     * Extract modules from the bundle.
     * @default true
     */
    unpack?: boolean;
    /**
     * Deobfuscate the code.
     * @default true
     */
    deobfuscate?: boolean;
    /**
     * Mangle variable names.
     * @default false
     */
    mangle?: boolean;
    /**
     * Assigns paths to modules based on the given matchers.
     * This will also rewrite `require()` calls to use the new paths.
     *
     * @example
     * ```js
     * m => ({
     *   './utils/color.js': m.regExpLiteral('^#([0-9a-f]{3}){1,2}$')
     * })
     * ```
     */
    mappings?: (m: typeof import('@codemod/matchers')) => Record<string, m.Matcher<unknown>>;
    /**
     * Function that executes a code expression and returns the result (typically from the obfuscator).
     */
    sandbox?: Sandbox;
}
export declare function webcrack(code: string, options?: Options): Promise<WebcrackResult>;
