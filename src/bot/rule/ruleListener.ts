import {inject, injectable} from "tsyringe";
import {
    Client,
    MessageEmbed,
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    TextChannel,
    User
} from "discord.js";
import * as fs from "fs";
import winston from "winston";
import {Rule} from "../../entity/rule";
import * as crypto from "crypto";
import {AppDataSource} from "../../data-source";
import {Embed} from "../../entity/embed";

@injectable()
export class RuleListener {
    private readonly rulesPath = "./config/rules/";
    private readonly rules: Rule[] = [];

    constructor(@inject("discordClient")
                private readonly client: Client) {

        fs.readdirSync(this.rulesPath).forEach(value => {
                const content = fs.readFileSync(`${this.rulesPath}${value}`, "utf8");
                const rule: Rule = Object.assign({}, JSON.parse(content));
                if (rule) {
                    rule.path = `${this.rulesPath}${value}`;
                    rule.hash = crypto.createHash('sha256').update(content).digest('hex');
                    this.rules.push(rule);
                }

            }
        );
        client.on("ready", () => this.onStart());
        client.on("messageReactionAdd", (message, user) => this.onReact(message, user));
    }

    private async onStart(): Promise<void> {
        winston.info("RuleListener started");

        for (const rule of this.rules) {
            const dbRule: Rule | null = await AppDataSource.manager.findOne<Rule>(Rule, {where: {path: rule.path}});
            if (dbRule) {
                if (dbRule.hash !== rule.hash) {

                    await AppDataSource.manager.transaction(async transactionalEntityManager => {
                        await transactionalEntityManager.save({
                            id: dbRule.id,
                            path: rule.path,
                            hash: rule.hash,
                            content: rule.content
                        });
                        winston.info(`Rule ${rule.path} has been updated`);
                        for (let i = 0; i < rule.content!.length; i++) {
                            const embed = rule.content![i] as Embed;
                            const channel = this.client.channels.cache.get(rule.channel!);
                            if (channel != null && channel.isText()) {
                                const textChannel = channel as TextChannel;
                                const message = await textChannel.messages.cache.get(embed.discordId!);
                                if (message) {
                                    await message.edit({embeds: [this.toEmbed(embed, message.embeds[0])]})
                                    if (i == (rule.content!.length - 1)) {
                                        for (let roleToEmoji of rule.accept!) {
                                            await message.react(roleToEmoji.emoji!);
                                            winston.info(`Reacted with ${roleToEmoji.emoji} to ${message.id}`);
                                        }
                                    }
                                }

                            }
                        }
                    });
                } else {
                    winston.info(`Rule ${rule.path} is up to date`);
                }
            } else {
                winston.info(`Rule ${rule.path} has been added`);
                await AppDataSource.manager.transaction(async transactionalEntityManager => {
                    const dbRule = await transactionalEntityManager.save(Rule, rule);
                    for (let i = 0; i < dbRule.content!.length; i++) {
                        const embed = dbRule.content![i] as Embed;
                        const channel = this.client.channels.cache.get(dbRule.channel!);
                        if (channel != null && channel.isText()) {
                            const textChannel = channel as TextChannel;
                            const message = await textChannel.send({embeds: [this.toEmbed(embed)]});
                            embed.discordId = message.id;
                            await transactionalEntityManager.save(Embed, embed);
                            if (i == (rule.content!.length - 1)) {
                                for (let roleToEmoji of rule.accept!) {
                                    await message.react(roleToEmoji.emoji!);
                                    winston.info(`Reacted with ${roleToEmoji.emoji} to ${message.id}`);
                                }
                            }
                        }
                    }

                });
            }
        }
    }

    private async onReact(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser): Promise<void> {
        winston.info(`Reacted with ${reaction.emoji.name} to ${reaction.message.id}`);
    }

    private toEmbed(embed: Embed, x?: MessageEmbed): MessageEmbed {
        return new MessageEmbed(x)
            .setColor(embed.color!)
            .setAuthor(embed.author?.toAuthorData() ?? null)
            .setTitle(embed.title)
            .setDescription(embed.message)
            .setFooter(embed.footer?.toEmbed() ?? null);
    }
}
