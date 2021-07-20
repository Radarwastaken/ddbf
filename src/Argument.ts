import type {
    CategoryChannel,
    Channel,
    Guild,
    Member,
    Message,
    NewsChannel,
    Role,
    TextableChannel,
    TextChannel,
    User,
    VoiceChannel,
} from "eris";

import { Constants } from "eris";

/**
 * The builtin class with static methods to use for argument parsing.
 * @example
 * ```typescript
 * import { Argument } from "ddbf";
 *
 * // inside a command,
 * parseArgs(msg, args): [number, ...string] {
 *     // first arg as integer
 *     args[0] = Argument.Integer(msg, args[0])
 *     return args;
 *   }
 * ```
 */
export class Argument {
    static Integer(_: Message, arg: string): number | null {
        const i = parseInt(arg);
        return Number.isNaN(i) ? null : i;
    }

    static Float(_: Message, arg: string): number | null {
        const f = parseFloat(arg);
        return Number.isNaN(f) ? null : f;
    }

    static Date(_: Message, arg: string): Date | null {
        const d = new Date(arg);
        if (Number.isNaN(d.getTime())) return null;
        return d;
    }

    static Boolean(_: Message, arg: string): boolean | null {
        const t = ["yes", "y", "1", "true", "t"];
        const f = ["no", "n", "0", "false", "f"];
        return t.includes(arg.toLowerCase())
            ? true
            : f.includes(arg.toLowerCase())
            ? false
            : null;
    }

    static Member(msg: Message, arg: string): Member | null {
        if ("guild" in msg.channel) {
            return (
                msg.channel.guild.members.get(arg) ||
                msg.channel.guild.members.find(
                    (m) =>
                        (m.nick
                            ? m.nick.toLowerCase()
                            : m.username.toLowerCase()) === arg.toLowerCase()
                ) ||
                null
            );
        }
        return null;
    }

    static User(msg: Message, arg: string): User | null {
        return (
            msg.channel.client.users.get(arg) ||
            msg.channel.client.users.find(
                (u) => u.username.toLowerCase() === arg.toLowerCase()
            ) ||
            null
        );
    }

    static Guild(msg: Message, arg: string): Guild | null {
        return (
            msg.channel.client.guilds.get(arg) ||
            msg.channel.client.guilds.find(
                (g) => g.name.toLowerCase() === arg.toLowerCase()
            ) ||
            null
        );
    }

    static Role(msg: Message, arg: string): Role | null {
        if ("guild" in msg.channel) {
            return (
                msg.channel.guild.roles.get(arg) ||
                msg.channel.guild.roles.find(
                    (r) => r.name.toLowerCase() === arg.toLowerCase()
                ) ||
                null
            );
        }
        return null;
    }

    static Channel(
        msg: Message,
        arg: string,
        guildOnly = false
    ): Channel | null {
        const c = guildOnly ? null : msg.channel.client.getChannel(arg) || null;
        if (c) return c;
        if ("guild" in msg.channel) {
            return (
                msg.channel.guild.channels.find(
                    (c) => c.name.toLowerCase() === arg.toLowerCase()
                ) || null
            );
        }
        return null;
    }

    static TextableChannel(
        msg: Message,
        arg: string,
        guildOnly = false
    ): TextableChannel | null {
        const t: (keyof Constants["ChannelTypes"])[] = [
            Constants.ChannelTypes.GUILD_TEXT,
            Constants.ChannelTypes.GUILD_NEWS,
            Constants.ChannelTypes.DM,
            Constants.ChannelTypes.GROUP_DM,
        ];
        const c = this.Channel(msg, arg, guildOnly);
        if (c && t.includes(c.type)) return c as TextableChannel;
        return null;
    }

    static TextChannel(
        msg: Message,
        arg: string,
        guildOnly = false
    ): TextChannel | null {
        const c = this.Channel(msg, arg, guildOnly);
        if (c && c.type === Constants.ChannelTypes.GUILD_TEXT)
            return c as TextChannel;
        return null;
    }

    static NewsChannel(
        msg: Message,
        arg: string,
        guildOnly = false
    ): NewsChannel | null {
        const c = this.Channel(msg, arg, guildOnly);
        if (c && c.type === Constants.ChannelTypes.GUILD_NEWS)
            return c as NewsChannel;
        return null;
    }

    static VoiceChannel(
        msg: Message,
        arg: string,
        guildOnly = false
    ): VoiceChannel | null {
        const c = this.Channel(msg, arg, guildOnly);
        if (c && c.type === Constants.ChannelTypes.GUILD_VOICE)
            return c as VoiceChannel;
        return null;
    }

    static CategoryChannel(
        msg: Message,
        arg: string,
        guildOnly = false
    ): CategoryChannel | null {
        const c = this.Channel(msg, arg, guildOnly);
        if (c && c.type === Constants.ChannelTypes.GUILD_CATEGORY)
            return c as CategoryChannel;
        return null;
    }

    /**
     * @todo Add support for permissions resolvable by users (i.e. resolve permissions like "Use Voice Activity" as useVAD)
     */
    static Permission(
        _: Message,
        arg: string
    ): keyof Constants["Permissions"] | null {
        // TODO
        const p = Object.keys(Constants.Permissions);
        p.forEach((p) => p.toLowerCase());
        return p.includes(arg.toLowerCase()) ? arg : null;
    }
}
