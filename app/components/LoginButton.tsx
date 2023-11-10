'use client';

import React from 'react';
import { Button, Backdrop, CircularProgress } from '@mui/material';

export default function LoginButton() {
	const [loggingIn, setLoggingIn] = React.useState(false);
	const [mounted, setMounted] = React.useState(false);
	React.useLayoutEffect(() => {
		setMounted(true);
	}, []);
	return (
		<>
			{mounted && (
				<Backdrop open={loggingIn}>
					<CircularProgress color='primary' />
				</Backdrop>
			)}

			<Button
				disabled={loggingIn}
				href='api/auth/login'
				onClick={() => setLoggingIn(true)}
				variant='contained'>
				Login
			</Button>
		</>
	);
}
