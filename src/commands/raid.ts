// import type { SlashCommandProps } from 'commandkit';
// import { SlashCommandBuilder } from 'discord.js';

// export const data = new SlashCommandBuilder()
// 	.setName('raid')
// 	.setDescription('Raid mission is coming!')
// 	.addSubcommand((subcommand) =>
// 		subcommand
// 			.setName('create')
// 			.setDescription('Create raid mission!')
// 			.addStringOption((option) =>
// 				option
// 					.setName('mission')
// 					.setDescription('Mission name')
// 					.setRequired(true)
// 			)
// 			.addStringOption((option) =>
// 				option
// 					.setName('rank')
// 					.setDescription('Mission rank')
// 					.setRequired(true)
// 			)
// 			.addIntegerOption((option) =>
// 				option
// 					.setName('honor_point')
// 					.setDescription('Mission level')
// 					.setRequired(true)
// 			)
// 			.addChannelOption((option) =>
// 				option
// 					.setName('channel_announce')
// 					.setDescription('Channel to announce the raid')
// 					.setRequired(true)
// 			)
// 			.addChannelOption((option) =>
// 				option
// 					.setName('channel_portal')
// 					.setDescription('Portal channel for the raid')
// 					.setRequired(true)
// 			)
// 	);

// export async function run({ interaction, client }: SlashCommandProps) {
// 	await interaction.deferReply();

// 	const reply = await interaction.fetchReply();

// 	const ping = reply.createdTimestamp - interaction.createdTimestamp;

// 	await interaction.editReply(
// 		`Pong! Client ${ping}ms | Websocket ${client.ws.ping}ms`
// 	);
// }

// export const options = {};
