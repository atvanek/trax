import mockData from '../utils/mockData';
import Grid from './components/table/Grid';

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<h1>Trax</h1>
			<Grid data={mockData} />
		</main>
	);
}
