import { Schema, model, models, InferSchemaType, Model } from 'mongoose';

const JobSchema = new Schema({
	userId: String,
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
	id: String,
});

export type Job = InferSchemaType<typeof JobSchema>;

export default models.Job || model<Job>('Job', JobSchema);
