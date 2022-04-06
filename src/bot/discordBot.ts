import {Client, ClientOptions, SnowflakeUtil} from "discord.js";
import {REST} from "@discordjs/rest";
import winston from "winston";
import {container, injectable, registry} from "tsyringe";
import {RuleListener} from "./rule/ruleListener";
import {RolesListener} from "./roles/rolesListener";

@injectable()
@registry(
    [
        {
            token: "listener",
            useToken: RuleListener
        },
        {
            token: "listener",
            useToken: RolesListener
        }
    ]
)
export class DiscordBot {
    private readonly _discordClient?: Client;
    private readonly _rest?: REST;
    private readonly parserChannel;
    private readonly guildId?: string;
    private readonly clientId?: string;

    constructor(options: ClientOptions, restOption: { version: string }) {
        this.parserChannel = process.env.DISCORD_PARSER_CHANNEL;
        this.guildId = process.env.DISCORD_GUILD_ID;
        this.clientId = process.env.DISCORD_CLIENT_ID;
        winston.info("Connecting to Discord");
        this._discordClient = new Client(options);
        this._rest = new REST(restOption);
        winston.info("Connected to Discord");
        this._discordClient.on("ready", () => this._onReady()); // TODO: Check how i can improve this
        winston.info("Discord Bot initialized");
        container.register("discordClient", {useValue: this._discordClient});
        container.register("discordRest", {useValue: this._rest});
        container.resolveAll("listener");

    }

    public async start() {
        this._rest!.setToken(process.env.DISCORD_TOKEN!);
        /*const commands = container.resolveAll<BotCommandExecutor>("command").map(value => {
            winston.info(`Registering command ${value.getCommand().name}`);
            return value.getCommand().toJSON();
        })
        this._rest?.put(Routes.applicationGuildCommands(this.clientId!,this.guildId!), {body: commands}).then(() => {
            winston.info("Commands registered");
        }).catch(error => {
            winston.error(error);
        })*/
        await this._discordClient!.login(process.env.DISCORD_TOKEN!);
    }

    private async _onReady(): Promise<void> {
        winston.info(`Discord Bot ready - ${this._discordClient!.user!.tag}`);
    }

    get discordClient(): Client {
        return this._discordClient!;
    }


}
