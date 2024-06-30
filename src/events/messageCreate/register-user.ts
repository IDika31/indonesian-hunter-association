import type { Client, Message } from 'discord.js';
import UserHonor from '../../models/UserHonor.model';

export default async function (message: Message<true>) {
	const user = await UserHonor.findOne({ userId: message.author.id });

	if (!user) {
		await UserHonor.create({
			userId: message.author.id,
			xp: 0,
		});
	}
}
