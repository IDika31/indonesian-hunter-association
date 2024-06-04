import type { SlashCommandProps } from 'commandkit';
import MissionModel from '../../models/Mission.model';
import UserHonor from '../../models/UserHonor.model';

export default async function finishMission(
	{ interaction }: SlashCommandProps,
	date: string
) {
	const id = interaction.options.getString('mission_id') as string;

	const mission = await MissionModel.findOne({ date, missionId: id });

	if (!mission) {
		return await interaction.reply(
			`Misi dengan ID **${id}** tidak ditemukan pada tanggal **${date}**!`
		);
	}

	if (mission.finish)
		return await interaction.reply(
			`Misi dengan ID **${id}** sudah selesai!`
		);

	const missionData = mission;
	const member = missionData?.missionMember;
	const leader = missionData?.missionLeader;

	member?.push(leader as string);

	await UserHonor.updateMany(
		{ userId: { $in: member.map((m) => m.replace(/<@|>/g, '')) } },
		{ $inc: { xp: missionData?.missionHoP } }
	);

	await MissionModel.findOneAndUpdate(
		{
			date,
			missionId: id,
		},
		{
			finish: true,
		}
	);

	return await interaction.reply(
		`Misi dengan ID **${id}** telah selesai!

Semua hunter yang mengikuti misi tersebut mendapatkan **${
			missionData?.missionHoP
		}** Honor Point!
${member.length <= 10 ? member?.join(' | ') : 'Kebanyakan membernya :)'}`
	);
}
