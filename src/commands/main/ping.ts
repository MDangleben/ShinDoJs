import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonInteraction, ButtonStyle, CommandInteraction } from 'discord.js';

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

const PING_BUTTON_ID = 'PING_BUTTON_ID';
let timesButtonClicked = 0;

// Create action row and populate it with button component
const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId(PING_BUTTON_ID)
    .setLabel('Test Button')
    .setStyle(ButtonStyle.Primary),
);

export const command = {
  // Slash command information
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Sample command'),

  // Code that runs on slash command trigger
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply({
      content: `Times button has been clicked: ${timesButtonClicked}`,
      components: [row],
    });
  },

  // Button handler exported to handle button event (see events/interactionCreate)
  buttonHandler: (interaction: ButtonInteraction) => {
    if (interaction.customId === PING_BUTTON_ID) {
      timesButtonClicked += 1;
      interaction.update({
        content: `Times button has been clicked: ${timesButtonClicked}`,
      });
    }
  },
};
