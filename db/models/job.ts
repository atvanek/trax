import { Schema, model, models } from 'mongoose';

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

export default models.Job || model('Job', JobSchema);
