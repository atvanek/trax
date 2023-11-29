import { Row } from '@/types';
import { IJob } from '@/db/models/job';

export default function createRows(rows: IJob[]): Row[] {
	// Map over the input array and filter out unnecessary fields
	const filteredRows = rows.map((job) => {
		// Destructure _id and __v from the job object
		const { _id, __v, ...filteredData } = job.toObject();
		// Add isNew property and set it to false
		return { ...filteredData, isNew: false };
	}) as Row[];

	// Return the sorted and processed rows
	return filteredRows;
}
