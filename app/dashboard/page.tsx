import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import WithUILoading from '../components/containers/WithUILoading';
import Table from '../components/table/Table';
import mockData from '@/utils/mockData';
import Spinner from '../components/Spinner';
export default async function Dashboard() {
	const { user } = (await getSession()) || {};
	return user ? (
		<WithUILoading
			fallback={Spinner}
			component={Table}
			componentProps={{ data: mockData }}
			fallbackProps={null}
		/>
	) : (
		redirect('/')
	);
}
