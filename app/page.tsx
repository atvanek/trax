import mockData from '../utils/mockData';
import Grid from './components/table/Grid';
import { getSession } from '@auth0/nextjs-auth0';
import Link from 'next/link';

export default async function Home() {
	const { user } = (await getSession()) || {};
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-32'>
			{user ? (
				<Grid data={mockData} />
			) : (
				<p>
					Please <Link href='/api/auth/login'>login</Link>
				</p>
			)}
		</main>
	);
}
