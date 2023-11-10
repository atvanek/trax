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
import userModel from '@/db/models/user';
import jobModel from '@/db/models/job';
import { User } from '../../db/models/user';

export default async function Dashboard() {
	// Get user from server session
	const { user } = (await getSession()) || {};

	// Redirect if not authorized
	if (!user) {
		return redirect('/');
	}

	// Check if user exists in the MongoDB cluster
	const getUser = async (email: string): Promise<string | null | undefined> => {
		await dbConnect();
		const user: User | null | undefined = await userModel.findOne({ email });
		return user?.userId;
	};

	// Add new user to MongoDB cluster
	const addUser = async (email: string) => {
		await dbConnect();
		const addedUser = await userModel.create({ email, userId: user.sub });
		console.log('added user', addedUser);
		return addedUser;
	};

	// Get all jobs
	const getJobs = async (userId: string) => {
		await dbConnect();
		const jobs = await jobModel.find({ userId });
		console.log('jobs:', jobs);
		return jobs;
	};

	const userId =
		(await getUser(user.email)) || (await addUser(user.email)).userId;

	const data = await getJobs(userId);

	const filteredData = data.map((job) => {
		const { _id, __v, ...filtered } = job.toObject(); // Use toObject() to get raw data
		return filtered;
	});

	const tabs = [
		<WithUILoading
			fallback={Spinner}
			component={Table}
			componentProps={{ data: filteredData }}
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
