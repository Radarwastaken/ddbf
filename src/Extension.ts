import type { Manager } from "./Manager";
import type { Promisable } from "./util";

export interface Extension {
    readonly id?: string;
    readonly init?: (manager: Manager) => Promisable<unknown>;
    readonly load: (manager: Manager) => Promisable<unknown>;
    readonly shutdown?: (manager: Manager) => Promisable<unknown>;
    readonly unload: (manager: Manager) => Promisable<unknown>;
}
