const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('age')
    .setDescription(`Sends an age prediction based of a name`)
    .addUserOption((option) => option
      .setName('name')
      .setDescription(`The name the bot will use.`)
      .setRequired(true)
    ),
  async execute(interaction) {
    let name = interaction.options.getString('name');
   // if(!member){member = interaction.user.tag}
    const response = await fetch(`https://api.agify.io/?name=${name}`)

    const data = await response.json();
    interaction.reply({ content: `> name: ${name}, ${data.age}, count: ${data.count}` });
  }
}