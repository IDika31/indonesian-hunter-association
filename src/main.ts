import { Client, IntentsBitField } from 'discord.js';
import { CommandKit } from 'commandkit';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.DirectMessages,
	],
});

const app = express();

app.listen(Bun.env.PORT, async () => {
	console.log(`Server is running on port ${Bun.env.PORT}`);
	mongoose
		.connect(Bun.env.DATABASE_URL as string)
		.then(() => console.log('Connected to MongoDB'));

	new CommandKit({
		client,
		commandsPath: path.join(__dirname, 'commands'),
		eventsPath: path.join(__dirname, 'events'),
		validationsPath: path.join(__dirname, 'validations'),
		skipBuiltInValidations: true,
		bulkRegister: true,
	});

	client.login(Bun.env.DISCORD_TOKEN as string);
});
