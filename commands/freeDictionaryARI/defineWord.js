const { EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const {request, fetch} = require('undici');



module.exports = {
        data: new SlashCommandBuilder()
        .setName('define')
        .setDescription('Using FreeDictionary API, fetch a definition of a requested word.')
        .addStringOption(option => 
            option.setName('term')
            .setDescription('the word to search for')
            .setRequired(true)), 
        async execute(interaction) {
            // console.log('interaction goes here: ', interaction)
            const trim = (str, max) => (str.length > max ? `${str.slice(0, max-3)}...` : str);
            const term = interaction.options.getString('term');
            // console.log('term: ', term)
            // const query = new URLSearchParams({ term });
    
            const dictResult = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
            // console.log('dict results', dictResult)
            const {status} = dictResult
            // console.log("status goes here: ", status)
            const list = await dictResult.json();
            // console.log(Object.keys(list).length)
            console.log('list: ', typeof list, list)
    
            if (status === 404) {
                return interaction.reply(`${list.title} for **${term}**. ${list.resolution}`)
            }
    
            const [answer] = list;
            console.log("here goes answer: ", typeof answer, answer)
            const embed = new EmbedBuilder()
                .setColor(0xEFFF00)
                .setTitle(answer.word)
                .setDescription(answer.phonetic)
                .setURL(answer.sourceUrls[0])
                .addFields(answer.meanings.map((meaning, index) => {
                    // console.log(meaning.definitions.length, meaning.definitions, 'definitions end')
                    const defList = [] 
                    meaning.definitions.map((definition) => { defList.push(definition.definition)})
                    console.log("def List goes here: ", defList.length)
                    const name = `${index+1}. ${meaning.partOfSpeech}.`
                    const additionalInfo = `[*There are ${defList.length} meanings, yet only part of them will be displayed.*]\n` 

                    if (defList.length > 10) {
                        return {
                            name: `${name}`,
                            value: `${additionalInfo} ${defList.slice(0, 5).join('\n \n')}`,
                        }
                    }
                    if (defList.length > 3) {return {
                        name: `${index+1}. ${meaning.partOfSpeech}`,
                        
                        value: `${additionalInfo} ${defList.slice(0, Math.floor(defList.length/2)).join('\n \n')}`,

                    }} else {
                        return {
                            name: `${index+1}. ${meaning.partOfSpeech}`,
                        
                            value: `${defList.join('\n \n')}`,
                        }
                    }
                }))

            console.log("embed: ", embed)
            await interaction.reply( {embeds: [embed]})
        },
}
