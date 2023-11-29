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

	try {
		const updatedJob = await req.json();

		const { id } = updatedJob;

		const update = await jobModel.findOneAndUpdate(
			{ userId: user.sub, id },
			{
				...updatedJob,
			},
			{ upsert: true, new: true }
		);

		const rows = await jobModel.find({ userId: user.sub });

		return NextResponse.json({ rows: createRows(rows) });
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
		const jobToDelete = await req.json();

		const { id } = jobToDelete;
		await jobModel.findOneAndDelete({ userId: user.sub, id });

		const rows = await jobModel.find({ userId: user.sub });

		return NextResponse.json({ rows: createRows(rows) });
	} catch (error) {
		return NextResponse.json({ error });
	}
};
