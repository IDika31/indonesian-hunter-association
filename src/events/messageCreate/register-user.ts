import type { Client, Message } from 'discord.js';
import UserHonor from '../../models/Mission.model';

export default async function (message: Message<true>) {
	const user = UserHonor.findOne({ userID: message.author.id });

	if (!user) {
		await UserHonor.create({
			userID: message.author.id,
			xp: 0,
		});
	}
}
