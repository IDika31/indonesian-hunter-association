import type { ValidationProps } from 'commandkit';
import type { CacheType, CommandInteractionOptionResolver } from 'discord.js';

export default async function ({ interaction, commandObj }: ValidationProps) {
	if (commandObj.options?.maintenance) {
		if (!interaction.isCommand()) return;

		const subcommand = (
			interaction.options as Omit<
				CommandInteractionOptionResolver<CacheType>,
				'getMessage' | 'getFocused'
			>
		)?.getSubcommand();

		if (!commandObj.options.maintenance.subcommand.includes(subcommand))
			return false;

		await interaction.reply({
			content: 'This Command is Currently under Maintenance!',
			// ephemeral: true,
		});
        return true;
	}
}
