import "dotenv/config";
import {DiscordBot} from "./bot/discordBot";
import {Intents} from "discord.js";
import winston from "winston";
export async function main() {
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
    const bot = new DiscordBot({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]}, {version: "9"});
    await bot.start();
}


