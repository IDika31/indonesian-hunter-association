import { Schema } from 'mongoose';

export default new Schema({
	userId: { type: String, required: true },
	pg: { type: Number, default: 0 },
});
