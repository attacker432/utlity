const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('numberfact')
    .setDescription(`Sends an age prediction based of a name`)
    .addNumberOption((option) => option
      .setName('number')
      .setDescription(`The number the bot will get a fact about.`)
      .setRequired(true)
    )
   .addStringOption((option) => option
      .setName('type')
      .setDescription(`Aviable types: **date**, **math** and **trivia**`)
      .setRequired(true)
    ),
  async execute(interaction) {
    let number = interaction.options.getString('name');
   // if(!member){member = interaction.user.tag}
    const response = await fetch(`http://numbersapi.com/#${number}`)

    const data = await response.json();
    interaction.reply({ content: `> name: **${name}**, age: **${data.age}**, count: **${data.count}**` });
  }
}