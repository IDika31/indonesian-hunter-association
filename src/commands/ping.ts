import type { SlashCommandProps } from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

export async function run({interaction, client}: SlashCommandProps) {
	await interaction.deferReply()

	const reply = await interaction.fetchReply();

	const ping = reply.createdTimestamp - interaction.createdTimestamp;

	await interaction.editReply(`Pong! Client ${ping}ms | Websocket ${client.ws.ping}ms`);
}

export const options = {}