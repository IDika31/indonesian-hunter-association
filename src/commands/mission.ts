import type { SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from 'discord.js';
import createMission from './mission/create';
import finishMission from './mission/finish';
import listMission from './mission/list';

export const data = new SlashCommandBuilder()
	.setName('mission')
	.setDescription('Create new Mission!')
	.addSubcommand((subcommand) =>
		subcommand
			.setName('create')
			.setDescription('Create new Mission!')
			.addStringOption((option) =>
				option
					.setName('mission_rank')
					.setDescription('The Rank of the mission')
					.setRequired(true)
					.setChoices([
						{ name: 'Rank S', value: 'S' },
						{ name: 'Rank A+', value: 'A+' },
						{ name: 'Rank A', value: 'A' },
						{ name: 'Rank B+', value: 'B+' },
						{ name: 'Rank B', value: 'B' },
						{ name: 'Rank C+', value: 'C+' },
						{ name: 'Rank C', value: 'C' },
						{ name: 'Rank D+', value: 'D+' },
						{ name: 'Rank D', value: 'D' },
						{ name: 'Rank E+', value: 'E+' },
						{ name: 'Rank E', value: 'E' },
					])
			)
			.addStringOption((option) => option.setName('mission_creator').setDescription('The creator of the mission').setRequired(true))
			.addStringOption((option) => option.setName('mission_description').setDescription('The description of the mission').setRequired(true))
			.addUserOption((option) => option.setName('mission_leader').setDescription('The leader of the mission').setRequired(true))
			.addStringOption((option) => option.setName('mission_member').setDescription('The member of the mission (tag member dan pisahkan dengan spasi atau dengan enter)').setRequired(true))
			.addIntegerOption((option) => option.setName('mission_hop').setDescription('The Honor Point for every member of the mission (Khusus Special Raid / Misi dengan Rank diatas A+)').setRequired(false))
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName('finish')
			.setDescription('Finish the mission')
			.addStringOption((option) => option.setName('mission_id').setDescription('The ID of the mission').setRequired(true))
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName('list')
			.setDescription('List all mission')
			.addStringOption((option) =>
				option
					.setName('mission-type')
					.setDescription('The type of the mission')
					.setRequired(true)
					.addChoices([
						{ name: 'Sudah Selesai', value: 'finish' },
						{ name: 'Belum Selesai', value: 'unfinish' },
					])
			)
			.addStringOption((option) => option.setName('date').setDescription('The date of the mission (dd-mm-yyyy)').setRequired(false))
			.addIntegerOption((option) => option.setName('page').setDescription('The page of the mission').setRequired(false))
	);

export async function run({ interaction, client, handler }: SlashCommandProps) {
	const date =
		interaction.options.getString('date') ??
		new Date()
			.toLocaleDateString('id-ID', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			})
			.split('/')
			.join('-');

	const subcommand = interaction.options.getSubcommand();
	if (subcommand == 'create') {
		await createMission({ interaction, client, handler }, date);
	} else if (subcommand == 'finish') {
		await finishMission({ interaction, client, handler }, date);
	} else if (subcommand == 'list') {
		await listMission({ interaction, client, handler }, date);
	}
}

export const options = {
	staffOnly: {
		missionAdmin: ['694072836800774174', '511750157822328842', '1230491973970825338'],
		subcommand: ['create', 'finish', 'list'],
	},
};
