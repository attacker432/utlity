const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('takerole')
    .setDescription(`remove a role from a user.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to remove a role from.`)
      .setRequired(true)
    )
    .addRoleOption((option) => option
      .setName('role')
      .setDescription(`The role that you want to remove.`)
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_ROLES'],
  botRequiredPerms: ['MANAGE_ROLES'],
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');
    if (!member.roles.cache.has(role.id)) {
      return interaction.reply({ content: `${member.user.username} does not have the ${role} role.`, ephemeral: true })
    }

    if (interaction.guild.roles.highest.comparePositionTo(role) <= 0) {
      return interaction.reply({ content: `My roles must be higher than the role that you want to remove!`, ephemeral: true });
    }
    
    if (interaction.member.roles.highest.comparePositionTo(role) <= 0) {
      return interaction.reply({ content: `Your roles must be higher than the role that you want to remove!`, ephemeral: true });
    }

    member.roles.remove(role);
    let perms = role.permissions.toArray().map((perm) => perm).join(`\n`);
    perms = '```' + perms + '```';
    let color = getRoleColor(interaction.guild);
    const giveRoleEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`**__Taken Role__**`)
      .addFields(
        { name: 'From', value: `${member}` },
        { name: 'By', value: `${interaction.member.user.username}` },
        { name: 'Role', value: `${role.name}` },
        { name: 'Permissions', value: `${perms}` }
        )
    .setFooter(  {
    text: `Command Requested by: ${interaction.user.tag} || You can now use **/giverole** to give ${role} to ${member.user.username}.`,
    iconURL: interaction.user.displayAvatarURL(),
  })
      .setTimestamp();
    //await sendLog(interaction, giveRoleEmbed);
   await console.log(interaction)
    interaction.reply(`> Successfully took role: ${role} from **${member.user.username}** || command requested by: **${interaction.user.tag}**`)
  }
}