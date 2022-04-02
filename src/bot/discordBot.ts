import {Client, ClientOptions, TextChannel} from "discord.js";
import { REST } from "@discordjs/rest";
import {Database} from "./api/database";
import winston from "winston";
import {RoleToEmoji} from "./api/models/roleToEmoji";

export class DiscordBot {
    private readonly _discordClient?: Client;
    private readonly _rest?: REST;
    private readonly _database: Database;

    constructor (options: ClientOptions, restOption: { version: string }, databaseReady: () => void ){
        winston.info("Initializing Discord Bot");
        winston.info("Connecting to database");
        this._database = new Database(databaseReady);
        winston.info("Connected to database");
        winston.info("Connecting to Discord");
        this._discordClient = new Client(options);
        this._rest = new REST(restOption);
        winston.info("Connected to Discord");
        this._discordClient.on("ready", () => this._onReady()); // TODO: Check how i can improve this
        winston.info("Discord Bot initialized");
    }

    public async start () {
        this._rest!.setToken(process.env.DISCORD_TOKEN!);
        await this._discordClient!.login(process.env.DISCORD_TOKEN!);
    }

    private async _onReady (): Promise<void> {
        winston.info(`Discord Bot ready - ${this._discordClient!.user!.tag}`);
        this._discordClient?.user?.setActivity("Just watching how to learn programming a dc bot", {type: "WATCHING"});
        await this._checkAllRoleToEmoji();
    }

    private async _checkAllRoleToEmoji(): Promise<void> {
        const repo = this._database._dataSource.getRepository<RoleToEmoji>(RoleToEmoji);
        const count = await repo.count();
        winston.info(`Checking ${count} role to emoji`);
    }

}
