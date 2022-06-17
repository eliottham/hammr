import React, { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';

function Track({ track, handleTrackSelected, noHover }) {
  const theme = useTheme();

  const style = {
    backgroundColor: '#181818',
    '&:hover': {
      backgroundColor: theme.palette.grey[900]
    }
  }

	return (
		<ListItem 
      key={track?.id} 
      sx={style}
      onClick={() => handleTrackSelected(track)}
      >
			<ListItemAvatar>
				<Avatar variant="square" src={track?.album.images[0].url} />
			</ListItemAvatar>
			<ListItemText primary={track?.name} secondary={track?.artists[0].name} />
		</ListItem>
	);
}

export default Track;
