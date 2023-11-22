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
	Collapse,
} from '@mui/material';
import { ExpandMore, ExpandLess, Delete, Logout } from '@mui/icons-material';
import Link from 'next/link';
import { Claims } from '@auth0/nextjs-auth0';
import DeleteConfirm from '../DeleteConfirm';
import { MouseEventHandler } from 'react';
import Context from '@/context/customColumnContext';

export default function UserDrawer({
	userMenuOpen,
	user,
	setUserMenuOpen,
}: {
	userMenuOpen: boolean;
	user: Claims;
	setUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [customColumnsOpen, setCustomColumnsOpen] = React.useState(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
	const [deleteId, setDeleteId] = React.useState<string | null>(null);
	const [error, setError] = React.useState(false);
	const theme = useTheme();
	const { customColumns, setCustomColumns } = React.useContext(Context);

	const handleRequestDeleteColumn: MouseEventHandler<SVGElement> = (e) => {
		const currentTarget = e.currentTarget as SVGElement;
		setDeleteConfirmOpen(true);
		setDeleteId(currentTarget.id);
	};

	const handleDeleteClick = () => {
		setCustomColumns(customColumns.filter((column) => column !== deleteId));
		setDeleteConfirmOpen(false);
		fetch('/api/user/column', {
			method: 'DELETE',
			body: JSON.stringify({ id: deleteId }),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					setError(true);
				}
			})
			// .then((data: { rows: Row[] }) => {
			// 	const newRows = data.rows.map((row) => ({
			// 		...row,
			// 		date: row.date ? new Date(row.date) : new Date(),
			// 	})) as Row[];
			// 	setRows(newRows);
			// })
			.catch((err) => {
				console.log(err);
				setError(true);
			});
	};
	console.log(customColumns);
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
				<ListItemButton onClick={() => setCustomColumnsOpen((prev) => !prev)}>
					<ListItemIcon>
						{customColumnsOpen ? <ExpandMore /> : <ExpandLess />}
					</ListItemIcon>
					<ListItemText>Custom Columns</ListItemText>
				</ListItemButton>
				<Collapse in={customColumnsOpen}>
					<List>
						{customColumns.map((column) => (
							<ListItemButton key={column}>
								<ListItemIcon>
									<Delete
										sx={{ height: '15px' }}
										onClick={handleRequestDeleteColumn}
										id={column}
									/>
								</ListItemIcon>
								<ListItemText>{column}</ListItemText>
							</ListItemButton>
						))}
					</List>
				</Collapse>
				<Link href={'/api/auth/logout'}>
					<ListItemButton>
						<ListItemIcon>
							<Logout />
						</ListItemIcon>
						<ListItemText>Logout</ListItemText>
					</ListItemButton>
				</Link>
			</List>
			<DeleteConfirm
				deleteConfirmOpen={deleteConfirmOpen}
				setDeleteConfirmOpen={setDeleteConfirmOpen}
				handleDeleteClick={handleDeleteClick}
				confirmationMessage='All column details will be deleted.'
			/>
		</Drawer>
	);
}
