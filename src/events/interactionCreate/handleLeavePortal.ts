import type { CacheType, Interaction } from 'discord.js';
import { portalRole } from '../../../utils/portalRole';

export default async function (interaction: Interaction<CacheType>) {
	if (!interaction.isButton() || interaction.customId !== 'leave-portal') return;

	await interaction.deferUpdate();

	const user = interaction.guild?.members.cache.get(interaction.user.id);
	const userRoles = user?.roles.cache.map((role) => role.id);

	let responseContent = 'Kamu tidak sedang memasuki portal!';
	const roleToRemove = portalRole.find((role) => userRoles?.includes(role.id));

	if (roleToRemove) {
		await user?.roles.remove(roleToRemove.id);
		responseContent = `Berhasil keluar dari portal **${roleToRemove.role}**!`;
	}

	await interaction.followUp({
		content: responseContent,
		ephemeral: true,
	});
}
