const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const kks = new Keyv(process.env.kks);
const { pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription(`Kicks a user out of the server.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to kick.`)
      .setRequired(true)
    )
    .addStringOption((option) => option
      .setName('reason')
      .setDescription(`The reason you're kicking this user for.`)
    ),
  requiredPerms: ['KICK_MEMBERS'],
  botRequiredPerms: ['KICK_MEMBERS'],
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    let reason = interaction.options.getString('reason');
    if (member.id == interaction.member.user.id) {
      return interaction.reply({ content: `I mean you could just leave the server.`, ephemeral: true });
    }

    if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
      interaction.reply({ content: `Your roles must be higher than the roles of the person you want to kick!`, ephemeral: true });
    }

    if (!member.kickable) {
      interaction.reply({ content: `Make sure that my role is higher than the role of the person you want to kick!`, ephemeral: true });
    }
    
    const author = interaction.member.user.username;
    let kicks = await kks.get(`kicks_${member.id}_${interaction.guild.id}`)
    if (!kicks) kicks = 1;
    else kicks++;

    let color = getRoleColor(interaction.guild);
    if(!reason){reason = 'No reason given :('}
    const kickEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`> **__Kick Information__**`)
      .addFields(
        { name: `Defendant's name:`, value: `> ${member.user.tag}` },
        { name: `Issued by:`, value: `> ${author}` },
        { name: `Reason:`, value: `> ${reason}` }
      )
      .setTimestamp();
    let msg = `**${author}** kicked you from **${interaction.guild.name}**. Reason: ${reason}`;
    
    if (!member.user.bot) await member.send({ content: msg });
    //await sendLog(interaction, kickEmbed);
    interaction.reply({embeds: [kickEmbed]})
    await kks.set(`kicks_${member.id}_${interaction.guild.id}`, kicks);
    member.kick();
  }
}