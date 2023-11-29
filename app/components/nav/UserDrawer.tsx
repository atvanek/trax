import React from 'react';
import { useTheme } from '@mui/material';
import {
	Drawer,
	Container,
	Avatar,
	Typography,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import Link from 'next/link';
import { Logout } from '@mui/icons-material';
import { Claims } from '@auth0/nextjs-auth0';

export default function UserDrawer({
	userMenuOpen,
	user,
	setUserMenuOpen,
}: {
	userMenuOpen: boolean;
	user: Claims;
	setUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const theme = useTheme();

	return (
		<Drawer
			open={userMenuOpen}
			anchor='right'
			onClose={() => setUserMenuOpen(false)}
			sx={{ p: 3 }}>
			<Container
				sx={{
					display: 'flex',
					flexFlow: 'column',
					alignItems: 'center',
					paddingY: '20px',
					backgroundColor: theme.palette.action.hover,
				}}>
				<Avatar
					alt='User Image'
					src={user.picture}
					rel='noreferrer'
					sx={{ alignSelf: 'center', m: 1 }}
				/>
				<Typography sx={{ alignSelf: 'center' }}>{user.name}</Typography>
				<Typography color='GrayText'>{user.email}</Typography>
			</Container>
			<List>
				<Link href={'/api/auth/logout'}>
					<ListItemButton>
						<ListItemIcon>
							<Logout />
						</ListItemIcon>
						<ListItemText>Logout</ListItemText>
					</ListItemButton>
				</Link>
			</List>
		</Drawer>
	);
}
