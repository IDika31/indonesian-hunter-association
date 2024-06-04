import { model } from 'mongoose';
import UserBalanceSchema from '../schemas/UserBalance.schema';

export default model('UserBalance', UserBalanceSchema);
