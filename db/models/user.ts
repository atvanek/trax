import { Schema, model, models, InferSchemaType } from 'mongoose';

const UserSchema = new Schema({
	email: { type: String, required: true },
	userId: { type: String, required: true },
});

export type User = InferSchemaType<typeof UserSchema>;

export default models.User || model('User', UserSchema);
