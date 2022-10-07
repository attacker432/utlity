const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription(`Embeds a message for you.`)
    .addStringOption((option) => option
      .setName('message')
      .setDescription('The content you want to embed.')
      .setRequired(true)
    )
  .addStringOption((option) => option
      .setName('color')
      .setDescription('The color of the embed.')
      .setRequired(true)
    ),
  async execute(interaction) {
  

    let color = interaction.options.color;
    const nasaSearchEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle()
      .setDescription(data.collection.items[0].data[0].description)
      .setImage(data.collection.items[0].links[0].href.split(` `).join('%20'))
      .setTimestamp();
    interaction.reply({ embeds: [nasaSearchEmbed] });
  }
}