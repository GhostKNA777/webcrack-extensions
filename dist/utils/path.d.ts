export declare function relativePath(from: string, to: string): string;
/**
 * Resolve the path of each module of a browserify bundle
 * based on its dependencies.
 * @param tree module id -> dependencies (id -> path)
 * @param entry entry module id
 */
export declare function resolveDependencyTree(tree: Record<string, Record<string, string>>, entry: string): Record<string, string>;
