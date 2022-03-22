import {Client, ClientOptions, Intents} from "discord.js";
import {REST} from "@discordjs/rest";
import {RulesManager} from "./rules/rules_manager";


export class DiscordBot {
    private readonly _discordClient?: Client;
    private readonly _rest?: REST;
    private rulesManager: RulesManager;

    constructor(options: ClientOptions, restOption: { version: string }) {
        this._discordClient = new Client(options);
        this._rest = new REST(restOption);
        this._discordClient.on('ready', () => {
            console.log(`Logged in as ${this._discordClient!.user!.tag}!`)
        });
        this.rulesManager = new RulesManager(this.client!);
    }

    public async start() {
        this._rest!.setToken(process.env.DISCORD_TOKEN!);
        this.rulesManager.start();
        await this._discordClient!.login(process.env.DISCORD_TOKEN!);
    }

    get rest() {
        return this._rest;
    }

    get client() {
        return this._discordClient;
    }

}
