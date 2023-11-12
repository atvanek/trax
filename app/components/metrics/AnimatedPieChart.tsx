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

	const defaultData = React.useMemo(() => {
		return statuses.map((status, index) => ({
			id: index,
			value:
				(data.filter((job) => job.jobStatus === status).length / data.length) *
				100,
			label: status,
			color: colors[index % colors.length],
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
			if (!checked) {
				return prevChartData.filter((status) => status.label !== value);
			} else {
				const status = defaultData.find((status) => status.label === value);
				if (status) {
					return [...prevChartData, status] as ChartData[];
				}
			}
			return prevChartData;
		});
	};

	return (
		<div className='h-full flex items-center py-6 justify-center mx-20'>
			<PieChart
				series={[
					{
						data: chartData,
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
				{statuses.map((status, index) => (
					<FormControlLabel
						onChange={handleCheck}
						key={index}
						control={
							<Checkbox
								defaultChecked
								value={status}
								sx={{
									color: colors[index % colors.length],
									'&.Mui-checked': {
										color: colors[index % colors.length],
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
