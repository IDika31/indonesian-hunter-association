import type { SlashCommandProps } from 'commandkit';
import UserHonor from '../../models/UserHonor.model';
import numeral from 'numeral';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
} from 'discord.js';
import pagination from '../../../utils/pagination';

export default async function honorLeaderboard(
	{ interaction }: SlashCommandProps,
	page: number = 1,
	limit: number = 10
) {
	numeral.defaultFormat('0,0');

	const userHonor = await UserHonor.find({
		userId: {
			$not: '<@development>',
		},
	}).sort('xp');

	const prevBtn = new ButtonBuilder()
		.setCustomId('prev')
		.setLabel('Previous Page')
		.setStyle(ButtonStyle.Success);
	const nextBtn = new ButtonBuilder()
		.setCustomId('next')
		.setLabel('Next Page')
		.setStyle(ButtonStyle.Success);
	const pageBtn = new ButtonBuilder()
		.setCustomId('page')
		.setLabel(`${page} / ${Math.ceil(userHonor.length / 5)}`)
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(true);

	const btnRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		prevBtn,
		pageBtn,
		nextBtn
	);

	if (page == 1) prevBtn.setDisabled(true);
	else prevBtn.setDisabled(false);

	if (page == Math.ceil(userHonor.length / 5)) nextBtn.setDisabled(true);
	else nextBtn.setDisabled(false);

	const userData = pagination(
		userHonor.map(
			(u, i) => `${i + 1}. <@${u.userId}>: ${u.xp} Honor Point`
		),
		page ?? 1,
		limit
	);

	const msg = await interaction.reply({
		content: `**Honor Point Leaderboard**
        
${userData.join('\n')}`,
		components: [btnRow],
		fetchReply: true,
	});

	const collector = msg.createMessageComponentCollector({
		componentType: ComponentType.Button,
		filter: (i) => i.user.id === interaction.user.id,
		time: 30_000,
	});

	collector.on('collect', async (i) => {
		if (i.user.id !== interaction.user.id)
			return i.reply({
				content: `Hanya <@${interaction.user.id}> yang bisa menggunakan tombol ini!`,
				// ephemeral: true,
			});

		await i.deferUpdate();

		if (i.customId == 'prev') {
			if (page > 1) page--;
		} else if (i.customId == 'next') {
			if (page < Math.ceil(userHonor.length / 5)) page++;
		}

		pageBtn.setLabel(`${page} / ${Math.ceil(userHonor.length / 5)}`);

		if (page == 1) prevBtn.setDisabled(true);
		else prevBtn.setDisabled(false);

		if (page == Math.ceil(userHonor.length / 5)) nextBtn.setDisabled(true);
		else nextBtn.setDisabled(false);

		const userData = pagination(
			userHonor.map(
				(u, i) => `${i + 1}. <@${u.userId}>: ${u.xp} Honor Point`
			),
			page,
			limit
		);

		await i.editReply({
			content: `**Honor Point Leaderboard**

${userData.join('\n')}`,
			components: [btnRow],
		});

		collector.resetTimer();
	});

	collector.on('end', async () => {
		prevBtn.setDisabled(true);
		nextBtn.setDisabled(true);

		await msg.edit({
			components: [btnRow],
		});
	});
}
