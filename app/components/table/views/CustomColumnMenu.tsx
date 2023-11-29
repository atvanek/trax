'use client';
import React, { SetStateAction } from 'react';
import {
	GridColumnMenu,
	GridColumnMenuProps,
	GridColumnMenuItemProps,
	GridColDef,
} from '@mui/x-data-grid';
import { MenuItem, ListItemText } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Delete } from '@mui/icons-material';
import DeleteConfirm from '../../DeleteConfirm';
import GridContext from '@/context/GridContext';

interface CustomColumnMenuProps extends GridColumnMenuProps {
	setColumns: React.Dispatch<SetStateAction<GridColDef[]>>;
}

export default function CustomColumnMenu(props: CustomColumnMenuProps) {
	const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
	const [deleteField, setDeleteField] = React.useState<string | null>(null);
	const [error, setError] = React.useState(false);
	const { customColumns, setCustomColumns } = React.useContext(GridContext);
	const handleRequestDeleteColumn: React.MouseEventHandler<SVGElement> = (
		e
	) => {
		setDeleteConfirmOpen(true);
		setDeleteField(colDef.headerName || '');
	};
	const { colDef, setColumns } = props;
	const handleDeleteClick = () => {
		setColumns((prev) => {
			return prev.filter((column) => column.headerName !== deleteField);
		});
		setCustomColumns(customColumns.filter((column) => column !== deleteField));
		setDeleteConfirmOpen(false);
		fetch('/api/user/column', {
			method: 'DELETE',
			body: JSON.stringify({ id: deleteField }),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					setError(true);
				}
			})
			.catch((err) => {
				console.log(err);
				setError(true);
			});
	};

	function CustomUserItem(props: GridColumnMenuItemProps) {
		const { myCustomHandler, myCustomValue } = props;
		return (
			<MenuItem onClick={myCustomHandler}>
				<ListItemIcon>
					<Delete fontSize='small' />
				</ListItemIcon>
				<ListItemText>{myCustomValue}</ListItemText>
			</MenuItem>
		);
	}

	return (
		<>
			<GridColumnMenu
				{...props}
				slots={
					colDef.headerName && customColumns.includes(colDef.headerName)
						? {
								// Add new item
								columnMenuUserItem: CustomUserItem,
						  }
						: {}
				}
				slotProps={{
					columnMenuUserItem: {
						// set `displayOrder` for the new item
						displayOrder: 15,
						// Additional props
						myCustomValue: 'Delete column',
						myCustomHandler: handleRequestDeleteColumn,
					},
				}}
			/>
			<DeleteConfirm
				deleteConfirmOpen={deleteConfirmOpen}
				setDeleteConfirmOpen={setDeleteConfirmOpen}
				handleDeleteClick={handleDeleteClick}
				confirmationMessage='All column details will be deleted.'
			/>
		</>
	);
}
