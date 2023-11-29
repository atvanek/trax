'use client';

import { CircularProgress } from '@mui/material';

export default function LoaderBar({ mounted }: { mounted: boolean }) {
	return (
		<div
			style={{ display: mounted ? 'none' : 'flex' }}
			className='flex justify-center items-center mt-64'>
			<CircularProgress disableShrink size={60} />
		</div>
	);
}
