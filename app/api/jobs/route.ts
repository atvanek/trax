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
		const userId = user.sub;
		const newJobs: Omit<IJob, 'userId'>[] = await req.json();
		const newJobsWithIds = newJobs.map((job) => {
			return { ...job, userId };
		}) as IJob[];
		await jobModel.insertMany(newJobsWithIds);
		const rows = await jobModel.find({ userId });
		return NextResponse.json({ rows: createRows(rows) });
	} catch (error) {
		NextResponse.json({ error });
	}
};
