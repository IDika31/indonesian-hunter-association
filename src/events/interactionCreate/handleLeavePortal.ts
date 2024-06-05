import type { CacheType, Client, Interaction, Message } from 'discord.js';
import { makeActionRow, portalRole } from '../../../utils/portalRole';

export default async function (interaction: Interaction<CacheType>) {
	if (!interaction.isButton()) return;

	if (interaction.customId === 'leave-portal') {
		const user = interaction.guild?.members.cache.get(interaction.user.id);
		const userRoles = user?.roles.cache.map((role) => role.id);

		let notHaveRole = true;
		for (const role of portalRole) {
            if (userRoles?.includes(role.id)) {
                notHaveRole = false;
				await user?.roles.remove(role.id);
				await interaction.reply({
					content: `Berhasil keluar dari portal **${role.role}**!`,
					ephemeral: true,
				});
				break;
			}
		}

		if (notHaveRole) {
			await interaction.reply({
				content: 'Kamu tidak sedang memasuki portal!',
				ephemeral: true,
			});
			return;
		}
	}
}
