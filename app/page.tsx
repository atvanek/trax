import EnhancedTable from '@/app/components/table/EnhancedTable';
import mockData from './components/table/mockData';

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<h1>Trax</h1>
			<EnhancedTable data={mockData} />
		</main>
	);
}
