import type { Client, Message } from 'discord.js';
import level from '../../../database/level.json';
import fs from 'fs';

export default function (message: Message<true>) {
	if (!level[message.author.id as keyof typeof level]) {
		level[message.author.id as keyof typeof level] = {
			xp: 0,
		} as never;

		fs.writeFileSync(
			'./database/level.json',
			JSON.stringify(level, null, 4)
		);
	}
}
