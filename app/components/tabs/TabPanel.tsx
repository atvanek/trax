import { Box } from '@mui/material';
import { TabPanelProps } from '@/types';
import { useTheme } from '@mui/material/styles';

export default function TabPanel(props: TabPanelProps) {
	const { children, currentTabIndex, index, ...other } = props;
	const theme = useTheme();

	return (
		<div
			className='h-full'
			style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				visibility: currentTabIndex === index ? 'visible' : 'hidden',
				backgroundColor: theme.palette.background.paper,
				paddingTop: 64,
				paddingLeft: 80,
			}}
			role='tabpanel'
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{<Box>{children}</Box>}
		</div>
	);
}
