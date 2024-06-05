import { ChannelType, TextChannel, type Client } from 'discord.js';
import { makeActionRow } from '../../../utils/portalRole';

export default async function (client: Client<true>) {
	const channel = await client.channels.fetch('1247797641463730249');

	if (channel?.type == ChannelType.GuildText) {
		const guildChannel = channel as TextChannel;
		const message = await guildChannel.messages.fetch();

		const msg = message.find(async (msg) => {
			msg.author.id === client.user?.id;
		});

		if (msg) return;

		const actionRow = makeActionRow('leave-portal');

		await guildChannel.send({
			content: 'Silahkan klik disini untuk keluar portal!',
			components: [actionRow],
		});

		console.log('Portal keluar berhasil dibuat!');
	}
}
