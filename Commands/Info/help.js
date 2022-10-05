const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { helpEmojis, urls } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription(`Displays a list of all available commands along with their usage.`),
  async execute(interaction) {
    const { staffEmojiId, infoEmojiId, loggingEmojiId, welcomeEmojiId, funEmojiId, debugEmojiId } = helpEmojis;
    const { botInviteLink, discordInviteLink, topgg, website, github } = urls;
    let color = getRoleColor(interaction.guild);
    let debugCmds = '';
    let funCmds = '';
    let infoCmds = '';
    let roleCmds = '';
    let staffCmds = '';
    let welcomeCmds = '';
    fs.readdirSync('./Commands/Debug').forEach((file) => {
      debugCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Fun').forEach((file) => {
      funCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Info').forEach((file) => {
      infoCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Roles').forEach((file) => {
      roleCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Moderation').forEach((file) => {
      staffCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Welcome').forEach((file) => {
      welcomeCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
   console.log(interaction.client.emojis.cache)
    const helpEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle('Commands')
      .addFields(
        {
          name: `**Staff Commands**`,
          value: `${'```' + staffCmds + '```'}`, inline: true
        },
        {
          name: `**Info Commands**`,
          value: `${'```' + infoCmds + '```'}`, inline: true
        },
        {
          name: `**Role Commands**`,
          value: `${'```' + roleCmds + '```'}`, inline: true
        },
        {
          name: `**Welcome Comamnds**`,
          value: `${'```' + welcomeCmds + '```'}`, inline: true
        },
        {
          name: `**Fun Commands**`,
          value: `${'```' + funCmds + '```'}`, inline: true
        },
        {
          name: `**Debug Commands**`,
          value: `${'```' + debugCmds + '```'}`, inline: true
        }
      )
      .setTimestamp();
    const links = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Add me')
        .setURL(botInviteLink)
        .setStyle('Link'),
      new ButtonBuilder()
        .setLabel('Support')
        .setURL(discordInviteLink)
        .setStyle('Link'),
      new ButtonBuilder()
        .setLabel('Vote!')
        .setURL(topgg)
        .setStyle('Link'),
     /* new ButtonBuilder()
        .setLabel('Website')
        .setURL(website)
        .setStyle('Link'), */ // Website is not here yet
      new ButtonBuilder()
        .setLabel('Code')
        .setURL(github)
        .setStyle('Link')
    );
    interaction.reply({ embeds: [helpEmbed], components: [links] });
  }
}