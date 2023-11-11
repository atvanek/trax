import { Schema, model, models, Document } from 'mongoose';

export interface IJob extends Document {
	userId: string;
	date: Date;
	company: string;
	jobTitle: string;
	compensation: string;
	location: string;
	jobStatus: string;
	rating: number;
	jobURL: string;
	contactName: string;
	notes: string;
	id: string;

}
const jobSchema = new Schema<IJob>({
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

export default models.Job || model<IJob>('Job', jobSchema);
