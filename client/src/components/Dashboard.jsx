import React, { useCallback, useState, useContext } from 'react';
import { TextField, Button, Divider, List } from '@mui/material';
import _debounce from 'lodash/debounce';
import ClientContext from '../contexts/client_context';
import Track from './Track';
import SearchBar from './SearchBar';

function Dashboard({ handleTrackSelected }) {
	const client = useContext(ClientContext);

	const [ query, setQuery ] = useState('');
	const [ tracks, setTracks ] = useState([]);

	const debounceSearch = useCallback(_debounce(search, 300), []);

	useState(() => {
		const onSpotifySearch = (tracks) => {
			setTracks(tracks);
		};

		client.on('spotify-search', onSpotifySearch);

		return () => {
			client.un('spotify-search');
		};
	}, []);

	async function search(q) {
		if (q) {
			client.spotifySearch(q);
		} else {
			setTracks([]);
		}
	}

	function handleOnChange(e) {
		setQuery(e.target.value);
		debounceSearch(e.target.value);
	}

	return (
		<React.Fragment>
			<a href="http://localhost:1337/spotifyAuthorization">Spotify</a>
			<br />
			<SearchBar 
				handleTrackSelected={handleTrackSelected}
			/>
			{/* <TextField 
				sx={{

				}}
				value={query} 
				onChange={(e) => handleOnChange(e)} 
			/>
			<List>
				{tracks.map((track, i) => {
					return (
						<React.Fragment key={track.id}>
							<Track track={track} handleTrackSelected={handleTrackSelected} />
							{i < tracks.length - 1 ? <Divider key={track.id} /> : null}
						</React.Fragment>
					);
				})}
			</List> */}
		</React.Fragment>
	);
}

export default Dashboard;
