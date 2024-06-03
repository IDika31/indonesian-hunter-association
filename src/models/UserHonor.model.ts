import mongoose from 'mongoose';
import UserHonorSchema from '../schemas/UserHonor.schema';
const { model } = mongoose;

export default model('UserHonor', UserHonorSchema);
