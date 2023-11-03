import { RawJobData, Status } from '@/types';

const mockData: RawJobData[] = [];

for (let i = 0; i < 50; i++) {
	const year = 2023;
	const month = Math.floor(Math.random() * 12) + 1; // Random month (1-12)
	const day = Math.floor(Math.random() * 31) + 1; // Random day (1-31)
	const date = `${month}/${day}/${year}`;
	const company = `Company ${i + 1}`;
	const jobTitle = `Job Title ${i + 1}`;
	const compensation = generateRandomCompensation();
	const location = 'remote';
	const jobURL = 'www.linkedin.com';
	const id = generateUniqueID(mockData);

	const statuses: Status[] = [
		'ready to apply',
		'applied',
		'followed-up',
		'phone-screen',
		'technical',
		'final round/onsite',
		'offer',
		'negotiation',
		'signed',
		'rejected',
		'declined',
		'lost contact',
		'no-response',
	];

	const status = statuses[Math.floor(Math.random() * statuses.length)];

	mockData.push({
		date,
		company,
		jobTitle,
		compensation,
		location,
		status,
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

function generateRandomCompensation() {
	const types = ['hourly', 'annual'];
	const selectedType = types[Math.floor(Math.random() * types.length)];

	if (selectedType === 'hourly') {
		const value = Math.floor(Math.random() * 100) + 1; // Random value between 1 and 100
		return `$${value}/hr`;
	} else {
		const min = Math.floor(Math.random() * 50000) + 50000; // Random compensation between $50,000 and $99,999
		const max = Math.floor(Math.random() * 40000) + min; // Random compensation between min and min + $40,000
		return `$${min.toLocaleString()}-${max.toLocaleString()}/yr`;
	}
}

console.log(mockData);

export default mockData;
