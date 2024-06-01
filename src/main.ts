import { Client, IntentsBitField } from 'discord.js';
import { CommandKit } from 'commandkit';
import path from 'path';
import * as express from 'express';

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.DirectMessages,
	],
});

new CommandKit({
	client,
	devGuildIds: ['955302869651845180'],
	devUserIds: ['658761055627116604'],
	devRoleIds: ['955303020365746216'],
	commandsPath: path.join(__dirname, 'commands'),
	eventsPath: path.join(__dirname, 'events'),
	validationsPath: path.join(__dirname, 'validations'),
});

const app = express();

app.listen(3000, () => {
	console.log('Server is running on port 3000');
	client.login(Bun.env.DISCORD_TOKEN as string);
});
