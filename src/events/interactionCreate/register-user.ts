import type { CacheType, Client, Interaction, Message } from 'discord.js';
import UserHonor from '../../models/UserHonor.model';

export default async function (interaction: Interaction<CacheType>) {
	// if (!interaction.isCommand()) return

	const user = await UserHonor.findOne({ userId: interaction.user.id });

	if (!user) {
		await UserHonor.create({
			userId: interaction.user.id,
			xp: 0,
		});
	}
}
