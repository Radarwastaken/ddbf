import { Message } from "eris";
import { CommandHandler } from "./CommandHandler";
import { Listener } from "../listeners/Listener";

export const CommandHandlerListener: Listener = {
    id: "internals.commandHandlerListener",
    emitter: "client",
    event: "messageCreate",
    async run(message: Message): Promise<void> {
        const parsed = CommandHandler.parseCommand(message.content);
        if (!parsed) return;
        const command = parsed[0];
        let args = parsed[1];
        if (command.blockIf) {
            if (await command.blockIf(message)) return;
        }
        if(command.parseArgs) {
            args = await command.parseArgs(message, args);
        }
        await command.run(message, args, parsed[2]);
    },
};
