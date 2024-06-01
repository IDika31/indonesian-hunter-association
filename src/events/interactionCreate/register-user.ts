import type { CacheType, Client, Interaction, Message } from 'discord.js';
import level from '../../../database/level.json';
import fs from 'fs';

export default function (interaction: Interaction<CacheType>) {
	if (!interaction.isCommand()) return;
	if (!level[interaction.user.id as keyof typeof level]) {
		level[interaction.user.id as keyof typeof level] = {
			xp: 0,
		} as never;

		fs.writeFileSync(
			'./database/level.json',
			JSON.stringify(level, null, 4)
		);
	}
}
