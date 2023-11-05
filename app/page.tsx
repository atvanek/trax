import Link from 'next/link';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function Home() {
	const { user } = (await getSession()) || {};
	if (user) return redirect('/dashboard');
	return (
		<main className='flex min-h-screen flex-col items-center justify-center p-32'>
			<h1>Trax</h1>
			<p>
				<Link href='/api/auth/login' className='text-indigo-600'>
					Login
				</Link>
			</p>
		</main>
	);
}
