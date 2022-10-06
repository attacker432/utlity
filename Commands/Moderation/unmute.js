const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const mutedMembers = new Keyv(process.env.mutedMembers);
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription(`Removes a user's muted status earlier.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to unmute.`)
      .setRequired(true)
    ),
  requiredPerms: ['KICK_MEMBERS'],
  botRequiredPerms: ['MODERATE_MEMBERS'],
  async execute(interaction) {
    const author = interaction.member.user.username;
    const member = interaction.options.getMember('user');
    if(member.communicationDisabledUntilTimestamp === 0){
     return interaction.reply('This user is not timed out!');
    } else {
  member.timeout(null); // remove the timeout
    await sendLog(interaction, `${member} has been unmuted earlier.`);
    if (!member.user.bot) member.send({ content: `${author} unmuted you earlier from ${interaction.guild.name}.`, ephemeral: true });
    }
  }
}