const Discord = require("discord.js")

require("dotenv").config()
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
})

client.login(TOKEN)