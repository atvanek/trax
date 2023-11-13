import { Box } from '@mui/material';
import { TabPanelProps } from '@/types';
import { useTheme } from '@mui/material/styles';

export default function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;
	const theme = useTheme();

	return (
		<div
			className='h-full'
			style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				visibility: value === index ? 'visible' : 'hidden',
				backgroundColor: theme.palette.background.paper,
			}}
			role='tabpanel'
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{<Box>{children}</Box>}
		</div>
	);
}
