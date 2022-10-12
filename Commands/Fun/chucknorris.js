const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chucknorris')
    .setDescription(`Sends an age prediction based of a name`),
  async execute(interaction) {
  //  let number = interaction.options.getNumber('number');
   // if(!member){member = interaction.user.tag}
    const response = await fetch(`https://api.chucknorris.io/jokes/random`)
//console.log(response)
    const data = await response.json();
    
    interaction.reply({ content: `joke: **${data.value}** \n > created at on: **${data.created_at}**`  });
  }
}