import { Schema, model, models, Document } from 'mongoose';

export interface IJob extends Document {
	userId: string;
	date?: Date;
	company?: string;
	jobTitle?: string;
	compensation?: string;
	location?: string;
	jobStatus?: string;
	jobURL?: string;
	contactName?: string;
	notes?: string;
	id: string;
}
const jobSchema = new Schema<IJob>(
	{
		userId: { type: String, required: true },
		date: Date,
		company: String,
		jobTitle: String,
		compensation: String,
		location: String,
		jobStatus: String,
		jobURL: String,
		contactName: String,
		notes: String,
		id: { type: String, unique: true, required: true },
	},
	{ strict: false }
);

export default models.Job || model<IJob>('Job', jobSchema);
