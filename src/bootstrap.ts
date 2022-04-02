import "dotenv/config";
import {DiscordBot} from "./bot/discordBot";
import {Intents} from "discord.js";
import winston from "winston";

export let bot: DiscordBot;

async function start() {
    await bot.start();
}

async function main() {
    winston.add(new winston.transports.Console(
        {
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
            handleExceptions: true,
        }
    ));
    winston.add(new winston.transports.File({filename: "logs/error.log", level: "error"}));
    winston.add(new winston.transports.File({
        filename: "logs/combined.log",
        handleExceptions: true,
        maxFiles: 5,
        maxsize: 5242880, // 5MB
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        zippedArchive: true,
    }));
    bot = new DiscordBot({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]}, {version: "9"}, () => {
        start().then(() => {
            winston.info("Bot started");
        }).catch((err) => {
            winston.error(err);
        });
    });
}

main()
    .then()
    .catch(onerror => {
        console.error(onerror);
    });
