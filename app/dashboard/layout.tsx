import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import React from 'react';
import Nav from '../components/nav/Nav';
import { GridContextProvider } from '@/context/GridContext';
import getUser from '@/utils/getUser';

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

	//fetch user data
	const fetchedUser = await getUser(user.email);

	return (
		<GridContextProvider
			fetchedCustomColumns={fetchedUser?.customColumns || []} //initialize context with server-side data
		>
			<Nav
				user={user} //pass user data to nav for user settings
			/>
			{children}
		</GridContextProvider>
	);
}
