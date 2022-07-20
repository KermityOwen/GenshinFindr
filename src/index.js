const Discord = require("discord.js")
const findr_fetcher = require("./data_fetcher")

require("dotenv").config({ path: "../.env" })
const TOKEN = process.env.BOT_TOKEN

const client = new Discord.Client({
    intents: [
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMessages
    ]
})

client.once("ready", () => {
    console.log("Bot up!")
})

client.on("interactionCreate", async interaction => {
    if (!(interaction.type === Discord.InteractionType.ApplicationCommand)) return;

    const { commandName } = interaction

    if (commandName === "ping"){
        const t = await interaction.channel.send("Pong!")
        interaction.reply(`Bot delay is ${t.createdTimestamp - interaction.createdTimestamp}ms.`)
    }

    if (commandName === "test"){ 
        findr_fetcher.fetch_data(interaction.options.getString("testthing")).then(r => {
            findr_fetcher.fetch_base_info(r, "nickname").then(r2 => {
                interaction.reply(r2)
            })
        })
    }

})

console.log(TOKEN)
client.login(TOKEN)