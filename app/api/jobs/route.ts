import dbConnect from '@/db/dbConnect';
import jobModel from '@/db/models/job';
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { Row } from '@/types';
import createRows from '@/utils/createRows';


export const DELETE = async (req: Request) => {
	await dbConnect();
	const { user } = (await getSession()) || {};

	if (!user) {
		return NextResponse.redirect('/');
	}

	const jobToDelete = await req.json();

	const { id } = jobToDelete;
	await jobModel.findOneAndDelete({ userId: user.sub, id });

	const rows = await jobModel.find({ userId: user.sub });

	return NextResponse.json(createRows(rows));
};