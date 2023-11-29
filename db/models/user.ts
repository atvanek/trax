import { Schema, model, models, Document } from 'mongoose';
export interface IUser extends Document {
	email: string;
	userId: string;
	customColumns: string[];
}
const userSchema = new Schema<IUser>({
	email: { type: String, required: true, unique: true },
	userId: { type: String, required: true, unique: true },
	customColumns: [{ type: String }],
});

export default models.User || model<IUser>('User', userSchema);
