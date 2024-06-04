import type { ValidationProps } from 'commandkit';
import type { GuildMemberRoleManager } from 'discord.js';

export default async function ({
	interaction,
	commandObj,
	client,
}: ValidationProps) {
	if (commandObj.options?.staffOnly) {
		const member = interaction.guild?.members.cache.get(
			interaction.user.id
		);
		const adminMisi = ['694072836800774174', '511750157822328842'];
		if (
			member?.roles.cache.find(
				(role) =>
					role.id == '1242507903751946280' ||
					role.id == '1243037522548883528' ||
					role.id == '1230491973970825338'
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
