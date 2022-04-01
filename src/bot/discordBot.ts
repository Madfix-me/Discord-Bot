import { Client, ClientOptions } from "discord.js";
import { REST } from "@discordjs/rest";

export class DiscordBot {
    private readonly _discordClient?: Client;
    private readonly _rest?: REST;

    constructor (options: ClientOptions, restOption: { version: string }) {
        this._discordClient = new Client(options);
        this._rest = new REST(restOption);
        this._discordClient.on("ready", () => {
            console.log(`Logged in as ${this._discordClient!.user!.tag}!`);
        });
    }

    public async start () {
        this._rest!.setToken(process.env.DISCORD_TOKEN!);
        await this._discordClient!.login(process.env.DISCORD_TOKEN!);
    }

    get rest () {
        return this._rest;
    }

    get client () {
        return this._discordClient;
    }
}
