const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription(`Embeds a message for you.`)
    .addStringOption((option) => option
      .setName('message')
      .setDescription('The content you want to embed.')
      .setRequired(true)
    ),
  async execute(interaction) {
  

      let color = getRoleColor(interaction.guild);
    const Embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`Embedded message from ${interaction.user.username}`)
      .setDescription(interaction.options.getString('message'))
       .setFooter(  {
    text: `Command requested by ${interaction.user.username}.`,
    iconURL: interaction.user.displayAvatarURL(),
  })
    .setTimestamp();
    interaction.reply({ embeds: [Embed] });
  }
}