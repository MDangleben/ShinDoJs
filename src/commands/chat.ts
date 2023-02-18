import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
import { config } from 'dotenv';

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

config();

const PING_BUTTON_ID = 'PING_BUTTON_ID';
let timesButtonClicked = 0;

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const command = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Ask a question to ChatGPT')
    .addStringOption((option) =>
      option.setName('prompt').setDescription('Your question for chatGPT'),
    ),

  execute: async (interaction: CommandInteraction) => {
    const prompt = interaction.options.getString('prompt');

    await interaction.deferReply();

    const res = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.7,
      max_tokens: 300,
    });
    const [choice] = res.data.choices;

    await interaction.editReply(
      `Question: ${prompt} ${choice.text || 'Failed...'}`,
    );
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
