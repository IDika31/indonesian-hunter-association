import type { SlashCommandProps } from 'commandkit';
import { GuildMemberRoleManager, SlashCommandBuilder } from 'discord.js';
import UserHonor from '../../models/UserHonor.model';
import roleRequirement, { roleId } from '../../../utils/roleRequirement';
import numeral from 'numeral';

export default async function takeHonor({ interaction }: SlashCommandProps) {
	numeral.defaultFormat('0,0');

	const user = interaction.options.getUser('user') ?? interaction.user;
	const amount = interaction.options.getInteger('amount') as number;

	const userHonor = await UserHonor.findOne({ userId: user.id });

	if (!userHonor) {
		await UserHonor.create({
			userId: user.id,
			xp: 0,
		});
	}

	// get all roles id from member
	const roles = (
		(await interaction.guild?.members.fetch(user.id))
			?.roles as GuildMemberRoleManager
	).cache
		.filter((role) => roleId.includes(role.id))
		.map((role) => role.id);

	if (!roles[0])
		return interaction.reply(
			`**<@${user.id}>** belum memiliki role, tolong tunggu Staff memberikan mu role setelah mengirimkan Lisensi mu!`
		);

	await UserHonor.updateOne({ userId: user.id }, { $inc: { xp: -amount } });

	return interaction.reply({
		content: `Mengambil **${numeral(
			amount
		).format()}** Honor Point dari **<@${user.id}>**!`,
		ephemeral: true,
	});
}
