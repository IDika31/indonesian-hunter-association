import { ChannelType, type Client, type Message } from 'discord.js';
import UserHonor from '../../models/UserHonor.model';
import requirement, { roleId } from '../../../utils/roleRequirement';

export default async function (message: Message<true>, client: Client<true>) {
	if (message.author.bot) return;
	// if (['338496377103450123', '1022463333783318529', '616217395429638155'].includes(message.author.id)) {
    //     const channel = await client.channels.fetch(message.channelId);

	// 	console.log(JSON.stringify(channel, null, 4));
	// }
	// if (message.channelId !== '1256923437310410832') return;
	let user = await UserHonor.findOne({ userId: message.author.id });

	if (!user) {
		user = await UserHonor.create({
			userId: message.author.id,
			xp: 0,
		});
	}

	const userData = await message.guild.members.fetch(message.author.id);
	const userRoles = userData.roles.cache.map((role) => role.id).find((role) => roleId.includes(role));

	if (!userRoles) return;

	const rank = requirement[userRoles as keyof typeof requirement];

	if (!rank) return;

	if (user.xp >= rank.requirementToNextRole) {
		await userData.roles.add(rank.nextRankRoleId, 'Naik rank');
		await userData.roles.remove(userRoles, 'Naik rank');

		await user.updateOne({ $inc: { xp: -rank.requirementToNextRole } });

		const messageChannel = await client.channels.fetch('1256923437310410832');

		if (messageChannel?.type == ChannelType.GuildText) {
			await messageChannel.send(`<@${message.author.id}> telah naik rank menjadi **${rank.nextRank}**!`);
		}
	}
}
