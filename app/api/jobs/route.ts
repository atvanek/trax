import dbConnect from '@/db/dbConnect';
import jobModel from '@/db/models/job';
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export const POST = async (req: Request) => {
	await dbConnect();
	const { user } = (await getSession()) || {};

	if (!user) {
		return NextResponse.redirect('/');
	}

	const updatedJob = await req.json();
	console.log('updated:', updatedJob);

	const { id } = updatedJob;

	const result = await jobModel.findOneAndUpdate(
		{ userId: user.sub, id },
		{
			...updatedJob,
		},
		{ upsert: true, new: true }
	);
	console.log(result);

	return NextResponse.json('nice');
};
