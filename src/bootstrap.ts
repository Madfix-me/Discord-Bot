import "dotenv/config";
import { DiscordBot } from "./bot/discordBot";
import { Intents } from "discord.js";

async function main () {
    const bot = new DiscordBot({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] }, { version: "9" });
    await bot.start();
}

main()
    .then()
    .catch(onerror => {
        console.error(onerror);
    });
