import { Manager } from "../Manager";
import { Promisable } from "../util";

export interface Listener {
    readonly id?: string;
    readonly init?: (manager: Manager) => Promisable<unknown>;
    readonly shutdown?: (manager: Manager) => Promisable<unknown>;
    readonly event: string; // ClientEvents enum from that pr can be useful here.
    readonly emitter: "client" | "manager" | string;
    readonly type?: "once" | "on";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    run: (...args: any[]) => Promisable<unknown>;
}
// Note: I did not want to use any but unknown didn't work. never works but breaks when it comes to running the listener in ListenerHandler.init
