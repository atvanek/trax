'use client';

import React from 'react';
import WithUILoading from './WithUILoading';
import Spinner from '../Spinner';
import Table from '../table/Table';
import AnimatedPieChart from '../metrics/AnimatedPieChart';
import { ListAlt, PieChart } from '@mui/icons-material';
import TabsContainer from '../tabs/TabsContainer';
import { Row } from '@/types';

export default function DashboardContainer({
	stringifiedData,
}: {
	stringifiedData: string;
}) {
	const [rows, setRows] = React.useState<Row[]>(JSON.parse(stringifiedData));

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
	const icons = [<ListAlt key='listAlt' />, <PieChart key='pieChart' />];

	return <TabsContainer tabs={tabs} icons={icons} />;
}
