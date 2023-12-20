import { Bundle } from '../bundle';
import { BrowserifyModule } from './module';
export declare class BrowserifyBundle extends Bundle {
    constructor(entryId: string, modules: Map<string, BrowserifyModule>);
}
