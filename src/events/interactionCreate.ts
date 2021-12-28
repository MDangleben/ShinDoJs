import { Interaction } from "discord.js";
import { PingCommand, BooruCommand } from "../commands";

/**
 * Handles interactions for all commands
 */
const commandInteractionHandler = async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (command) {
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  }
};

/**
 * Handles interactions for all buttons
 */
const buttonInteractionHandler = async (interaction: Interaction) => {
  if (interaction.isButton()) {
    PingCommand.buttonHandler(interaction);
    BooruCommand.buttonHandler(interaction);
  }
};

export const event = {
  name: "interactionCreate",
  execute(interaction: Interaction) {
    commandInteractionHandler(interaction);
    buttonInteractionHandler(interaction);
  },
};
