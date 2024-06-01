import type { SlashCommandProps } from 'commandkit';
import { GuildMemberRoleManager, SlashCommandBuilder } from 'discord.js';
import level from '../../database/level.json';
import roleRequirement, { roleId } from '../../utils/roleRequirement';
import numeral from 'numeral';
import fs from 'fs';

export const data = new SlashCommandBuilder()
	.setName('honor')
	.setDescription('Check your Honor Point to rank up!')
	.addUserOption((option) =>
		option
			.setName('user')
			.setDescription('The user to check')
			.setRequired(false)
	);

export async function run({ interaction, client }: SlashCommandProps) {
	numeral.defaultFormat('0,0');

	const user = interaction.options.getUser('user') ?? interaction.user;

	if (!level[user.id as keyof typeof level]) {
		level[user.id as keyof typeof level] = {
			xp: 0,
		} as never;

		fs.writeFileSync(
			'./database/level.json',
			JSON.stringify(level, null, 4)
		);
	}

	// get all roles id from member
	const roles = (interaction.member?.roles as GuildMemberRoleManager).cache
		.filter((role) => roleId.includes(role.id))
		.map((role) => role.id);

		if(!roles[0]) return interaction.reply(`**<@${user.id}>** Kamu belum memiliki role, tolong tunggu Staff memberikan mu role setelah mengirimkan Lisensi mu!`);

	return interaction.reply(
		`**<@${user.id}>** need **${numeral(
			level[user.id as keyof typeof level].xp
		).format()} / ${numeral(
			roleRequirement[roles[0] as keyof typeof roleRequirement]
				.requirementToNextRole
		).format()}** more Honor Point to rank up to rank "${
			roleRequirement[roles[0] as keyof typeof roleRequirement].nextRank
		}"!`
	);
}

export const options = {};
