import { Client, ClientOptions } from "discord.js";
import { REST } from "@discordjs/rest";
import {Database} from "./api/database";
import {RoleToEmoji} from "./api/models/roleToEmoji";
import winston from "winston";

export class DiscordBot {
    private readonly _discordClient?: Client;
    private readonly _rest?: REST;
    private readonly _database: Database;

    constructor (options: ClientOptions, restOption: { version: string }) {
        winston.info("Initializing Discord Bot");
        winston.info("Connecting to database");
        this._database = new Database();
        winston.info("Connected to database");
        winston.info("Connecting to Discord");
        this._discordClient = new Client(options);
        this._rest = new REST(restOption);
        winston.info("Connected to Discord");
        this._discordClient.on("ready", this._onReady);
        winston.info("Discord Bot initialized");
    }

    public async start () {
        this._rest!.setToken(process.env.DISCORD_TOKEN!);
        await this._discordClient!.login(process.env.DISCORD_TOKEN!);
    }

    private _onReady () {
        winston.info("Discord Bot ready");
        const client = this._discordClient;
        setTimeout(() => {
            console.log(`Logged in as ${client?.user?.tag}!`);
            client?.user?.setActivity("with the database");
        }, 10000);
    }

}
