import { ChannelType, TextChannel, type Client } from 'discord.js';
import { makeActionRow } from '../../../utils/portalRole';

export default async function (client: Client<true>) {
	const channel = await client.channels.fetch('1247759787207163998');

	if (channel?.type == ChannelType.GuildText) {
		const guildChannel = channel as TextChannel;
		const message = await guildChannel.messages.fetch();

		const msg = message.find(async (msg) => {
			msg.author.id === client.user?.id;
		});

		if (msg) return;

		const actionRow = makeActionRow('enter-portal');

		await guildChannel.send({
			content: 'Silahkan pilih portal yang ingin kamu masuki!',
			components: [actionRow],
		});

		console.log('Portal masuk berhasil dibuat!');
	}
}
