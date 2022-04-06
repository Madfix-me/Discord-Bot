import {inject, injectable} from "tsyringe";
import {
    Client, GuildEmoji,
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
        client.on("messageReactionAdd", async (message, user) => await this.onReactAdd(message, user));
        client.on("messageReactionRemove", async (message, user) => await this.onReactRemove(message, user));
        client.on("ready", () => this.onStart());
    }

    private async onStart(): Promise<void> {
        winston.info("RuleListener started");

        for (const rule of this.rules) {
            const dbRule: Rule | null = await AppDataSource.manager.findOne<Rule>(Rule, {where: {path: rule.path}, relations: ["content"]});
            if (dbRule) {
                if (dbRule.hash !== rule.hash) {

                    await AppDataSource.manager.transaction(async transactionalEntityManager => {
                        const embeds = dbRule.content!;
                        const channel = this.client.channels.cache.get(rule.channel!);
                        if (channel != null && channel.isText()) {
                            const textChannel = channel as TextChannel;
                            for (const embed of embeds) {
                                const message = textChannel.messages.cache.get(embed.discordId!);
                                if (message) {
                                    const reactions = message.reactions.cache.values();
                                    for (let reaction of reactions) {
                                        for (let user of reaction.users.cache.values()) {

                                        }
                                    }
                                }
                                await textChannel.messages.delete(embed.discordId!);
                                await transactionalEntityManager.remove(Embed,embed);
                            }
                            await transactionalEntityManager.save(Rule,{
                                id: dbRule.id,
                                path: rule.path,
                                hash: rule.hash,
                                content: rule.content
                            });
                            for (let i = 0; i < rule.content!.length; i++) {
                                const embed = rule.content![i] as Embed;
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
                        winston.info(`Rule ${rule.path} has been updated`);
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


    private async onReactAdd(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser): Promise<void> {
        if (!reaction.me) {
            const channelId = reaction.message.channel.id;
            await AppDataSource.manager.transaction(async transactionalEntityManager => {
                const dbRule = await transactionalEntityManager.findOne(Rule, {where: {channel: channelId}, relations: ["accept"]});
                if (dbRule) {
                    const embed = await transactionalEntityManager.findOne(Embed, {where: {discordId: reaction.message.id}});
                    if (embed) {
                        const roleToEmoji = dbRule.accept!.find(roleToEmoji => roleToEmoji.emoji === reaction.emoji.name);
                        if (roleToEmoji) {
                            const role = reaction.message.guild?.roles.cache.get(roleToEmoji.role!);
                            if (role) {
                                const member = await reaction.message.guild?.members.fetch(user.id);
                                if (member) {
                                    await member.roles.add(role);
                                    winston.debug(`Added role ${role.name} to ${member.user.tag}`);
                                }
                            }

                        }
                    }
                }
            });
        }


    }

    private async onReactRemove(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser): Promise<void> {
        if (!reaction.me) {
            const channelId = reaction.message.channel.id;
            await AppDataSource.manager.transaction(async transactionalEntityManager => {
                const dbRule = await transactionalEntityManager.findOne(Rule, {where: {channel: channelId}, relations: ["accept"]});
                if (dbRule) {
                    const embed = await transactionalEntityManager.findOne(Embed, {where: {discordId: reaction.message.id}});
                    if (embed) {
                        const roleToEmoji = dbRule.accept!.find(roleToEmoji => roleToEmoji.emoji === reaction.emoji.name);
                        if (roleToEmoji) {
                            const role = reaction.message.guild?.roles.cache.get(roleToEmoji.role!);
                            if (role) {
                                const member = await reaction.message.guild?.members.fetch(user.id);
                                if (member) {
                                    await member.roles.remove(role);
                                    winston.debug(`Remove role ${role.name} to ${member.user.tag}`);
                                }
                            }

                        }
                    }
                }
            });
        }
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
