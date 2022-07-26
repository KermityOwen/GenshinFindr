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
        findr_fetcher.fetch_data(interaction.options.getString("uid"), async function(err, r){
            if(err){
                interaction.reply({
                    embeds: [{Title: "This UID is invalid. Please try again."}]
                })
            } else {
                create_player_embed(r).then(r2 => {
                interaction.reply({
                    embeds: [r2],
                })
                })
            }
        })
    }

    if (commandName === "char"){ 
        findr_fetcher.fetch_data(interaction.options.getString("uid"), async function(err, r){
            let error_thrown = false;
            if (err){
                interaction.reply({
                    embeds: [{Title: "This UID is invalid. Please try again."}]
                })
            } else {
                const embed = await create_character_embed(r, 0, async function(err){
                    if (err){
                        interaction.reply({
                            embeds: [{Title: "There are no characters on display for this user"}]
                        })
                        error_thrown = true;
                    }
                });
                const select = await create_select_character(r.avatarInfoList, interaction.options.getString("uid"), async function(err){
                    if (err){
                        console.log("Error creating select menu")
                    }
                });
                if (!error_thrown){
                    interaction.reply({
                        embeds: [embed],
                        components: [select],
                    })
                }
            }
        })
    }

    if (interaction.customId === 'char_sel'){
        c_uid_arr = (interaction.values[0]).split('-');
        findr_fetcher.fetch_data(c_uid_arr[1]).then(async r => {
            const embed = await create_character_embed(r, c_uid_arr[0]);
            interaction.update({
                embeds: [embed],

            })
        })
    }
})

//700378769

//console.log(TOKEN)
client.login(TOKEN)