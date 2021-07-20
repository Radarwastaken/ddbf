
export * from "./types";

/**
 * Utility Functions
 */

export function requireProper<T>(id: string): T {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const res = require(id);
    return ("default" in res ? res.default : res) as T;
}
