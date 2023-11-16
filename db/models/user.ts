import { Schema, model, models, Document } from 'mongoose';
export interface IUser extends Document {
	email: string;
	userId: string;
}
const userSchema = new Schema<IUser>({
	email: { type: String, required: true, unique: true },
	userId: { type: String, required: true, unique: true },
});

export default models.User || model<IUser>('User', userSchema);
