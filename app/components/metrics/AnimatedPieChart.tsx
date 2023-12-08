'use client';

import React from 'react';
import { PieChart, mangoFusionPalette } from '@mui/x-charts';
import statuses from '@/utils/statuses';
import { useTheme } from '@mui/material/styles';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Row, ChartData } from '@/types';

export default function AnimatedPieChart({ data }: { data: Row[] }) {
	const theme = useTheme();
	const colors = React.useMemo(
		() => mangoFusionPalette(theme.palette.mode),
		[theme.palette.mode]
	);

	const currentStatuses: Set<string> = new Set(); //all status currently present in table
	data.forEach((row) => {
		if (row.jobStatus) {
			currentStatuses.add(row.jobStatus);
		}
	});

	//shapes data for MUI Chart
	const defaultData = React.useMemo(() => {
		return statuses.map((status, index) => ({
			id: index,
			value: data.filter((job) => job.jobStatus === status).length,
			label: status,
			color: colors[index % colors.length],
			visible: true,
		}));
	}, [data, colors]);

	const [chartData, setChartData] = React.useState<ChartData[]>(defaultData);

	React.useEffect(() => {
		setChartData(defaultData);
	}, [data, defaultData]);

	const handleCheck = (
		e: React.SyntheticEvent<Element, Event>,
		checked: boolean
	) => {
		const { value } = e.target as HTMLInputElement;

		setChartData((prevChartData) => {
			return prevChartData.map((status) => {
				if (status.label === value) {
					return { ...status, visible: checked };
				} else return status;
			});
		});
	};

	const matchColor = (status: string) => {
		return chartData.find((row) => row.label === status)?.color;
	};

	return (
		<div className='h-full flex items-center py-6 justify-center mx-20'>
			<PieChart
				series={[
					{
						data: chartData.filter((data) => data.visible),
						highlightScope: { faded: 'global', highlighted: 'item' },
						faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
					},
				]}
				height={400}
				slotProps={{
					legend: {
						hidden: true,
					},
				}}
				padding={5}
				colors={mangoFusionPalette}
			/>
			<div className='flex flex-col min-w-max'>
				{Array.from(currentStatuses).map((status, index) => (
					<FormControlLabel
						onChange={handleCheck}
						key={status}
						control={
							<Checkbox
								defaultChecked
								value={status}
								sx={{
									color: matchColor(status),
									'&.Mui-checked': {
										color: matchColor(status),
									},
								}}
							/>
						}
						label={status}
					/>
				))}
			</div>
		</div>
	);
}
