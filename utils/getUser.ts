import { IUser } from '@/db/models/user';
import dbConnect from '@/db/dbConnect';
import userModel from '@/db/models/user';

const getUser = async (email: string): Promise<IUser | null> => {
	await dbConnect();
	const user: IUser | null = await userModel.findOne({ email });
	return user ? user : null;
};

export default getUser;
