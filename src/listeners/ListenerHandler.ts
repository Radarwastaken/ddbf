import { readdir } from "fs/promises";
import EventEmitter from "node:events";
import { requireProper } from "../util";
import { Listener } from "./Listener";
import { Manager } from "../Manager";

const loadFilter = (f: string) => f === "index.js" || !f.endsWith("js");

export class ListenerHandler {
    public static emitters: Set<EventEmitter> = new Set();

    public static listeners: Set<Listener> = new Set();

    public static async loadFrom(
        dir = __dirname,
        manager: Manager,
        filter: (file: string) => unknown = loadFilter
    ): Promise<void> {
        const files = await readdir(dir);
        files.filter(filter).forEach(async (file) => {
            await this.load(file, manager);
        });
    }

    public static async load(
        listener: string | Listener,
        manager: Manager
    ): Promise<void> {
        if (typeof listener === "string")
            listener = requireProper<Listener>(listener);
        if (listener.init) await listener.init(manager);
        this.listeners.add(listener);
    }

    public static async unload(
        listener: string | Listener,
        manager: Manager
    ): Promise<void> {
        if (typeof listener === "string")
            listener = requireProper<Listener>(listener);
        const emitter: EventEmitter = Reflect.get(listener, "__emitter");
        if (listener.shutdown) await listener.shutdown(manager);
        emitter.removeListener(listener.event, listener.run);
        this.listeners.delete(listener);
    }

    public static async unloadFrom(
        dir = __dirname,
        manager: Manager,
        filter: (file: string) => unknown = loadFilter
    ): Promise<void> {
        const files = await readdir(dir);
        files.filter(filter).forEach(async (file) => {
            await this.unload(file, manager);
        });
    }

    public static async init(manager: Manager): Promise<void> {
        this.listeners.forEach((listener) => {
            const emitter: EventEmitter | undefined =
                listener.emitter === "manager"
                    ? manager
                    : listener.emitter === "client"
                    ? manager.client
                    : Array.from(this.emitters).find(
                          (emitter) =>
                              emitter.constructor.name === listener.emitter
                      );

            if (!emitter)
                throw new Error(
                    `Emitter ${listener.emitter} was not found :: Did you forget to set it using ListenerHandler.setEmitters ?`
                );
            Reflect.set(listener, "__emitter", emitter);
            listener.type === "once"
                ? emitter.once(listener.event, listener.run)
                : emitter.on(listener.event, listener.run);
        });
    }

    public static setEmitters(emitters: EventEmitter[]): void {
        emitters.forEach(this.emitters.add);
    }

    public static removeEmitters(emitters: EventEmitter[]): void {
        emitters.filter(this.emitters.has).every(this.emitters.delete);
    }
}
