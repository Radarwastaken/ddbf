import EventEmitter from "events";
import { requireProper } from "./util";
import { Client } from "./Client";
import { Extension } from "./Extension";

export class Manager extends EventEmitter {
    public readonly options?: ManagerOptions;
    public readonly extensions: Set<Extension>;
    public readonly client: Client;

    public constructor(client: Client, options?: ManagerOptions) {
        super();

        this.client = client;
        this.options = options;
        this.extensions = new Set();
    }

    public async init(): Promise<void> {
        this.options?.extensions?.forEach(async (ext) => {
            await this.loadExtension(ext);
        });
    }

    public async loadExtension(extension: string | Extension): Promise<void> {
        if (typeof extension === "string")
            extension = requireProper<Extension>(extension);
        if (extension.init) await extension.init(this);

        await extension.load(this);
        this.extensions.add(extension);
    }

    public async unloadExtension(extension: string | Extension): Promise<void> {
        if (typeof extension === "string")
            extension = requireProper<Extension>(extension);
        if (extension.shutdown) await extension.shutdown(this);

        await extension.unload(this);
        this.extensions.delete(extension);
    }
}

export interface ManagerOptions {
    extensions?: (string | Extension)[];
}
