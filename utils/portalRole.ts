import {
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from 'discord.js';

export const portal = [
	{
		label: 'Chandrapuri Shadow - Kingdom Of Moon',
		description:
			'Klik untuk masuk ke portal Chandrapuri Shadow - Kingdom Of Moon',
		emoji: '🌙',
		value: 'kingdom-of-moon',
	},
	{
		label: 'Vayupura - Kingdom Of Wind',
		description: 'Klik untuk masuk ke portal Vayupura - Kingdom Of Wind',
		emoji: '🌪',
		value: 'kingdom-of-wind',
	},
	{
		label: 'Vrikshavan - Kingdom Of Forest',
		description:
			'Klik untuk masuk ke portal Vrikshavan - Kingdom Of Forest',
		emoji: '🌳',
		value: 'kingdom-of-forest',
	},
	{
		label: 'Gajanana - Kingdom Of Elephants',
		description:
			'Klik untuk masuk ke portal Gajanana - Kingdom Of Elephants',
		emoji: '🐘',
		value: 'kingdom-of-elephants',
	},
	{
		label: 'Vanaralaya - Kingdom Of Apes',
		description: 'Klik untuk masuk ke portal Vanaralaya - Kingdom Of Apes',
		emoji: '🐒',
		value: 'kingdom-of-apes',
	},
	{
		label: 'Surayagarh - Kingdom Of Fire',
		description: 'Klik untuk masuk ke portal Surayagarh - Kingdom Of Fire',
		emoji: '🔥',
		value: 'kingdom-of-fire',
	},
	{
		label: 'Mahendraparvata - Kingdom Of Mountains',
		description:
			'Klik untuk masuk ke portal Mahendraparvata - Kingdom Of Mountains',
		emoji: '🏔',
		value: 'kingdom-of-mountains',
	},
	{
		label: 'Jaladhara - Kingdom Of Water',
		description: 'Klik untuk masuk ke portal Jaladhara - Kingdom Of Water',
		emoji: '🌊',
		value: 'kingdom-of-water',
	},
	{
		label: 'Indraloka - Kingdom Of Sky',
		description: 'Klik untuk masuk ke portal Indraloka - Kingdom Of Sky',
		emoji: '☁',
		value: 'kingdom-of-sky',
	},
	{
		label: 'Amritapuri - Kingdom Of Immortality',
		description:
			'Klik untuk masuk ke portal Amritapuri - Kingdom Of Immortality',
		emoji: '🧚🏻',
		value: 'kingdom-of-immortality',
	},
	{
		label: 'Ratnagiri - Kingdom Of Jewels',
		description: 'Klik untuk masuk ke portal Ratnagiri - Kingdom Of Jewels',
		emoji: '💎',
		value: 'kingdom-of-jewels',
	},
	{
		label: 'Suvarnadvipa - Kingdom Of Gold',
		description:
			'Klik untuk masuk ke portal Suvarnadvipa - Kingdom Of Gold',
		emoji: '🪙',
		value: 'kingdom-of-gold',
	},
	{
		label: 'Nagaloka - Kingdom Of Dragons',
		description: 'Klik untuk masuk ke portal Nagaloka - Kingdom Of Dragons',
		emoji: '🐲',
		value: 'kingdom-of-dragons',
	},
	{
		label: 'Tejakshara - Kingdom Of Sacred Fire',
		description:
			'Klik untuk masuk ke portal Tejakshara - Kingdom Of Sacred Fire',
		emoji: '🔥',
		value: 'kingdom-of-sacred-fire',
	},
];

export const portalRole = [
	{
		id: '1247515709659943068',
		role: '🌕 KINGDOM OF MOON',
		value: 'kingdom-of-moon',
		locked: false,
	},
	{
		id: '1247516238951874560',
		role: '🌪 KINGDOM OF WIND',
		value: 'kingdom-of-wind',
		locked: false,
	},
	{
		id: '1247516490047950868',
		role: '🌳 KINGDOM OF FOREST',
		value: 'kingdom-of-forest',
		locked: false,
	},
	{
		id: '1247516803018788936',
		role: '🐘 KINGDOM OF ELEPHANTS',
		value: 'kingdom-of-elephants',
		locked: false,
	},
	{
		id: '1247517112239652966',
		role: '🐒 KINGDOM OF APES',
		value: 'kingdom-of-apes',
		locked: false,
	},
	{
		id: '1247793587870109727',
		role: '🔥 KINGDOM OF FIRE',
		value: 'kingdom-of-fire',
		locked: false,
	},
	{
		id: '1247793768749338686',
		role: '🏔 KINGDOM OF MOUNTAINS',
		value: 'kingdom-of-mountains',
		locked: false,
	},
	{
		id: '1247802877213282304',
		role: '🌊 KINGDOM OF WATER',
		value: 'kingdom-of-water',
		locked: false,
	},
	{
		id: '1247802960130342973',
		role: '☁ KINGDOM OF SKY',
		value: 'kingdom-of-sky',
		locked: true,
	},
	{
		id: '1247802984788791369',
		role: '🧚🏻 KINGDOM OF IMMORTALITY',
		value: 'kingdom-of-immortality',
		locked: true,
	},
	{
		id: '1247803037972434974',
		role: '💎 KINGDOM OF JEWELS',
		value: 'kingdom-of-jewels',
		locked: true,
	},
	{
		id: '1247803098815270942',
		role: '🪙 KINGDOM OF GOLD',
		value: 'kingdom-of-gold',
		locked: true,
	},
	{
		id: '1247803141630726186',
		role: '🐲 KINGDOM OF DRAGONS',
		value: 'kingdom-of-dragons',
		locked: false,
	},
	{
		id: '1247803164783284367',
		role: '🔥 KINGDOM OF SACRED FIRE',
		value: 'kingdom-of-sacred-fire',
		locked: true,
	},
];

export function makeActionRow(customId: 'enter-portal' | 'leave-portal') {
	if (customId === 'enter-portal') {
		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId(customId)
			.setPlaceholder('Pilih portal')
			.setMinValues(1)
			.setMaxValues(1)
			.addOptions(
				portal.map((p) =>
					new StringSelectMenuOptionBuilder()
						.setLabel(p.label)
						.setDescription(p.description)
						.setEmoji(p.emoji)
						.setValue(p.value)
				)
			);
		const actionRow =
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				selectMenu
			);

		return actionRow;
	} else {
		const selectMenu = new ButtonBuilder()
			.setCustomId(customId)
			.setLabel('Keluar dari portal')
			.setStyle(ButtonStyle.Danger)
			.setEmoji('🚪');
		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			selectMenu
		);

		return actionRow;
	}
}
