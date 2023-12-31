import { Bundle } from '../bundle';
import { WebpackModule } from './module';
export declare class WebpackBundle extends Bundle {
    constructor(entryId: string, modules: Map<string, WebpackModule>);
    /**
     * Undoes some of the transformations that Webpack injected into the modules.
     */
    applyTransforms(): void;
    /**
     * Replaces `require(id)` calls with `require("./relative/path.js")` calls.
     */
    private replaceRequirePaths;
}
