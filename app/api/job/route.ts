import dbConnect from '@/db/dbConnect';
import jobModel from '@/db/models/job';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import createRows from '@/utils/createRows';

export const POST = async (req: Request) => {
	await dbConnect();
	const { user } = (await getSession()) || {};

	if (!user) {
		return NextResponse.redirect('/');
	}

	const updatedJob = await req.json();

	const { id } = updatedJob;

	await jobModel.findOneAndUpdate(
		{ userId: user.sub, id },
		{
			...updatedJob,
		},
		{ upsert: true, new: true }
	);

	const rows = await jobModel.find({ userId: user.sub });

	return NextResponse.json(createRows(rows));
};
