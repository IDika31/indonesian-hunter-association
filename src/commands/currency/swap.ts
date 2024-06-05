import type { SlashCommandProps } from 'commandkit';
import UserBalanceModel from '../../models/UserBalance.model';

export default async function swapCurrency({
	interaction,
	client,
}: SlashCommandProps) {
	const amount = interaction.options.getInteger('amount')!;

	const message = await interaction.reply({
		content: `Silahkan kirim **${amount} GC** ke **<@658761055627116604>** dalam 60 detik untuk melakukan Swap ke **PG**!`,
	});

	const collect = interaction.channel?.createMessageCollector({
		filter: (i) => i.author.id === '964961739714216018' && i.author.bot,
		time: 60000,
	});

	let sisa = 0;

	collect?.on('collect', async (i) => {
		const userId = (
			await interaction.guild?.members.fetch({
				query: i.embeds[0].data.footer?.text,
				limit: 1,
			})
		)?.first()?.id;

		const amountSend = parseInt(
			i.embeds[0].data.description?.split(' ')[1] as string
		);
		if (
			!i.embeds[0].data.description?.includes(
				`${(amount - sisa).toString()}`
			)
		) {
			if (amountSend < amount) {
				sisa += amountSend;
				await i.reply({
					content: `Jumlah GC yang dikirimkan tidak sesuai, silahkan kirim sisa *${
						amount - sisa
					}*!`,
				});
			} else {
				sisa -= amountSend - amount;
				console.log('a');
			}
		}

		if (
			i.interaction?.commandName === 'send' &&
			i.interaction.user.id === interaction.user.id &&
			i.embeds[0].data.description?.includes(
				`sent ${amount - sisa} 🪙 to`
			) &&
			userId === '658761055627116604'
		) {
			await UserBalanceModel.updateOne(
				{ userId: i.interaction.user.id },
				{
					$inc: {
						pg: amount * 2,
					},
				},
				{ upsert: true }
			);

			await i.reply({
				content: `Berhasil melakukan Swap sebesar **${amount} GC** ke **${amount * 2} PG**!`,
			});
			await i.delete();

			collect.stop();
		}
	});

	collect?.on('end', async () => await message.delete());
}
