const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deepfry')
    .setDescription(`Add deepfry effect to your profile picture or someone else's.`)
    .addUserOption((user) => user
      .setName('user')
      .setDescription('The user you want to add deepfry effect to.')
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getUser('user') || interaction.user;
    const url = user.displayAvatarURL({ format: 'png' });
    console.log(url)
    const response = await fetch('https://v1.api.amethyste.moe/generate/deepfry', {
      method: 'POST',
      headers: { 'Authorization': process.env.amethyste },
      body: new URLSearchParams({ url })
    }).catch(error=>{console.log(`Error found in deepfry.js: ${error}`)});
    const bufferArray = await response.arrayBuffer();
    const buffer = Buffer.from(bufferArray);
    const image = new AttachmentBuilder(buffer);
    interaction.editReply({ files: [image] });
  }
}