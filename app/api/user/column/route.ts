import dbConnect from '@/db/dbConnect';
import userModel from '@/db/models/user';
import jobModel from '@/db/models/job';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

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
		console.log(newUserData);
		return NextResponse.json({ ok: true, customColumns: newUserData.customColumns });
	} catch (err) {
		return NextResponse.json({ ok: false });
	}
};
