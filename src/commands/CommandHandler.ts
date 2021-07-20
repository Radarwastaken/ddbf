import { readdir } from "fs/promises";
import { requireProper } from "../util";
import { Command } from "./Command";
import { CommandHandlerListener } from "./CommandHandlerListener";
import { ListenerHandler } from "../listeners/ListenerHandler";
import { Manager } from "../Manager";
import "lexure";
import { Args, Lexer, Parser, prefixedStrategy } from "lexure";

const loadFilter = (f: string) => f === "index.js" || !f.endsWith("js");

export class CommandHandler {
    public static commands: Set<Command> = new Set();
    public static prefixes: Set<string> = new Set();

    public static async loadFrom(
        manager: Manager,
        dir = __dirname,
        filter: (file: string) => unknown = loadFilter
    ): Promise<void> {
        const files = await readdir(dir);
        files.filter(filter).forEach(async (file) => {
            await this.load(manager, file);
        });
    }

    public static async load(
        manager: Manager,
        cmd: string | Command
    ): Promise<void> {
        if (typeof cmd === "string") cmd = requireProper<Command>(cmd);
        if (cmd.init) await cmd.init(manager);
        if (!this.commands.has(cmd)) this.commands.add(cmd);
    }

    public static async unload(
        manager: Manager,
        cmd: string | Command
    ): Promise<boolean> {
        if (typeof cmd === "string") cmd = requireProper<Command>(cmd);
        if (cmd.shutdown) await cmd.shutdown(manager);
        if (this.commands.has(cmd)) return this.commands.delete(cmd);
        return false;
    }

    public static async unloadFrom(
        manager: Manager,
        dir = __dirname,
        filter: (file: string) => unknown = loadFilter
    ): Promise<void> {
        const files = await readdir(dir);
        files.filter(filter).forEach(async (file) => {
            await this.unload(manager, file);
        });
    }

    public static async init(): Promise<void> {
        await ListenerHandler.load(CommandHandlerListener);
    }

    public static parseCommand(str: string): [Command, string[], Args] | null {
        const lexer = new Lexer(str).setQuotes([
            ['"', '"'],
            ["“", "”"],
            ["「", "」"],
        ]);

        const prefixLength = (s: string) =>
            Array.from(this.prefixes).find(s.startsWith)?.length || null;
        const lout = lexer.lexCommand(prefixLength);
        if (!lout) return null;

        const [possibleCommand, getTokens] = lout;
        const command = Array.from(this.commands).find((cmd) =>
            cmd.triggers.includes(possibleCommand.value)
        );
        if (!command) return null;
        const pout = new Parser(getTokens())
            .setUnorderedStrategy(prefixedStrategy(["--", "—"], ["=", ":"]))
            .parse();

        const args = new Args(pout);
        return [command, Array.from(args), args];
    }

}
