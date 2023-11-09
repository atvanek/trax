'use client';

import React from 'react';
import { PieChart, mangoFusionPalette } from '@mui/x-charts';
import mockData from '@/utils/mockData';
import statuses from '@/utils/statuses';
import { useTheme } from '@mui/material/styles';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Status } from '@/types';

export default function AnimatedPieChart() {
	const theme = useTheme();
	const colors = mangoFusionPalette(theme.palette.mode);

	const getPercentage = React.useCallback((status: Status) => {
		return (
			(mockData.filter((job) => job.status === status).length /
				mockData.length) *
			100
		);
	}, []);

	const defaultData = React.useMemo(() => {
		return statuses.map((status, index) => ({
			id: index,
			value: getPercentage(status),
			label: status,
			color: colors[index % colors.length],
		}));
	}, [colors, getPercentage]);

	const [data, setData] = React.useState(defaultData);

	const handleCheck = (
		e: React.SyntheticEvent<Element, Event>,
		checked: boolean
	) => {
		const { value } = e.target as HTMLInputElement;
		if (!checked) {
			const newData = data.filter((status) => status.label !== value);
			setData(newData);
		} else {
			const status = defaultData.find((status) => status.label === value);
			if (status) {
				const newData = [...data, status];
				setData(newData);
			}
		}
	};

	return (
		<div className='h-full flex items-center py-20 justify-center'>
			<PieChart
				series={[
					{
						data,
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
			<div className='flex flex-col'>
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
