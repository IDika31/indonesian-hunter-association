import type { SlashCommandProps } from 'commandkit';
import { GuildMemberRoleManager, SlashCommandBuilder } from 'discord.js';
import UserHonor from '../../models/UserHonor.model';
import roleRequirement, { roleId } from '../../../utils/roleRequirement';
import numeral from 'numeral';

export default async function checkHonor({ interaction }: SlashCommandProps) {
	numeral.defaultFormat('0,0');

	const user = interaction.options.getUser('user') ?? interaction.user;

	const userHonor = await UserHonor.findOne({ userId: user.id });

	if (!userHonor) {
		await UserHonor.create({
			userId: user.id,
			xp: 0,
		});
	}

	// get all roles id from member
	const roles = ((await interaction.guild?.members.fetch(user.id))?.roles as GuildMemberRoleManager).cache.filter((role) => roleId.includes(role.id)).map((role) => role.id);

	if (!roles[0]) return interaction.reply(`**<@${user.id}>** Kamu belum memiliki role, tolong tunggu Staff memberikan mu role setelah mengirimkan Lisensi mu!`);

	let messageSend = ''
	if (!roleRequirement[roles[0] as keyof typeof roleRequirement]) messageSend = `**<@${user.id}>** Kamu telah mencapai batas maksimal Rank untuk umum yaitu rank **S**!`;
	else messageSend = `**<@${user.id}>** need **${numeral(userHonor?.xp).format()} / ${numeral(roleRequirement[roles[0] as keyof typeof roleRequirement].requirementToNextRole).format()}** more Honor Point to rank up to rank "${roleRequirement[roles[0] as keyof typeof roleRequirement].nextRank}"!`;

	return interaction.reply(messageSend);
}
