/** A helper type to describe something that could either be a promise or not. */
export type Awaitable<T> = PromiseLike<T> | T