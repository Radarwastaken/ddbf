/* eslint-disable @typescript-eslint/no-explicit-any */
export type Promisable<T> = Promise<T> | T;

export type ListenerType = "on" | "once";
export type Class<T = unknown, Arguments extends unknown[] = unknown[]> = new (
    ...arguments_: Arguments
) => T;

export interface Type<T> extends Function {
    new (...args: any[]): T;
}
