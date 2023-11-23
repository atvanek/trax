import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import React from 'react';
import Nav from '../components/nav/Nav';
import { CustomColumnContextProvider } from '@/context/customColumnContext';
import dbConnect from '@/db/dbConnect';
import { IUser } from '@/db/models/user';
import userModel from '@/db/models/user';

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

	const getUser = async (email: string): Promise<IUser | null> => {
		await dbConnect();
		const user: IUser | null = await userModel.findOne({ email });
		return user ? user : null;
	};

	const fetchedUser = await getUser(user.email);

	return (
		<CustomColumnContextProvider
			fetchedCustomColumns={fetchedUser?.customColumns || []}>
			<Nav user={user} />
			{children}
		</CustomColumnContextProvider>
	);
}
