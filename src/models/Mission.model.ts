import mongoose from 'mongoose';
import MissionSchema from '../schemas/Mission.schema';
const { model } = mongoose;

export default model('Mission', MissionSchema);
