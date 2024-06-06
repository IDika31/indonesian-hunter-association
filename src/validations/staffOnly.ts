import type { ValidationProps } from 'commandkit';
import type { CacheType, CommandInteractionOptionResolver } from 'discord.js';

export default async function ({ interaction, commandObj }: ValidationProps) {
	if (!interaction.isCommand()) return;

	if (commandObj.options?.staffOnly) {
		const subcommand = (
			interaction.options as Omit<
				CommandInteractionOptionResolver<CacheType>,
				'getMessage' | 'getFocused'
			>
		)?.getSubcommand();

		if (!commandObj.options.staffOnly.subcommand.includes(subcommand))
			return false;

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
			interaction.reply({
				content: 'You need to be a staff to use this command!',
				ephemeral: true,
			});

			return true;
		}
	}
}
