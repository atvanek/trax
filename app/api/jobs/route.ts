import dbConnect from '@/db/dbConnect';
import jobModel, { IJob } from '@/db/models/job';
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export const POST = async (req: Request) => {
	await dbConnect();
	const { user } = (await getSession()) || {};

	if (!user) {
		return NextResponse.redirect('/');
	}

	const newJobs: Omit<IJob, 'userId'>[] = await req.json();
	console.log(newJobs);
	const newJobsWithIds = newJobs.map((job) => {
		return { ...job, userId: user.sub };
	}) as IJob[];
	const newRows = await jobModel.insertMany(newJobsWithIds);
	console.log(newRows);
	return NextResponse.json('');
};
