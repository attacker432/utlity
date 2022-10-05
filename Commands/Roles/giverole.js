const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giverole')
    .setDescription(`Adds a role to a user.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to give a role to.`)
      .setRequired(true)
    )
    .addRoleOption((option) => option
      .setName('role')
      .setDescription(`The role that you want to give.`)
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_ROLES'],
  botRequiredPerms: ['MANAGE_ROLES'],
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');
    if (member.roles.cache.has(role.id)) {
      return interaction.reply({ content: `${member.user.username} already has that role.`, ephemeral: true })
    }

    if (interaction.guild.roles.highest.comparePositionTo(role) <= 0) {
      return interaction.reply({ content: `My roles must be higher than the role that you want to give!`, ephemeral: true });
    }
    
    if (interaction.member.roles.highest.comparePositionTo(role) <= 0) {
      return interaction.reply({ content: `Your roles must be higher than the role that you want to give!`, ephemeral: true });
    }

    member.roles.add(role);
    let perms = role.permissions.toArray().map((perm) => perm).join(`\n`);
    perms = '```' + perms + '```';
    let color = getRoleColor(interaction.guild);
    const giveRoleEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`**__Given Role__**`)
      .addFields(
        { name: 'To', value: `${member}` },
        { name: 'By', value: `${interaction.member.user.username}` },
        { name: 'Role', value: `${role.name}` },
        { name: 'Permissions', value: `${perms}` }
        )
    .setFooter(  {
    text: `Command Requested by: ${interaction.user.tag} || You can now use **/takerole** to remove ${role} from ${member.username}.`,
    iconURL: interaction.user.displayAvatarURL(),
  })
      .setTimestamp();
    //await sendLog(interaction, giveRoleEmbed);
    interaction.reply(`Successfully gave role: ${role} to ${member.username} || **command requested by:** ${interaction.author}`)
  }
}