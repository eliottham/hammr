import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import _debounce from 'lodash/debounce';

import { ClientProvider } from './contexts/client_context';
import { UserProvider } from './contexts/user_context';
import { SpotifyPlayerProvider } from './contexts/spotify_player_context';

import Client from './client';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Player from './components/Player';

const client = new Client();
let spotifyPlayer, spotifyDeviceId;

const theme = createTheme({
	palette: {
		primary: {
			main: '#ffbb00'
		},
		mode: 'dark'
	}
});

const App = () => {
	const navigate = useNavigate();

	const [ user, setUser ] = useState();
	const [ track, setTrack ] = useState();
	const [ paused, setPaused ] = useState(true);
	const [ volume, setVolume ] = useState(100);
	const [ trackPosition, setTrackPosition ] = useState(0);
	const [ trackDuration, setTrackDuration ] = useState(0);

	useEffect(() => {
		const onUser = (response) => {
			if (response.success) {
				setUser(response.user);
				client.getSpotifyTokens();
			} else {
				navigate('/login');
			}
		};
		client.on('user', onUser);

		const onLogin = (response) => {
			if (response.success) {
				setUser(response.user);
			}
		};
		client.on('login', onLogin);

		const authenticatedPaths = [ '/' ];
		if (!user && authenticatedPaths.includes(window.location.pathname)) {
			client.getUser();
		}

		return () => {
			client.un('user', onUser);
			client.un('login', onLogin);
		};
	}, []);

	useEffect(
		() => {
			const onSpotifyTokens = () => {
				const previousScript = document.getElementById('spotify-player');
				if (previousScript) {
					previousScript.remove();
				}
				const script = document.createElement('script', { is: 'spotify-web-player' });
				script.id = 'spotify-player';
				script.src = 'https://sdk.scdn.co/spotify-player.js';
				script.async = true;
				document.body.appendChild(script);
				window.onSpotifyWebPlaybackSDKReady = () => {
					spotifyPlayer = new window.Spotify.Player({
						name: 'Zam Web Player',
						getOAuthToken: async (cb) => {
							cb(user.spotifyAccessToken);
						}
					});
					spotifyPlayer.addListener('ready', ({ device_id }) => {
						spotifyDeviceId = device_id;
					});
					spotifyPlayer.addListener('player_state_changed', ({ position, duration, paused }) => {
						setTrackPosition(position);
						setTrackDuration(duration);
					});
					spotifyPlayer.connect();
				};
			};
			client.on('spotify-tokens', onSpotifyTokens);

			return () => {
				client.un('spotify-tokens', onSpotifyTokens);
			};
		},
		[ user ]
	);

	useEffect(
		() => {
			let intervalId;
			if (!paused) {
				intervalId = setInterval(() => setTrackPosition(trackPosition + 1000), 1000);
			} else {
				clearInterval(intervalId);
			}

			return () => {
				clearInterval(intervalId);
			};
		},
		[ trackPosition ]
	);

	function handleTrackSelected(track) {
		setTrack(track);
		setPaused(false);
		client.playSpotifyTrack(track, spotifyDeviceId);
	}

	function handlePlayback() {
		setPaused(!paused);
		if (paused) {
			spotifyPlayer.resume();
		} else {
			spotifyPlayer.pause();
		}
	}

	function handlePositionChange(e, newValue) {
		setTrackPosition(newValue);
		spotifyPlayer.seek(newValue);
	}
	const debounceHandlePositionChange = useCallback(_debounce(handlePositionChange, 50));

	function handleVolumeChange(e, newValue) {
		setVolume(newValue);
		spotifyPlayer.setVolume(volume / 100);
	}

	return (
		<div>
			<ClientProvider value={client}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Routes>
						<Route path="/" exact element={<Dashboard handleTrackSelected={handleTrackSelected} />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
					</Routes>
					<Player
						track={track}
						paused={paused}
						position={trackPosition}
						handlePositionChange={debounceHandlePositionChange}
						duration={trackDuration}
						handlePlayback={handlePlayback}
						volume={volume}
						handleVolumeChange={handleVolumeChange}
					/>
				</ThemeProvider>
			</ClientProvider>
		</div>
	);
};

export default App;
