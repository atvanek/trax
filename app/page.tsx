import Link from 'next/link';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function Home() {
	const { user } = (await getSession()) || {};
	if (user) return redirect('/dashboard');
	return (
		<main className='flex min-h-screen flex-col items-center justify-center p-32'>
			<p>
				Please <Link href='/api/auth/login'>login</Link>
			</p>
		</main>
	);
}
