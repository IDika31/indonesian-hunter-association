import type { SlashCommandProps } from 'commandkit';
import MissionModel from '../../models/Mission.model';
import UserHonor from '../../models/UserHonor.model';
import axios from 'axios';
import rupionReward from '../../../utils/rupionReward';

export default async function finishMission({ interaction }: SlashCommandProps, date: string) {
	const id = interaction.options.getString('mission_id') as string;

	const mission = await MissionModel.findOne({ date, missionId: id });

	if (!mission) {
		return await interaction.reply(`Misi dengan ID **${id}** tidak ditemukan pada tanggal **${date}**!`);
	}

	if (mission.finish) return await interaction.reply(`Misi dengan ID **${id}** sudah selesai!`);

	const missionData = mission;
	const member = missionData.missionMember;
	const leader = missionData.missionLeader;

	member.push(leader);

	await axios.post('https://rupion-currency-7614faa3019d.herokuapp.com/api/v1/mission/finish', {
		missionLeader: leader,
		missionMember: member,
		missionReward: rupionReward[missionData.missionRank as keyof typeof rupionReward],
	});

	// return console.log(response.data);

	await UserHonor.updateMany({ userId: { $in: member.map((m) => m.replace(/<@|>|\s/g, '')) } }, { $inc: { xp: missionData.missionHoP } });

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

Setiap hunter yang mengikuti misi tersebut mendapatkan **${rupionReward[missionData.missionRank as keyof typeof rupionReward]}** Rupion & **${missionData?.missionHoP}** Honor Point!
${member.length <= 10 ? member?.join(' | ') : 'Kebanyakan membernya :)'}`
	);
}
