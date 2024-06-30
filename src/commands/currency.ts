import type { SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from 'discord.js';
// import swapCurrency from './currency/swap';
// import checkCurrency from './currency/check';

export const data = new SlashCommandBuilder()
	.setName('currency')
	.setDescription('Currency Menu!')
	.addSubcommand((subcommand) =>
		subcommand
			.setName('swap')
			.setDescription('Swap your GC to PG (Portal Guardian) Point!')
			.addIntegerOption((option) => option.setName('amount').setDescription('The amount of GC to Swap!').setRequired(true))
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName('check')
			.setDescription('Check your PG (Portal Guardian) Point')
			.addUserOption((option) => option.setName('user').setDescription('The user to check').setRequired(false))
	);

export async function run({ interaction, client, handler }: SlashCommandProps) {
	const subcommand = interaction.options.getSubcommand();

	// if (subcommand === 'swap') {
	// 	swapCurrency({ interaction, client, handler });
	// } else if (subcommand === 'check') {
	// 	checkCurrency({ interaction, client, handler });
	// }
}

export const options = {
	maintenance: {
		subcommand: [],
	},
	deleted: true,
};
