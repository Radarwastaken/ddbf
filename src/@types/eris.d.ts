import { Manager } from "../Manager";

declare module "eris" {
    interface Client {
        readonly manager: Manager
    }
}
