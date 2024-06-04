import type { SlashCommandProps } from 'commandkit';
import { GuildMemberRoleManager, SlashCommandBuilder } from 'discord.js';
import UserBalance from '../../models/UserBalance.model';

export default async function checkCurrency({ interaction }: SlashCommandProps) {
	const user = interaction.options.getUser('user') ?? interaction.user;

	const userHonor = await UserBalance.findOne(
		{ userId: user.id },
		{ pg: 1, _id: 0 },
		{ upsert: true }
	);

	return interaction.reply({
		content: `**<@${user.id}>** memiliki **${userHonor?.pg}** PG (Portal Guardian) Point!`,
	});
}
