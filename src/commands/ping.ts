import type { SlashCommandProps } from "commandkit";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

export function run({interaction}: SlashCommandProps) {
	interaction.reply('Pong!');
}

export const options = {}