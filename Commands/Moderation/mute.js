const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const mts = new Keyv(process.env.mts);
const mutedMembers = new Keyv(process.env.mutedMembers);
const punishments = new Keyv(process.env.punishments);
const { pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription(`Restricts a user from sending messages.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to mute.`)
      .setRequired(true)
    )
    .addNumberOption((option) => option
      .setName('minutes')
      .setDescription(`The amount of minutes that you want the user to stay muted.`)
      .setRequired(true)
    )
    .addStringOption((option) => option
      .setName('reason')
      .setDescription(`The reason you're muting this user for.`)
    ),
  requiredPerms: ['KICK_MEMBERS'],
  botRequiredPerms: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
  async execute(interaction) {
    var member = interaction.options.getMember('user');
    var user = interaction.options.getUser('user');
    var mins = interaction.options.getNumber('minutes');
    var reason = interaction.options.getString('reason');
    var author = interaction.member.user.username;
   // let mutedRole = interaction.guild.roles.cache.find((r) => r.name === 'Muted Member');
    if (mins > 720 || mins <= 0) {
      return interaction.reply({ content: `Minutes must be a positive number lower than 720.`, ephemeral: true });
    }

    if (member.id == interaction.member.user.id) {
      return interaction.reply({ content: `You can't mute youself, smarty pants!`, ephemeral: true });
    }

    if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
      return interaction.reply({ content: `Your roles must be higher than the roles of the person you want to mute!`, ephemeral: true });
    }

    let mutes = await mts.get(`mutes_${member.id}_${interaction.guild.id}`);
    if (!mutes) mutes = 1;
    else mutes = mutes + 1;

   /* if (member.roles.cache.has(mutedRole.id)) {
      return interaction.reply({ content: `${user.username} is already muted!`, ephemeral: true });
    } */

    await mts.set(`mutes_${member.id}_${interaction.guild.id}`, mutes);
    let color = getRoleColor(interaction.guild);
    const muteEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`> **__Mute Information__**`)
      .addFields(
        { name: `Defendant's name:`, value: `${member.user.tag}` },
        { name: `Issued by:`, value: `${author}` },
        { name: `Duration:`, value: `${mins} minutes` },
         { name: `Reason:`, value: `${reason}` },
      )
     // .setFooter(`You can use /unmute to unmute the user earlier than ${mins} minutes and /muteinfo to view information about his mute.`)
      .setTimestamp();
    if(!reason){reason = 'No reason given'}
    const millisecondsPerMinute = 60 * 1000;
    let MuteInfo = {};
    let time = 0;
    time = mins * 1000 * 60;
    MuteInfo.userID = member.id;
    MuteInfo.unmuteDate = Date.now() + mins * millisecondsPerMinute;
    MuteInfo.author = author;
    let msg = `You have received a timeout from **${author}** in **${interaction.guild.name}**. Duration: ${mins} minutes. Reason: ${reason}`;
    if(!reason){reason = 'No reason given'}

    if (!member.user.bot) member.send({ content: msg });
    member.timeout(time, reason);
   /* let mutedMembersArr = await mutedMembers.get(interaction.guild.id);
    let guilds = await punishments.get('guilds');
    if (!mutedMembersArr) mutedMembersArr = [];
    if (!guilds.includes(interaction.guild.id)) guilds.push(interaction.guild.id);
    mutedMembersArr.push(MuteInfo);
    await mutedMembers.set(interaction.guild.id, mutedMembersArr); */
    interaction.reply({embeds: [muteEmbed]})
    
  }
}
