'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Link from 'next/link';
import { Claims } from '@auth0/nextjs-auth0';
import ColorModeSwitch from '../ColorModeSwitch';
import UserDrawer from './UserDrawer';

const pages = [
	{ label: 'FAQ', href: null },
	{ label: 'Documentation', href: null },
	{ label: 'Contact', href: null },
];

export default function Nav({ user }: { user: Claims }) {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
		null
	);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const [userMenuOpen, setUserMenuOpen] = React.useState(false);

	return (
		<>
			<AppBar position='static'>
				<Container maxWidth='xl'>
					<Toolbar disableGutters>
						<AnalyticsIcon
							sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
						/>
						<Link href='/dashboard'>
							<Typography
								variant='h6'
								noWrap
								sx={{
									mr: 2,
									display: { xs: 'none', md: 'flex' },
									fontFamily: 'monospace',
									fontWeight: 700,
									letterSpacing: '.3rem',
									color: 'inherit',
									textDecoration: 'none',
								}}>
								TRAX
							</Typography>
						</Link>

						<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
							<IconButton
								size='large'
								aria-label='account of current user'
								aria-controls='menu-appbar'
								aria-haspopup='true'
								onClick={handleOpenNavMenu}
								color='inherit'>
								<MenuIcon />
							</IconButton>
							<Menu
								id='menu-appbar'
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'left',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'left',
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: 'block', md: 'none' },
								}}>
								{pages.map((page) => (
									<Link href={page.href || ''} key={page.label}>
										<MenuItem onClick={handleCloseNavMenu}>
											<Typography textAlign='center'>{page.label}</Typography>
										</MenuItem>
									</Link>
								))}
							</Menu>
						</Box>
						<AnalyticsIcon
							sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
						/>
						<Typography
							variant='h5'
							noWrap
							component='a'
							href='/dashboard'
							sx={{
								mr: 2,
								display: { xs: 'flex', md: 'none' },
								flexGrow: 1,
								fontFamily: 'monospace',
								fontWeight: 700,
								letterSpacing: '.3rem',
								color: 'inherit',
								textDecoration: 'none',
							}}>
							TRAX
						</Typography>
						<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
							{pages.map((page) => (
								<Link href={page.href || ''} key={page.label}>
									<MenuItem onClick={handleCloseNavMenu}>
										<Typography textAlign='center'>{page.label}</Typography>
									</MenuItem>
								</Link>
							))}
						</Box>
						<ColorModeSwitch />
						<Typography sx={{ mx: 2 }}>Welcome, {user.name}</Typography>
						<Box sx={{ flexGrow: 0 }}>
							<Tooltip title='Open settings'>
								<IconButton onClick={() => setUserMenuOpen(true)} sx={{ p: 0 }}>
									<Avatar
										alt='User Image'
										src={user.picture}
										rel='noreferrer'
									/>
								</IconButton>
							</Tooltip>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			<UserDrawer
				userMenuOpen={userMenuOpen}
				setUserMenuOpen={setUserMenuOpen}
				user={user}
			/>
		</>
	);
}