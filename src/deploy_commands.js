const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config({ path: "../.env" })

const commands = [
	new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Pongs with information on lag.'),

	new SlashCommandBuilder()
	.setName('find')
	.setDescription('Gets player information from UID')
	.addStringOption(option => 
		option.setName('uid')
		.setDescription('User ID')
		.setRequired(true)
	),

	new SlashCommandBuilder()
	.setName('char')
	.setDescription('Gets player character information from UID')
	.addStringOption(option => 
		option.setName('uid')
		.setDescription('User ID')
		.setRequired(true)
	),

	new SlashCommandBuilder()
	.setName('test')
	.setDescription('Test function to do something. Literally could be anything. DEVELOPER ONLY.')
	.addStringOption(option => 
		option.setName('test_var')
		.setDescription('bruhhhh')
		.setRequired(true)
	)
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
	.then(() => console.log('Registered Commands'))
	.catch(console.error);