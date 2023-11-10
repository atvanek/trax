import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
	email: { type: String, required: true },
	userId: { type: String },
});

export default models.User || model('User', UserSchema);
