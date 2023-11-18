import dbConnect from '@/db/dbConnect';
import jobModel, { IJob } from '@/db/models/job';
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import createRows from '@/utils/createRows';

export const POST = async (req: Request) => {
	await dbConnect();
	const { user } = (await getSession()) || {};

	if (!user) {
		return NextResponse.redirect('/');
	}
	try {
		const newJobs: Omit<IJob, 'userId'>[] = await req.json();
		const newJobsWithIds = newJobs.map((job) => {
			return { ...job, userId: user.sub };
		}) as IJob[];
		const newRows = await jobModel.insertMany(newJobsWithIds);
		return NextResponse.json({ newRows: createRows(newRows) });
	} catch (error) {
		NextResponse.json({ error });
	}
};
