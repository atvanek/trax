import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import WithUILoading from '../components/containers/WithUILoading';
import Table from '../components/table/Table';
import Spinner from '../components/Spinner';
import TabsContainer from '../components/tabs/TabsContainer';
import Nav from '../components/Nav';
import AnimatedPieChart from '../components/metrics/AnimatedPieChart';
import { PieChart, ListAlt } from '@mui/icons-material';
import dbConnect from '@/db/dbConnect';
import userModel, { IUser } from '@/db/models/user';
import jobModel, { IJob } from '@/db/models/job';
import { Row } from '@/types';

export default async function Dashboard() {
	// Get user from server session
	const { user } = (await getSession()) || {};

	// Redirect if not authorized
	if (!user) {
		return redirect('/');
	}

	// Check if user exists in the MongoDB cluster
	const getUser = async (email: string): Promise<string | null> => {
		await dbConnect();
		const user: IUser | null = await userModel.findOne({ email });
		return user ? user.userId : null;
	};

	// Add new user to MongoDB cluster
	const addUser = async (email: string): Promise<IUser> => {
		await dbConnect();
		const addedUser: IUser = await userModel.create({
			email,
			userId: user.sub,
		});
		console.log('added user', addedUser);
		return addedUser;
	};

	// Get all jobs
	const getJobs = async (userId: string): Promise<IJob[]> => {
		await dbConnect();
		const jobs: IJob[] = await jobModel.find({ userId });
		console.log('jobs:', jobs);
		return jobs;
	};

	const userId =
		(await getUser(user.email)) || (await addUser(user.email)).userId;

	const data = await getJobs(userId);

	//prepare data for client grid
	const rows: Row[] = data.map((job) => {
		//filter out unneeded field and convert document to POJO
		const { _id, __v, ...filteredData } = job.toObject();
		//add isNew property for cancelling new rows
		return { ...filteredData, isNew: false };
	});

	const tabs = [
		<WithUILoading
			fallback={Spinner}
			component={Table}
			componentProps={{ data: rows }}
			fallbackProps={null}
			key='Table View'
		/>,
		<AnimatedPieChart key='Metrics' />,
	];
	const icons = [<ListAlt key={0} />, <PieChart key={1} />];

	return (
		<>
			<Nav user={user} />
			<TabsContainer tabs={tabs} icons={icons} />
		</>
	);
}
