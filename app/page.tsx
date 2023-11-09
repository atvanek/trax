import Link from 'next/link';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function Home() {
	const { user } = (await getSession()) || {};
	if (user) return redirect('/dashboard');
	return (
		<main className='flex min-h-screen flex-col items-center justify-center p-32'>
			<div className=' w-full flex flex-nowrap items-center justify-center'>
				<iframe
					src='https://giphy.com/embed/WJZGlfRLpuv9cs6vAr'
					width='30'
					height='30'></iframe>
				<h1>Trax</h1>
			</div>

			<p>
				<a href='https://giphy.com/gifs/transparent-WJZGlfRLpuv9cs6vAr'></a>
			</p>
			<p>
				<Link href='/api/auth/login'>Login</Link>
			</p>
		</main>
	);
}
