const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dadjoke')
    .setDescription(`Sends a joke made by a dad.`),
  async execute(interaction) {
  //  let number = interaction.options.getNumber('number');
   // if(!member){member = interaction.user.tag}
    const response = await fetch(`https://icanhazdadjoke.com`)
//console.log(response)
    const data = await response.json();
    console.log(data)
    interaction.reply({ content: `Coming soon :eyes:`  });
  }
}