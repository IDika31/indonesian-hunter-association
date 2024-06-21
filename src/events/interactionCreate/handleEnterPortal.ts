import type { CacheType, Interaction } from 'discord.js';
import { makeActionRow, portalRole } from '../../../utils/portalRole';
import UserBalanceModel from '../../models/UserBalance.model';

export default async function (interaction: Interaction<CacheType>) {
	let responseContent = '';
	if (
		!interaction.isStringSelectMenu() ||
		interaction.customId !== 'enter-portal'
	)
		return;

	const actionRow = makeActionRow('enter-portal');
	const i = await interaction.deferUpdate();

	const user = interaction.guild?.members.cache.get(interaction.user.id);
	const userRoles = user?.roles.cache.map((role) => role.id);

	let haveRole = portalRole.some((role) => userRoles?.includes(role.id));

	if (haveRole) {
		responseContent = 'Kamu sudah memiliki role portal!';
	} else {
		let selectedPortal = portalRole.find(
			(role) => role.value === interaction.values[0]
		);

		if (!selectedPortal) {
			responseContent = 'Portal tidak ditemukan!';
		} else if (selectedPortal?.locked) {
			responseContent = 'Portal ini sedang dikunci!';
		} else {
			let userPg =
				(await UserBalanceModel.findOne({
					userId: interaction.user.id,
				})) ||
				(await UserBalanceModel.create({
					userId: interaction.user.id,
					pg: 0,
				}));

			if ((userPg?.pg ?? 0) < 1) {
				responseContent = `PG kamu tidak cukup untuk masuk portal!

Kamu membutuhkan 1 PG (50 Silver) untuk masuk!
Silahkan tukarkan Gold Coin Kamu ke PG dengan cara /currency swap <jumlah>`;
			} else {
				await UserBalanceModel.updateOne(
					{ userId: interaction.user.id },
					{ $inc: { pg: -1 } }
				);
				await user?.roles.add(selectedPortal?.id);

				responseContent = `Berhasil masuk ke portal **${
					selectedPortal?.role
				}**!
				
Biaya masuk portal: **1 PG**
Sisa PG: **${(userPg?.pg as number) - 1} PG**`;
			}
		}
	}

	await interaction.followUp({
		content: responseContent,
		ephemeral: true,
	});
	await i.edit({ components: [actionRow] });
}
