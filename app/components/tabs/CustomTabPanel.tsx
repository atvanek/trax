import { Box } from '@mui/material';
import { TabPanelProps } from '@/types';

export default function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			className='h-full'
			role='tabpanel'
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			style={{ display: value === index ? 'block' : 'none' }}
			{...other}>
			<Box>{children}</Box>
		</div>
	);
}
