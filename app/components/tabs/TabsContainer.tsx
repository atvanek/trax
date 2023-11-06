'use client';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CustomTabPanel from './CustomTabPanel';

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function TabsContainer({ tabs }: { tabs: JSX.Element[] }) {
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label='tabs'
					variant='fullWidth'>
					{tabs.map((tab, index) => {
						return <Tab key={tab.key} label={tab.key} {...a11yProps(index)} />;
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
