const Discord = require("discord.js")
const findr_fetcher = require("./data_fetcher")
const findr_handler = require("./data_handler")
const { create_player_embed, create_character_embed, create_select_character } = require("./data_formatter")

require("dotenv").config({ path: "../.env" })
const TOKEN = process.env.BOT_TOKEN

const client = new Discord.Client({
    intents: [
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMessages
    ]
})

client.once("ready", () => {
    console.log("wassup u sexy nerd")
})

client.on("interactionCreate", async interaction => {
    if (!(interaction.type === Discord.InteractionType.ApplicationCommand) &&
    !interaction.isSelectMenu()) return;

    const { commandName } = interaction

    if (commandName === "ping"){
        const t = await interaction.channel.send("Pong!")
        interaction.reply(`Bot delay is ${t.createdTimestamp - interaction.createdTimestamp}ms.`)
    }

    if (commandName === "find"){ 
        findr_fetcher.fetch_data(interaction.options.getString("uid")).then(r => {
            create_player_embed(r).then(r2 => {
                //console.log(r2)
                interaction.reply({
                    embeds: [r2],
                    //files: ["../resources/character_icons/Character_Tartaglia.png"]
                })
            })
        })
    }

    if (commandName === "test"){ 
        findr_fetcher.fetch_data(interaction.options.getString("test_var")).then(async r => {
            const embed = await create_character_embed(r, 0);
            const select = await create_select_character(r.avatarInfoList, interaction.options.getString("test_var"))
            /*for (let i = 0; i<r.avatarInfoList.length; i++){
                embed.push(await create_character_embed(r, i))
            }*/
            //console.log(select.components[0].options[0].data.label)
            interaction.reply({
                embeds: [embed],
                components: [select],
            })
        })
    }

    if (interaction.customId === 'char_sel'){
        c_uid_arr = (interaction.values[0]).split('-');
        findr_fetcher.fetch_data(c_uid_arr[1]).then(async r => {
            const embed = await create_character_embed(r, c_uid_arr[0]);
            //const select = await create_select_character(r.avatarInfoList, c_uid_arr[1])
            /*for (let i = 0; i<r.avatarInfoList.length; i++){
                embed.push(await create_character_embed(r, i))
            }*/
            //console.log(select.components[0].options[0].data.label)
            interaction.update({
                embeds: [embed],
                //components: [select],
            })
        })
    }
})

//700378769

//console.log(TOKEN)
client.login(TOKEN)