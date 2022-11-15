import React, { useCallback, useState, useContext, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import ClientContext from '../contexts/client_context';
import SearchBar from './SearchBar';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';

function NavBar() {
	const client = useContext(ClientContext);

	const navigate = useNavigate();

	return (
		<Grid
			sx={{
				position: 'sticky',
				top: 0,
				backgroundColor: '#181818',
				borderBottom: '1px solid #282828',
				right: 0,
				paddingTop: '15px',
				height: '60px',
				zIndex: 999
				// width: '100%'
			}}
			container
			// spacing={3}
			alignItems="baseline"
		>
			<Grid item xs={4}>
				test
			</Grid>
			<Grid item xs={4}>
				<SearchBar />
			</Grid>
			<Grid item xs={4}>
				<Tooltip title="Create Post">
					<IconButton onClick={() => navigate('/post')}>
						<AddIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Notifications">
					<IconButton>
						<NotificationsIcon />
					</IconButton>
				</Tooltip>
			</Grid>
		</Grid>
	);
}

export default NavBar;
