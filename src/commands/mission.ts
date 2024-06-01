import type { SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from 'discord.js';
import randomId from 'short-unique-id';
import mission from '../../database/mission.json';
import level from '../../database/level.json';
import honorPoint from '../../utils/honorPoint';
import fs from 'fs';

interface Mission {
	[date: string]: {
		[id: string]: {
			missionRank: string;
			missionCreator: string;
			missionDescription: string;
			missionLeader: string;
			missionMember: string[];
			missionHoP: number;
			createdAt: string;
			finish: boolean;
		};
	};
}

const uid = new randomId();
const date = new Date()
	.toLocaleDateString('id-ID', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
	.split('/')
	.join('-');

export const data = new SlashCommandBuilder()
	.setName('mission')
	.setDescription('Create new Mission!')
	.addSubcommand((subcommand) =>
		subcommand
			.setName('create')
			.setDescription('Create new Mission!')
			.addStringOption((option) =>
				option
					.setName('mission_rank')
					.setDescription('The Rank of the mission')
					.setRequired(true)
					.setChoices([
						{ name: 'Rank A+', value: 'A+' },
						{ name: 'Rank A', value: 'A' },
						{ name: 'Rank B+', value: 'B+' },
						{ name: 'Rank B', value: 'B' },
						{ name: 'Rank C+', value: 'C+' },
						{ name: 'Rank C', value: 'C' },
						{ name: 'Rank D+', value: 'D+' },
						{ name: 'Rank D', value: 'D' },
						{ name: 'Rank E+', value: 'E+' },
						{ name: 'Rank E', value: 'E' },
					])
			)
			.addStringOption((option) =>
				option
					.setName('mission_creator')
					.setDescription('The creator of the mission')
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName('mission_description')
					.setDescription('The description of the mission')
					.setRequired(true)
			)
			.addUserOption((option) =>
				option
					.setName('mission_leader')
					.setDescription('The leader of the mission')
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName('mission_member')
					.setDescription(
						'The member of the mission (tag member dan pisahkan dengan spasi atau dengan enter)'
					)
					.setRequired(true)
			)
			.addIntegerOption((option) =>
				option
					.setName('mission_hop')
					.setDescription(
						'The Honor Point for every member of the mission (Khusus Special Raid / Misi dengan Rank diatas A+)'
					)
					.setRequired(false)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName('finish')
			.setDescription('Finish the mission')
			.addStringOption((option) =>
				option
					.setName('mission_id')
					.setDescription('The ID of the mission')
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName('list')
			.setDescription('List all mission')
			.addStringOption((option) =>
				option
					.setName('finish')
					.setDescription('The date of the mission')
					.setRequired(true)
					.addChoices([
						{ name: 'Finish', value: 'finish' },
						{ name: 'Unfinish', value: 'unfinish' },
					])
			)
	);

export async function run({ interaction }: SlashCommandProps) {
	const subcommand = interaction.options.getSubcommand();
	if (subcommand == 'create') {
		const id = uid.randomUUID(6).toUpperCase();
		const rank = interaction.options.getString('mission_rank');
		const creator = interaction.options.getString('mission_creator');
		const description = interaction.options.getString(
			'mission_description'
		);
		const leader = `<@${
			interaction.options.getUser('mission_leader')?.id
		}>`;
		const member = interaction.options.getString(
			'mission_member'
		) as string;

		const parseMember = member
			.trim()
			.split(/\ |\n/g)
			.map((m) => m.trim())
			.filter((m) => m != '');

		const HoP =
			Math.round(
				honorPoint[rank as keyof typeof honorPoint] /
					(parseMember.length + 1)
			) ?? interaction.options.getInteger('mission_hop');

		if (!(mission as unknown as Mission)[date]) {
			(mission as unknown as Mission)[date] = {};
		}

		(mission as unknown as Mission)[date][id] = {
			missionRank: rank as string,
			missionCreator: creator as string,
			missionDescription: description as string,
			missionLeader: leader as string,
			missionMember: parseMember,
			missionHoP: HoP,
			createdAt: new Date().toISOString(),
			finish: false,
		};

		fs.writeFileSync(
			'./database/mission.json',
			JSON.stringify(mission, null, 4)
		);

		return await interaction.reply(`Berhasil mendaftarkan hunter ke misi baru dengan rank "**${rank}**"!
		
**Detail Misi:**
- **ID:** ${id}
- **Deskripsi:** ${description}
- **Pencipta Misi:** ${creator}
- **Honor Point / Peserta:** ${HoP}
- **Leader:** ${leader}
- **Member:** ${parseMember.join(' | ')}
`);
	} else if (subcommand == 'finish') {
		const id = interaction.options.getString('mission_id') as string;

		if (!(mission as unknown as Mission)[date][id]) {
			return await interaction.reply(
				`Misi dengan ID **${id}** tidak ditemukan!`
			);
		}

		const missionData = (mission as unknown as Mission)[date][id];

		const member = missionData.missionMember;
		const leader = missionData.missionLeader;

		member.push(leader);
		member
			.map((m) => m.replace(/<@|>/g, ''))
			.forEach(async (m) => {
				if (!level[m as keyof typeof level]) {
					level[m as keyof typeof level] = {
						xp: 0,
					} as never;
				}

				level[m as keyof typeof level].xp += missionData.missionHoP;
			});

		(mission as unknown as Mission)[date][id].finish = true;
		fs.writeFileSync(
			'./database/mission.json',
			JSON.stringify(mission, null, 4) as never
		);

		fs.writeFileSync(
			'./database/level.json',
			JSON.stringify(level, null, 4) as never
		);

		return await interaction.reply(
			`Misi dengan ID **${id}** telah selesai!
			
Semua hunter yang mengikuti misi tersebut mendapatkan **${
				missionData.missionHoP
			}** Honor Point!
${member.join(' | ')}`
		);
	} else if (subcommand == 'list') {
		const finish = interaction.options.getString('finish') as string;

		const missionList = Object.entries(
			(mission as unknown as Mission)[date]
		)
			.filter(([_, missionData]) => {
				if (finish == 'finish') {
					return missionData.finish;
				} else {
					return !missionData.finish;
				}
			})
			.map(([id, missionData]) => {
				return `**ID:** ${id}
**Deskripsi:** ${missionData.missionDescription}
**Pencipta Misi:** ${missionData.missionCreator}
**Honor Point / Peserta:** ${missionData.missionHoP}
**Leader:** ${missionData.missionLeader}
**Member:** ${missionData.missionMember.join(' | ')}
`;
			})
			.join('\n');

		return await interaction.reply(`**Daftar Misi yang ${
			finish == 'finish' ? 'Selesai' : 'Belum Selesai'
		}:**

${missionList}`);
	}
}

export const options = {
	staffOnly: true,
};
