import { RawJobData } from '@/types';

const mockData: RawJobData[] = [];

for (let i = 0; i < 50; i++) {
	const year = 2023;
	const month = Math.floor(Math.random() * 12) + 1; // Random month (1-12)
	const day = Math.floor(Math.random() * 31) + 1; // Random day (1-31)

	const date = `${month}/${day}/${year}`;
	const company = `Company ${i + 1}`;
	const jobTitle = `Job Title ${i + 1}`;
	const compensation = Math.floor(Math.random() * 50000) + 50000; // Random compensation between $50,000 and $99,999
	const location = 'remote';
	const jobURL = 'www.linkedin.com';
	const id = generateUniqueID(mockData);

	mockData.push({
		date,
		company,
		jobTitle,
		compensation,
		location,
		jobURL,
		id,
	});
}

function generateUniqueID(existingRows: RawJobData[]) {
	let uniqueID: number;
	do {
		uniqueID = Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number
	} while (existingRows.some((row) => row.id === uniqueID));

	return uniqueID;
}

export default mockData;
