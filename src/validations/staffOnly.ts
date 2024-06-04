import type { ValidationProps } from 'commandkit';
import type { GuildMemberRoleManager } from 'discord.js';

export default async function ({
	interaction,
	commandObj,
	client,
}: ValidationProps) {
	if (commandObj.options?.staffOnly.status) {
		const member = interaction.guild?.members.cache.get(
			interaction.user.id
		);
		const adminMisi = commandObj.options?.staffOnly
			.missionAdmin as string[];
		if (
			member?.roles.cache.find(
				(role) =>
					role.id == '1242507903751946280' ||
					role.id == '1243037522548883528'
			) ||
			adminMisi.includes(interaction.user.id)
		) {
			return false;
		} else {
			if (!interaction.isCommand()) return;
			interaction.reply({
				content: 'You need to be a staff to use this command!',
				ephemeral: true,
			});

			return true;
		}
	}
}
