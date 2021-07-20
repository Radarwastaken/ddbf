import { Promisable } from "../util";

export interface Listener {
    id?: string;
    event: string;// ClientEvents enum from that pr can be useful here.
    emitter: "client"|"manager"|string;
    type?: "once"|"on"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    run: (...args: any[]) => Promisable<unknown>
}
// Note: I did not want to use any but unknown didn't work. never works but breaks when it comes to running the listener in ListenerHandler.init
