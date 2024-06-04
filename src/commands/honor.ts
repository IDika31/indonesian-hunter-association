import type { SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from 'discord.js';
import checkHonor from './honor/check';
import giveHonor from './honor/give';
import takeHonor from './honor/take';
import resetHonor from './honor/reset';

export const data = new SlashCommandBuilder()
	.setName('honor')
	.setDescription('Check your Honor Point to rank up!')
	.addSubcommand((subcommand) =>
		subcommand
			.setName('check')
			.setDescription('Check your Honor Point')
			.addUserOption((option) =>
				option
					.setName('user')
					.setDescription('The user to check')
					.setRequired(false)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName('give')
			.setDescription('Give Honor Point to user')
			.addUserOption((option) =>
				option
					.setName('user')
					.setDescription('The user to give')
					.setRequired(true)
			)
			.addIntegerOption((option) =>
				option
					.setName('amount')
					.setDescription('The amount of Honor Point to give')
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName('take')
			.setDescription('Take Honor Point from user')
			.addUserOption((option) =>
				option
					.setName('user')
					.setDescription('The user to take')
					.setRequired(true)
			)
			.addIntegerOption((option) =>
				option
					.setName('amount')
					.setDescription('The amount of Honor Point to take')
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName('reset')
			.setDescription('Reset Honor Point to user')
			.addUserOption((option) =>
				option
					.setName('user')
					.setDescription('The user to reset')
					.setRequired(true)
			)
	);

export async function run({ interaction, client, handler }: SlashCommandProps) {
	const subcommand = interaction.options.getSubcommand();
	if (subcommand === 'check') {
		checkHonor({ interaction, client, handler });
	} else if (subcommand === 'give') {
		giveHonor({ interaction, client, handler });
	} else if (subcommand === 'take') {
		takeHonor({ interaction, client, handler });
	} else if (subcommand === 'reset') {
		resetHonor({ interaction, client, handler });
	}
}

export const options = {};
