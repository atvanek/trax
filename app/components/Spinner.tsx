'use client';

import { CircularProgress } from '@mui/material';

export default function LoaderBar({ loaded }: { loaded: boolean }) {
	return (
		<div
			style={{ display: loaded ? 'none' : 'flex' }}
			className='flex justify-center items-center mt-64'>
			<CircularProgress disableShrink size={60} />
		</div>
	);
}
