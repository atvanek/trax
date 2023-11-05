'use client';
import { LinearProgress } from '@mui/material';

export default function TableSkeleton({ loaded }: { loaded: boolean }) {
	return (
		<div style={{ display: !loaded ? 'inline' : 'none', width: 100 + '%' }}>
			<LinearProgress />
		</div>
	);
}
