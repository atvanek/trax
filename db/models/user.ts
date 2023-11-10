import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
	email: { type: String, required: true },
	jobs: [
		{
			date: Date,
			company: String,
			jobTitle: String,
			compensation: String,
			location: String,
			jobStatus: String,
			rating: Number,
			jobURL: String,
			contactName: String,
			notes: String,
			id: Schema.Types.UUID,
		},
	],
});

export default models.User || model('User', UserSchema);
