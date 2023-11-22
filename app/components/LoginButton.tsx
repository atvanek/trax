'use client';

import React from 'react';
import { Button, Backdrop, CircularProgress } from '@mui/material';
import useMounted from '@/hooks/useMounted';

export default function LoginButton() {
	const [loggingIn, setLoggingIn] = React.useState(false);
	const { mounted, setMounted } = useMounted();

	React.useLayoutEffect(() => {
		setMounted(true);
	}, [setMounted]);

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
