import type { SlashCommandProps } from 'commandkit';
import { GuildMemberRoleManager, SlashCommandBuilder } from 'discord.js';
import UserBalance from '../../models/UserBalance.model';

export default async function checkCurrency({
	interaction,
}: SlashCommandProps) {
	const user = interaction.options.getUser('user') ?? interaction.user;

	const userPg = await UserBalance.findOne({ userId: user.id });

	if (!userPg) {
		await UserBalance.create({
			userId: user.id,
			pg: 0,
		});

		return interaction.reply({
			content: `**<@${user.id}>** belum memiliki PG (Portal Guardian) Point!`,
		});
	}

	return interaction.reply({
		content: `**<@${user.id}>** memiliki **${userPg?.pg}** PG (Portal Guardian) Point!`,
	});
}
