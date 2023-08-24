const { EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const {fetch} = require('undici');
const {marriamThesaurusAPI} = require("../../config.json");


// /discordBotNodejs/config.json
// /discordBotNodejs/commands/DictionaryAPI/thesaurusAPI.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName("synonyms")
        .setDescription("Fetch synonyms")
        .addStringOption(option => option
            .setName("term")
            .setDescription("A word for an API request")
            .setRequired(true)),
    
            async execute(interaction) {
                const term = interaction.options.getString("term")
                // console.log("the term: ", term)

                const dictResults = await fetch(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${term}?key=${marriamThesaurusAPI}`)
                // console.log(dictResults)

                const {status} = dictResults
                if (status === 404) {
                    return interaction.reply("Couldn't find the word")
                }
                const list = await dictResults.json()
                // const {answer} = list
                // console.log("list: ", list)
                const answers = {}
                list.map((entry) => {

                    if (entry.meta.id === term) {
                        // console.log("id===term", entry)
                        const key = entry.fl
                        const slicedSynonyms = entry.meta.syns.map((arr) => {
                            // console.log("arr ", arr)
                            if (arr.length > 5){return arr.slice(0, 4)}
                            return arr
                        })
                        answers[key] = slicedSynonyms.flat()

                    }
                })
                // console.log("answers: ", answers)

                const keys = Object.keys(answers)
                // console.log("keys: ", keys)

                const embed = new EmbedBuilder()
                .setColor(0xEFFF00)
                .setTitle(term)
                .setDescription("\n")
                .addFields(keys.map((key) => {
                    return {
                        name: `${key}`,
                        value: `${answers[key].join(', ')}`
                    }
                }))

                // console.log("embed: ", embed)
                await interaction.reply({embeds: [embed]})
            }



}