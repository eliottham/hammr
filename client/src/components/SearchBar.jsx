import React, { useCallback, useState, useContext } from 'react';
import { TextField, Button, Divider, List } from '@mui/material';
import _debounce from 'lodash/debounce';
import ClientContext from '../contexts/client_context';
import Track from './Track';
import Stack from '@mui/material/Stack';

function SearchBar({ handleTrackSelected }) {
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

  function handleTrackSelectedClearList(e) {
    handleTrackSelected(e);
    setQuery(e.name);
    setTracks([]);
  }

  function handleOnFocus() {
    search(query);
  }

  function handleOnBlur() {
    // setTracks([]);
  }

	return (
		<Stack
      justifyContent="flex-start"
      alignItems="center"
      spacing={0}>
			<TextField 
				sx={{
          width: "35%"
				}}
        label="Search"
				value={query} 
				onChange={(e) => handleOnChange(e)} 
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
			/>
			<List sx={{width: "35%"}}>
				{tracks.map((track, i) => {
					return (
						<React.Fragment key={track.id}>
							<Track track={track} handleTrackSelected={handleTrackSelectedClearList} />
							{i < tracks.length - 1 ? <Divider key={track.id} /> : null}
						</React.Fragment>
					);
				})}
			</List>
		</Stack>
	);
}

export default SearchBar;
