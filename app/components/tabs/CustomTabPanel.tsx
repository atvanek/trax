import { Box } from '@mui/material';
import { TabPanelProps } from '@/types';

export default function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			className='h-full'
			hidden={value !== index}
			role='tabpanel'
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box>{children}</Box>}
		</div>
	);
}
