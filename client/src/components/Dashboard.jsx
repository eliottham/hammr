import React, { useCallback, useState, useContext } from 'react';
import ClientContext from '../contexts/client_context';
import SearchBar from './SearchBar';

function Dashboard() {
	const client = useContext(ClientContext);

	return (
		<React.Fragment>
			{/* <a href="http://localhost:1337/spotifyAuthorization">Spotify</a> */}
			<br />
			{/* <SearchBar /> */}
		</React.Fragment>
	);
}

export default Dashboard;
