import { NextResponse } from 'next/server';
import dbConnect from '@/db/dbConnect';
import user from '@/db/models/user';



export const POST = async (req: Request) => {
	await dbConnect();
	const { email } = await req.json();
	return NextResponse.json(email);
};
