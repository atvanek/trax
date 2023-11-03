import mockData from '../utils/mockData';
import DataGridDemo from './components/table/DataGridDemo';

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<h1>Trax</h1>
			<DataGridDemo data={mockData} />
		</main>
	);
}
