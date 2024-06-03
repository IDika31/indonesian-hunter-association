import type { SlashCommandProps } from 'commandkit';
import randomId from 'short-unique-id';
import honorPoint from '../../../utils/honorPoint';
import MissionModel from '../../models/Mission.model';

export default async function createMission(
	{ interaction }: SlashCommandProps,
	date: string
) {
	const uid = new randomId();

	const id = uid.randomUUID(6).toUpperCase();
	const rank = interaction.options.getString('mission_rank');
	const creator = interaction.options.getString('mission_creator');
	const description = interaction.options.getString('mission_description');
	const leader = `<@${interaction.options.getUser('mission_leader')?.id}>`;
	const member = interaction.options.getString('mission_member') as string;

	const parseMember = member
		.trim()
		.split(/\ |\n/g)
		.map((m) => m.trim())
		.filter((m) => m != '')
		.filter((m) => m != leader)
		.reduce((acc: string[], curr: string) => {
			if (!acc.includes(curr)) acc.push(curr);

			return acc;
		}, []);

	const HoP =
		interaction.options.getInteger('mission_hop') ??
		Math.round(
			honorPoint[rank as keyof typeof honorPoint] /
				(parseMember.length + 1)
		);

	await MissionModel.create({
		date,
		missionId: id,
		missionRank: rank as string,
		missionCreator: creator as string,
		missionDescription: description as string,
		missionLeader: leader as string,
		missionMember: parseMember,
		missionHoP: HoP,
		createdAt: new Date().toISOString(),
		finish: false,
	});

	return await interaction.reply(`Berhasil mendaftarkan hunter ke misi baru dengan rank "**${rank}**"!
		
**Detail Misi:**
- **ID:** ${id}
- **Deskripsi:** ${description}
- **Pencipta Misi:** ${creator}
- **Honor Point / Peserta:** ${HoP}
- **Leader:** ${leader}
- **Member:** ${
		parseMember.length <= 10
			? parseMember.join(' | ')
			: 'Kebanyakan membernya :)'
	}
- **Tanggal:** ${date}
`);
}
