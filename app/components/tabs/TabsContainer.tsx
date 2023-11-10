'use client';

import * as React from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import CustomTabPanel from './CustomTabPanel';

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function TabsContainer({
	tabs,
	icons,
}: {
	tabs: JSX.Element[];
	icons: JSX.Element[];
}) {
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%', height: '100%' }}>
			<Box
				sx={{
					borderBottom: 1,
					borderColor: 'divider',
				}}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label='tabs'
					variant='fullWidth'>
					{tabs.map((tab, index) => {
						return (
							<Tab
								key={tab.key}
								label={tab.key}
								icon={icons[index]}
								iconPosition='start'
								{...a11yProps(index)}
							/>
						);
					})}
				</Tabs>
			</Box>
			{tabs.map((tab, index) => {
				return (
					<CustomTabPanel value={value} index={index} key={index}>
						{tab}
					</CustomTabPanel>
				);
			})}
		</Box>
	);
}
