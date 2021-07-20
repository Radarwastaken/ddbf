// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./@types/eris.d.ts" />

import { Client as ErisClient, ClientOptions } from "eris";
import { Manager, ManagerOptions } from "./Manager";

export class Client extends ErisClient {
    public readonly manager: Manager;

    public constructor(
        token: string,
        options?: ClientOptions,
        managerOptions?: ManagerOptions
    ) {
        super(token, options);
        this.manager = new Manager(this, managerOptions);
    }
}
