import { Message } from "eris";
import { Manager } from "../Manager";
import type { Promisable } from "../util";
import type { Args as LexureArgs } from "lexure";

export interface Command<Args extends unknown[] = string[]> {
    readonly id: string;
    readonly triggers: string[];
    readonly init?: (manager: Manager) => Promisable<unknown>;
    readonly parseArgs?: (msg: Message, args: string[]) => Promisable<Args>;
    readonly blockIf?: BlockFn;
    readonly run: (msg: Message, args: Args, lexureArgs: LexureArgs) => Promisable<unknown>;
    readonly shutdown?: (manager: Manager) => Promisable<unknown>;
}

export type BlockFn = (msg: Message) => Promisable<boolean>
