'use client';
import React from 'react';
import WithUILoading from './WithUILoading';
import Spinner from '../Spinner';
import Table from '../table/Table';
import AnimatedPieChart from '../metrics/AnimatedPieChart';
import { ListAlt, PieChart } from '@mui/icons-material';
import Nav from '../Nav';
import TabsContainer from '../tabs/TabsContainer';
import { Claims } from '@auth0/nextjs-auth0';
import { Row } from '@/types';
import ImporterDialog from '../importer/ImporterDialog';

export default function DashboardContainer({
	stringifiedData,
	user,
}: {
	stringifiedData: string;
	user: Claims;
}) {
	const [rows, setRows] = React.useState<Row[]>(JSON.parse(stringifiedData));
	const [importerOpen, setImporterOpen] = React.useState(false);
	const tabs = [
		<WithUILoading
			fallback={Spinner}
			component={Table}
			componentProps={{ rows, setRows }}
			fallbackProps={null}
			key='Table View'
		/>,
		<AnimatedPieChart key='Metrics' data={rows} />,
	];
	const icons = [<ListAlt key={0} />, <PieChart key={1} />];

	return (
		<>
			<Nav
				user={user}
				importerOpen={importerOpen}
				setImporterOpen={setImporterOpen}
			/>
			<TabsContainer tabs={tabs} icons={icons} />
			<ImporterDialog importerOpen={importerOpen} setImporterOpen={setImporterOpen} />
		</>
	);
}
