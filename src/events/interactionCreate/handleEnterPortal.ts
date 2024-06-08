import type { CacheType, Client, Interaction, Message } from 'discord.js';
import { makeActionRow, portalRole } from '../../../utils/portalRole';
import UserBalanceModel from '../../models/UserBalance.model';

export default async function (interaction: Interaction<CacheType>) {
	if (!interaction.isStringSelectMenu()) return;

	const actionRow = makeActionRow('enter-portal');

	// await interaction.deferUpdate();
	await interaction.message.edit({
		components: [actionRow],
	});

	if (interaction.customId === 'enter-portal') {
		const user = interaction.guild?.members.cache.get(interaction.user.id);
		const userRoles = user?.roles.cache.map((role) => role.id);

		// if (
		// 	new Date(
		// 		new Date(Date.now()).toLocaleString('en-US', {
		// 			timeZone: 'Asia/Jakarta',
		// 		})
		// 	).getTime() <
		// 	new Date(
		// 		new Date('2024-06-08 20:30:00').toLocaleString('en-US', {
		// 			timeZone: 'Asia/Jakarta',
		// 		})
		// 	).getTime()
		// ) {
		// 	return await interaction.reply({
		// 		content:
		// 			'Mohon maaf, di portal ini akan di laksanakan Raid dan portal akan dibuka sementara pada **JAM 19:30 WIB** untuk melaksanakan Raid!',
		// 		ephemeral: true,
		// 	});
		// }

		// if (!userRoles?.includes('1247092894133649511')) {
		// 	return await interaction.reply({
		// 		content:
		// 			'Mohon maaf, di portal ini sedang ada Raid, Hunter yang tidak mengikuti Raid **DILARANG KERAS** untuk masuk!',
		// 		ephemeral: true,
		// 	});
		// }

		let haveRole = false;
		for (const role of portalRole) {
			if (userRoles?.includes(role.id)) {
				haveRole = true;
				break;
			}
		}

		if (haveRole) {
			await interaction.reply({
				content: 'Kamu sudah memiliki role portal!',
				ephemeral: true,
			});
			return;
		}

		let selectedPortal = portalRole.find(
			(role) => role.value === interaction.values[0]
		);

		if (!selectedPortal) {
			await interaction.reply({
				content: 'Portal tidak ditemukan!',
				ephemeral: true,
			});
			return;
		}

		if (selectedPortal?.locked) {
			await interaction.reply({
				content: 'Portal ini sedang dikunci!',
				ephemeral: true,
			});
			return;
		}

		let userPg = await UserBalanceModel.findOne(
			{
				userId: interaction.user.id,
			},
		);

		if (!userPg) {
			userPg = await UserBalanceModel.create({
				userId: interaction.user.id,
				pg: 0,
			});
		}

		if ((userPg?.pg ?? 0) < 1) {
			await interaction.reply({
				content: `PG kamu tidak cukup untuk masuk portal!

Kamu membutuhkan 1 PG (50 Silver) untuk masuk!
Silahkan tukarkan Gold Coin Kamu ke PG dengan cara /currency swap <jumlah>`,
				ephemeral: true,
			});
			return;
		}

		await UserBalanceModel.updateOne(
			{ userId: interaction.user.id },
			{ $inc: { pg: -1 } }
		);

		await user?.roles.add(selectedPortal?.id);
		await interaction.reply({
			content: `Berhasil masuk ke portal **${selectedPortal?.role}**!
			
Biaya masuk portal: **1 PG**
Sisa PG: **${(userPg?.pg as number) - 1} PG**`,
			ephemeral: true,
		});
	}
}
