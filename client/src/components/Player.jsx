import React, { useCallback, useState, useContext } from 'react';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Track from './Track';

function Player({
	track,
	paused,
	position,
	handlePositionChange,
	duration,
	handlePlayback,
	handlePrevious,
	handleSkip,
	volume,
	handleVolumeChange
}) {
	function msToMinSec(ms) {
		let min = Math.floor(ms / 60000);
		let sec = ((ms % 60000) / 1000).toFixed(0);
		if (sec === 60) {
			min += 1;
			sec = 0;
		}
		return `${min}:${String(sec).padStart(2, '0')}`;
	}

	return (
		<footer>
			<Grid
				sx={{
					position: 'absolute',
					bottom: 0,
					backgroundColor: '#181818',
					borderTop: '1px solid #282828',
					width: '100%'
				}}
				container
				alignItems="center"
			>
				<Grid item xs={3}>
					<List>
						<Track track={track} handleTrackSelected={(track) => {}} noHover={true} />
					</List>
				</Grid>
				<Grid item xs={6}>
					<Stack direction="column">
						<Stack direction="row" sx={{ margin: 'auto' }}>
							<IconButton>
								<SkipPreviousIcon fontSize="large" />
							</IconButton>
							<IconButton onClick={handlePlayback}>
								{paused ? <PlayCircleIcon fontSize="large" /> : <PauseCircleIcon fontSize="large" />}
							</IconButton>
							<IconButton>
								<SkipNextIcon fontSize="large" />
							</IconButton>
						</Stack>
						<Stack direction="row" alignItems="center" justifyContent="center">
							<span>{msToMinSec(position)}</span>
							<Slider
								sx={{ width: '50%', margin: '0 10px 0 10px' }}
								size="small"
								value={position}
								min={0}
								step={1}
								max={duration}
								onChange={handlePositionChange}
							/>
							<span>{msToMinSec(duration)}</span>
						</Stack>
					</Stack>
				</Grid>
				<Grid item xs={3}>
					<Stack
						sx={{ width: '35%', marginLeft: 'auto', marginRight: '10%' }}
						spacing={2}
						direction="row"
						alignItems="center"
					>
						<VolumeUp fontSize="small" />
						<Slider aria-label="Volume" size="small" value={volume} onChange={handleVolumeChange} />
					</Stack>
				</Grid>
			</Grid>
		</footer>
	);
}

export default Player;
