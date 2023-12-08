'use client';

import * as React from 'react';
import { Tab, Tabs, Box, Drawer, Tooltip, Button } from '@mui/material';
import TabPanel from './TabPanel';
import { Add, FileDownload } from '@mui/icons-material';
import GridContext from '@/context/GridContext';
import { GridRowModelUpdate } from '@mui/x-data-grid';
import { Row } from '@/types';

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function Sidebar({
	tabs,
	icons,
	setRows,
}: {
	tabs: JSX.Element[];
	icons: JSX.Element[];
	setRows: React.Dispatch<React.SetStateAction<Row[]>>;
}) {
	const handleChange = (event: React.SyntheticEvent, newTabIndex: number) => {
		setCurrentTabIndex(newTabIndex);
	};
	const { apiRef, currentTabIndex, setCurrentTabIndex } =
		React.useContext(GridContext);

	const handleAddRow = React.useCallback(() => {
		const newRowId = crypto.randomUUID();
		setCurrentTabIndex(0);
		apiRef?.current.setSortModel([{ field: 'date', sort: 'desc' }]);
		const newRow: GridRowModelUpdate = {
			id: newRowId,
			isNew: true,
			date: new Date(),
			jobStatus: 'ready to apply',
		};
		apiRef?.current.updateRows([newRow]);
		apiRef?.current.setPage(0);
		apiRef?.current.startRowEditMode({ id: newRowId });
		apiRef?.current.startCellEditMode({ id: newRowId, field: 'date' });
	}, [apiRef, setCurrentTabIndex]);

	return (
		<Box sx={{ width: '100%', height: '100%' }}>
			<Drawer open variant='permanent'>
				<Box
					sx={{
						borderBottom: 1,
						borderColor: 'divider',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						py: 5,
					}}>
					<Tooltip title='Add Row' placement='right'>
						<Button onClick={handleAddRow}>
							<Add />
						</Button>
					</Tooltip>
				</Box>
				<Box>
					<Tabs
						orientation='vertical'
						value={currentTabIndex}
						onChange={handleChange}
						aria-label='tabs'
						variant='fullWidth'>
						{tabs.map((tab, index) => {
							return (
								<Tooltip
									title={tab.key}
									key={`${tab.key}-tab`}
									placement='right'>
									<Tab
										// label={tab.key}
										icon={icons[index]}
										iconPosition='start'
										{...a11yProps(index)}
									/>
								</Tooltip>
							);
						})}
					</Tabs>
				</Box>
				<Box
					sx={{
						borderTop: 1,
						borderColor: 'divider',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						py: 5,
					}}>
					<Tooltip title='Export to CSV' placement='right'>
						<Button onClick={() => apiRef?.current.exportDataAsCsv()}>
							<FileDownload />
						</Button>
					</Tooltip>
				</Box>
			</Drawer>
			{tabs.map((tab, index) => {
				return (
					<TabPanel
						currentTabIndex={currentTabIndex}
						index={index}
						key={'panel' + index}>
						{tab}
					</TabPanel>
				);
			})}
		</Box>
	);
}
