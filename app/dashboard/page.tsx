import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import WithUILoading from '../components/containers/WithUILoading';
import Table from '../components/table/Table';
import mockData from '@/utils/mockData';
import Spinner from '../components/Spinner';
import TabsContainer from '../components/tabs/TabsContainer';
import Nav from '../components/Nav';
export default async function Dashboard() {
	const { user } = (await getSession()) || {};
	const tabs = [
		<WithUILoading
			fallback={Spinner}
			component={Table}
			componentProps={{ data: mockData }}
			fallbackProps={null}
			key='Table View'
		/>,
		<div key='Status View'>Status View</div>,
		<div key='Metrics'>Metrics</div>,
	];
	return user ? (
		<>
			<Nav user={user} />
			<TabsContainer tabs={tabs} />
		</>
	) : (
		redirect('/')
	);
}
