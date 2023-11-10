import dbConnect from '@/db/dbConnect';
import jobModel from '@/db/models/job';
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { Row } from '@/types';

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

	const newData = await jobModel.find({ userId: user.sub });
	const rows: Row[] = newData.map((job) => {
		//filter out unneeded field and convert document to POJO
		const { _id, __v, ...filteredData } = job.toObject();
		//add isNew property for cancelling new rows
		return { ...filteredData, isNew: false };
	});

	return NextResponse.json(rows);
};

export const DELETE = async (req: Request) => {
	await dbConnect();
	const { user } = (await getSession()) || {};

	if (!user) {
		return NextResponse.redirect('/');
	}

	const jobToDelete = await req.json();

	const { id } = jobToDelete;
	await jobModel.findOneAndDelete({ userId: user.sub, id });
	console.log('deleted');
	const newData = await jobModel.find({ userId: user.sub });
	const rows: Row[] = newData.map((job) => {
		//filter out unneeded field and convert document to POJO
		const { _id, __v, ...filteredData } = job.toObject();
		//add isNew property for cancelling new rows
		return { ...filteredData, isNew: false };
	});
	return NextResponse.json(rows);
};
