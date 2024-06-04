import type { CommandKit, SlashCommandProps } from 'commandkit';
import MissionModel from '../../models/Mission.model';
import UserHonor from '../../models/UserHonor.model';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
} from 'discord.js';
import pagination from '../../../utils/pagination';

export default async function listMission(
	{ interaction }: SlashCommandProps,
	date: string
) {
	const finish = interaction.options.getString('mission-type') as string;
	const mission = await MissionModel.find({ date });
	let missionList = mission
		.filter((m) => {
			if (finish == 'finish') return m.finish;
			else return !m.finish;
		})
		.map((m) => {
			return `**ID:** ${m.missionId}
**Deskripsi:** ${m.missionDescription}
**Pencipta Misi:** ${m.missionCreator}
**Leader:** ${m.missionLeader}
**Member:** ${
				m.missionMember.length <= 10
					? m.missionMember.join(' | ')
					: 'Kebanyakan membernya :)'
			}
**Honor Point / Peserta:** ${m.missionHoP}
**Tanggal:** ${m.date}`;
		});

	// Setting pagination 5/page
	let page = interaction.options.getInteger('page') ?? 1;

	const missionListPage = pagination(missionList, page, 5);

	if (!missionListPage[0]) {
		return await interaction.reply(
			`Tidak Ada Misi Yang ${
				finish == 'finish' ? 'Sudah Selesai' : 'Belum Selesai'
			} Pada Tanggal **${
				(interaction.options.getString('date') as string) ?? date
			}**!`
		);
	}

	const buttonList = missionListPage.map((v) =>
		new ButtonBuilder()
			.setLabel(`Finish ${v.split('\n')[0].split(' ')[1]}`)
			.setCustomId(v.split('\n')[0].split(' ')[1])
			.setStyle(ButtonStyle.Primary)
	);

	const prevPageButton = new ButtonBuilder()
		.setLabel('Previous Page')
		.setCustomId('prev')
		.setStyle(ButtonStyle.Success);

	const nextPageButton = new ButtonBuilder()
		.setLabel('Next Page')
		.setCustomId('next')
		.setStyle(ButtonStyle.Success);

	const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		buttonList
	);

	const nextPageOrPrevPageRow =
		new ActionRowBuilder<ButtonBuilder>().addComponents(
			prevPageButton,
			nextPageButton
		);

	if (page == 1) prevPageButton.setDisabled(true);
	else prevPageButton.setDisabled(false);

	if (page == Math.ceil(missionList.length / 5))
		nextPageButton.setDisabled(true);
	else nextPageButton.setDisabled(false);

	const reply = await interaction.reply({
		content: `**Daftar Misi Yang ${
			finish == 'finish' ? 'Sudah Selesai' : 'Belum Selesai'
		} Pada Tanggal ${
			(interaction.options.getString('date') as string) ?? date
		}:**

${missionListPage.join('\n\n') || 'Tidak ada misi!'}

Page ${page} / ${Math.ceil(missionList.length / 5)}`,
		components: [buttonRow, nextPageOrPrevPageRow].filter((v) => {
			if (finish == 'finish') return v == nextPageOrPrevPageRow;
			else return true;
		}),
		fetchReply: true,
	});

	const collector = reply.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: 30_000,
	});

	collector.on('end', async () => await reply.delete());

	collector.on('collect', async (i) => {
		if (i.user.id !== interaction.user.id)
			return i.reply({
				content: `Hanya <@${interaction.user.id}> yang bisa menggunakan tombol ini!`,
				ephemeral: true,
			});

		await i.deferUpdate();

		if (i.customId == 'prev') {
			if (page > 1) page--;
		} else if (i.customId == 'next') {
			if (page < Math.ceil(missionList.length / 5)) page++;
		} else {
			const id = i.customId;

			const mission = await MissionModel.findOne({
				date,
				missionId: id,
			});

			if (!mission)
				return await i.message.reply(
					`Misi dengan ID **${id}** tidak ditemukan pada tanggal **${date}**!`
				);

			if (mission.finish)
				return await i.message.reply(
					`Misi dengan ID **${id}** sudah selesai!`
				);

			const missionData = mission;
			const member = missionData?.missionMember;
			const leader = missionData?.missionLeader;

			member?.push(leader as string);

			await UserHonor.updateMany(
				{
					userId: {
						$in: member.map((m) => m.replace(/<@|>/g, '')),
					},
				},
				{ $inc: { xp: missionData?.missionHoP as number } }
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

			missionList = missionList.filter((m) => !m.includes(id));

			await i.message.reply({
				content: `Misi dengan ID **${id}** telah selesai!

Semua hunter yang mengikuti misi tersebut mendapatkan **${
					missionData?.missionHoP
				}** Honor Point!
${member?.join(' | ')}`,
			});
		}

		if (page == 1) prevPageButton.setDisabled(true);
		else prevPageButton.setDisabled(false);

		if (page == Math.ceil(missionList.length / 5))
			nextPageButton.setDisabled(true);
		else nextPageButton.setDisabled(false);

		const missionListPageNow = pagination(missionList, page, 5);

		const buttonListNow = missionListPageNow.map((v) =>
			new ButtonBuilder()
				.setLabel(`Finish ${v.split('\n')[0].split(' ')[1]}`)
				.setCustomId(v.split('\n')[0].split(' ')[1])
				.setStyle(ButtonStyle.Primary)
		);

		await reply.edit({
			content: `**Daftar Misi Yang ${
				finish == 'finish' ? 'Sudah Selesai' : 'Belum Selesai'
			} Pada Tanggal ${
				(interaction.options.getString('date') as string) ?? date
			}:**

${missionListPageNow.join('\n\n') || 'Tidak ada misi!'}

Page ${page} / ${Math.ceil(missionList.length / 5)}`,
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					buttonListNow
				),
				nextPageOrPrevPageRow,
			].filter((v) => {
				if (finish == 'finish') return v == nextPageOrPrevPageRow;
				else return true;
			}),
		});
		collector.resetTimer();
	});
}
