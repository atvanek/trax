import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import LoginButton from './components/LoginButton';
import { Paper } from '@mui/material';

export default async function Home() {
	const { user } = (await getSession()) || {};
	if (user) return redirect('/dashboard');
	return (
		<main className='flex min-h-screen flex-col items-center justify-center p-32'>
			<Paper className='p-12'>
				<div className=' w-full flex flex-nowrap items-center justify-center'>
					<iframe
						src='https://giphy.com/embed/WJZGlfRLpuv9cs6vAr'
						width='30'
						height='30'></iframe>
					<h1>Trax</h1>
				</div>
				<LoginButton />
			</Paper>
		</main>
	);
}
