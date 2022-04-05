import {
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder
} from "@discordjs/builders";
import {Client, CommandInteraction, Interaction} from "discord.js";
import {REST} from "@discordjs/rest";

export abstract class BotCommandExecutor {
    protected constructor(private readonly client?: Client, private readonly rest?: REST) {
        this.registerCommand();
    }
    abstract getCommand(): SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
    abstract onExecute(interaction: CommandInteraction): Promise<void>;
    protected registerCommand(): void {
        this.client?.on("interactionCreate", async (interaction: Interaction) => {
            if (interaction.isCommand() && this.checkCommand(interaction)) {
                await this.onExecute(interaction as CommandInteraction);
            }
        });
    }

    protected checkCommand(interaction: CommandInteraction): boolean {
        return interaction.commandName === this.getCommand().name;
    }
}
