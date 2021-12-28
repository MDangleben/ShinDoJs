import {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { getBooruImages } from "../utils/booru";

const { SlashCommandBuilder } = require("@discordjs/builders");

enum Button {
  DELETE = "hen_DELETE",
}

const row = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId(Button.DELETE)
    .setLabel("Delete")
    .setStyle("DANGER")
);

export const command = {
  data: new SlashCommandBuilder()
    .setName("hen")
    .setDescription("Posts random images from gelbooru")
    .addStringOption((option) =>
      option.setName("tags").setDescription("Tags used to search images")
    ),

  execute: async (interaction: CommandInteraction) => {
    console.log({ interaction });
    await interaction.deferReply();
    const imageUrls = await getBooruImages({ limit: 1 });
    await interaction.editReply({
      content: `...`,
      files: imageUrls,
      components: [row],
    });
  },

  // Button handler exported to handle button event (see events/interactionCreate)
  buttonHandler: (interaction: ButtonInteraction) => {
    if (interaction.customId === Button.DELETE) {
      console.log({ interaction });
      interaction.reply({ content: `Succesfully deleted`, ephemeral: true });
    }
  },
};
