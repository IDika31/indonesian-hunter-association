import type { CacheType, Client, Interaction, Message } from 'discord.js';
import UserHonor from '../../models/Mission.model'

export default async function (interaction: Interaction<CacheType>) {
	if (!interaction.isCommand()) return;

	const user = UserHonor.findOne({ userID: interaction.user.id })

	if (!user) {
		await UserHonor.create({
			userID: interaction.user.id,
			xp: 0
		})
	}
}
