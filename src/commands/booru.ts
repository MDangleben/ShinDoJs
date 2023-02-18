import {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { getBooruImages } from "../utils/booru";

const { SlashCommandBuilder } = require("@discordjs/builders");

const formatImageEmbed = (url: string) =>
  new MessageEmbed().setColor("#ffd1dc").setImage(url);

enum Button {
  DELETE = "booru_DELETE",
}

const row = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId(Button.DELETE)
    .setLabel("Delete")
    .setStyle("DANGER")
);

export const command = {
  data: new SlashCommandBuilder()
    .setName("booru")
    .setDescription("Posts random images from gelbooru")
    .addStringOption((option) =>
      option.setName("tags").setDescription("Tags used to search images")
    ),

  execute: async (interaction: CommandInteraction) => {
    const tags = interaction.options.getString("tags")?.split(" ");

    await interaction.deferReply();

    const imageUrls = await getBooruImages({ tags, limit: 3 });
    
    if (!imageUrls.length) {
    }

    await interaction.editReply({
      embeds: imageUrls.map((url) => formatImageEmbed(url)),
      components: [row],
    });
  },

  // Button handler exported to handle button event (see events/interactionCreate)
  buttonHandler: async (interaction: ButtonInteraction) => {
    if (interaction.customId === Button.DELETE) {
      // @ts-ignore TODO: Narrow type
      await interaction.message.delete();
      interaction.reply({ content: `Succesfully deleted`, ephemeral: true });
    }
  },
};
