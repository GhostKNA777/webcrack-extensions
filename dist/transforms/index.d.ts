import { Node, TraverseOptions } from '@babel/traverse';
export declare function applyTransformAsync<TOptions>(ast: Node, transform: AsyncTransform<TOptions>, options?: TOptions): Promise<TransformState>;
export declare function applyTransform<TOptions>(ast: Node, transform: Transform<TOptions>, options?: TOptions): TransformState;
export declare function applyTransforms(ast: Node, transforms: Transform[], name?: string): TransformState;
export interface TransformState {
    changes: number;
}
export interface Transform<TOptions = unknown> {
    name: string;
    tags: Tag[];
    run?: (ast: Node, state: TransformState, options?: TOptions) => void;
    visitor?: (options?: TOptions) => TraverseOptions<TransformState>;
}
export interface AsyncTransform<TOptions = unknown> extends Transform<TOptions> {
    run?: (ast: Node, state: TransformState, options?: TOptions) => Promise<void>;
}
export type Tag = 'safe' | 'unsafe';
