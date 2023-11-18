import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import React from 'react';
import Nav from '../components/Nav';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Get user from server session
	const { user } = (await getSession()) || {};

	// Redirect if not authorized
	if (!user) {
		return redirect('/');
	}

	return (
		<>
			<Nav user={user} />
			{children}
		</>
	);
}
