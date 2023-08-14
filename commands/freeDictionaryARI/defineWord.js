const { EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const {request} = require('undici');



module.exports = {
        data: new SlashCommandBuilder()
        .setName('define')
        .setDescription('Using FreeDictionary API, fetch a definition of a requested word.')
        .addStringOption(option => 
            option.setName('term').setRequired(true)), 
        async execute(interaction) {
            console.log('interaction goes here: ', interaction)
            const trim = (str, max) => (str.length > max ? `${str.slice(0, max-3)}...` : str);
            const term = interaction.options.getString('term');
            console.log('term: ', term)
            const query = new URLSearchParams({ term });
    
            const dictResult = await request(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
            // console.log('disc results', dictResult)
            const { list } = await dictResult.body.json();
            console.log('list: ', list)
    
            if (!list.length) {
                return interaction.editReply(`No results for **${term}**`)
            }
    
            const [answer] = list;
            const emded = new EmbedBuilder()
                .setColor(0xEFFF00)
                .setTitle(answer.word)
                .setURL(answer.permalink)
                .addFields(
                    { name: "Definision", value: trim(answer.definition, 1024)},
                    { name: 'Example', value: trim(answer.example, 1024)},
                );
                interaction.editReply( {embeds: [emded]})
        },
}

