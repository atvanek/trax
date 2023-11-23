import dbConnect from '@/db/dbConnect';
import userModel from '@/db/models/user';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
	await dbConnect();
	const { user } = (await getSession()) || {};

	if (!user) {
		return NextResponse.redirect('/');
	}
	try {
		const newColumn = await req.json();

		const newUserData = await userModel.findOneAndUpdate(
			{ userId: user.sub },
			{ $addToSet: { customColumns: newColumn } },
			{
				new: true,
			}
		);
		return NextResponse.json({ customColumns: newUserData.customColumns });
	} catch (error) {
		return NextResponse.json({ error });
	}
};

export const DELETE = async (req: Request) => {
	await dbConnect();
	const { user } = (await getSession()) || {};

	if (!user) {
		return NextResponse.redirect('/');
	}
	try {
		const columnToDelete: { id: string } = await req.json();

		await userModel.findOneAndUpdate(
			{
				userId: user.sub,
			},
			{
				$pull: { customColumns: columnToDelete.id },
			}
		);

		return NextResponse.json({});
	} catch (error) {
		return NextResponse.json({ error });
	}
};
