'use client';

import React from 'react';
import WithUILoading from '../../components/containers/WithUILoading';
import Spinner from '../../components/Spinner';
import TableContainer from '@/app/components/table/containers/TableContainer';
import AnimatedPieChart from '../../components/metrics/AnimatedPieChart';
import { ListAlt, PieChart, CloudUpload } from '@mui/icons-material';
import TabsContainer from '../../components/tabs/TabsContainer';
import { Row } from '@/types';
import { IJob } from '@/db/models/job';
import { IUser } from '@/db/models/user';
import ImporterDialog from '@/app/components/importer/ImporterDialog';

export default function DashboardContainer({
	stringifiedData,
}: {
	stringifiedData: string;
}) {
	const parsedData: {
		rows: IJob[];
		userData: IUser;
	} = JSON.parse(stringifiedData);
	const [rows, setRows] = React.useState<Row[]>(parsedData.rows);

	const tabs = [
		<WithUILoading
			fallback={Spinner}
			component={TableContainer}
			componentProps={{ rows, setRows, userData: parsedData.userData }}
			fallbackProps={null}
			key='Table View'
		/>,
		<AnimatedPieChart key='Metrics' data={rows} />,
		<ImporterDialog key='Import' index={2} />,
	];
	const icons = [
		<ListAlt key='listAlt' />,
		<PieChart key='pieChart' />,
		<CloudUpload key='cloudUpload' />,
	];

	return <TabsContainer tabs={tabs} icons={icons} />;
}
