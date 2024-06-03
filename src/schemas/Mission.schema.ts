import mongoose from 'mongoose';
const { Schema } = mongoose;

export default new Schema({
	date: {
		type: String,
		required: true,
	},
	missionId: {
		type: String,
		required: true,
		unique: true,
	},
	missionRank: {
		type: String,
		required: true,
	},
	missionCreator: {
		type: String,
		required: true,
	},
	missionDescription: {
		type: String,
		required: true,
	},
	missionLeader: {
		type: String,
		required: true,
	},
	missionMember: {
		type: [String],
		required: true,
	},
	missionHoP: {
		type: Number,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	finish: {
		type: Boolean,
		required: true,
	},
});
