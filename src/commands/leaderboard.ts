import type { SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from 'discord.js';
import honorLeaderboard from './leaderboard/honor';

export const data = new SlashCommandBuilder()
	.setName('leaderboard')
	.setDescription('Leaderboard of the server')
	.addSubcommand((subcommand) =>
		subcommand
			.setName('honor')
			.setDescription('Leaderboard of the server based on Honor Point')
			.addIntegerOption((option) =>
				option
					.setName('limit')
					.setDescription('Limit of the leaderboard')
					.setRequired(false)
			)
			.addIntegerOption((option) =>
				option
					.setName('page')
					.setDescription('Page of the leaderboard')
					.setRequired(false)
			)
	);

export async function run({ interaction, client, handler }: SlashCommandProps) {
	const subcommand = interaction.options.getSubcommand();

	if (subcommand === 'honor') {
		const limit = interaction.options.getInteger('limit') ?? 10;
		const page = interaction.options.getInteger('page') ?? 1;

		await honorLeaderboard({ interaction, client, handler }, page, limit);
	}
}

export const options = {};
