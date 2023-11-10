import 'server-only';

import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import WithUILoading from '../components/containers/WithUILoading';
import Table from '../components/table/Table';
// import mockData from '@/utils/mockData';
import Spinner from '../components/Spinner';
import TabsContainer from '../components/tabs/TabsContainer';
import Nav from '../components/Nav';
import AnimatedPieChart from '../components/metrics/AnimatedPieChart';
import { PieChart, ListAlt } from '@mui/icons-material';
import dbConnect from '@/db/dbConnect';
import userModel from '@/db/models/user';
import jobModel from '@/db/models/job';

export default async function Dashboard() {
	//get user from server session
	const { user } = (await getSession()) || {};

	//redirect if not authorized
	if (!user) {
		return redirect('/');
	}

	//check if user exists in mongo cluster
	const getUser = async (email: string) => {
		await dbConnect();
		const user = await userModel.findOne({ email });
		return user?.userId;
	};

	//add new user to mongo cluster
	const addUser = async (email: string) => {
		await dbConnect();
		const addedUser = await userModel.create({ email, userId: user.sub });
		console.log('added user', addedUser);
		return addedUser;
	};

	//get all jobs
	const getJobs = async (userId: string) => {
		await dbConnect();
		const jobs = await jobModel.find({ userId });
		console.log('jobs:', jobs);
		return jobs;
	};

	const userId = (await getUser(user.email)) || (await addUser(user.email));

	const data = await getJobs(userId);
	const tabs = [
		<WithUILoading
			fallback={Spinner}
			component={Table}
			componentProps={{ data }}
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
