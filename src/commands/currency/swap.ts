import type { SlashCommandProps } from 'commandkit';
import UserBalanceModel from '../../models/UserBalance.model';
import SwapPaymentModel from '../../models/SwapPayment.model';

export default async function swapCurrency({
	interaction,
	client,
}: SlashCommandProps) {
	const payment = await SwapPaymentModel.findOne({
		userId: interaction.user.id,
	});

	if (payment) {
		return await interaction.reply({
			content: 'Anda masih memiliki Swap Payment yang belum di proses!',
		});
	}

	const amount = interaction.options.getInteger('amount') as number;

	await SwapPaymentModel.create({
		userId: interaction.user.id,
		amount,
	});

	const message = await interaction.reply({
		content: `Silahkan kirim **${amount} GC** ke **<@658761055627116604>** dalam **MAKSIMAL 2 MENIT** untuk melakukan Swap ke ** ${
			amount * 2
		} PG**!`,
	});

	const collect = interaction.channel?.createMessageCollector({
		filter: (i) =>
			i.author.id === '964961739714216018' &&
			i.author.bot &&
			interaction.user.id === i.interaction?.user.id &&
			i.interaction?.commandName === 'send' &&
			(i.embeds[0].data.description?.includes(
				`sent ${amount - sisa} 🪙 to`
			) as boolean),
		time: 60000 * 2,
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
				sisa -= (amountSend - amount);
			}
		}

		if (
			i.interaction?.commandName === 'send' &&
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
				content: `<@${
					i.interaction.user.id
				}> Berhasil melakukan Swap sebesar **${amount} GC** ke **${
					amount * 2
				} PG**!`,
			});

			await SwapPaymentModel.deleteOne({ userId: i.interaction.user.id });

			collect.stop('done');
		}
	});

	collect?.on('end', async (c) => {
		if (c.size === 0) {
			await message.edit({
				content: 'Waktu untuk melakukan Swap telah habis!',
			});

			await SwapPaymentModel.deleteOne({ userId: interaction.user.id });
		} else {
			await message.delete()
		}
	});
}
