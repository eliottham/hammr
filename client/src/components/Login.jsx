import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Avatar, TextField, Button, Typography, Link, Checkbox, FormControlLabel } from '@mui/material';
import ClientContext from '../contexts/client_context';

function Login() {

	const client = useContext(ClientContext);
	const navigate = useNavigate();

	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');

	useEffect(() => {
		const onLogin = ({ success }) => {
			if (success) {
				client.getSpotifyTokens();
				alert('Login successful');
				navigate('/');
			} else {
				alert('Invalid username and/or password');			
			}
		}

		client.on('login', onLogin);

		return () => {
			client.un('login', onLogin)
		}
	}, []);

	async function login() {
		client.login({ email, password });
	}

	const paperStyle = { padding: 20, height: '55vh', width: '25%', margin: '100px auto' };
	const buttonStyle = { margin: '8px 0' };
  const linksStyle = { paddingTop: 30, textAlign: 'center' }

	return (
		<Grid>
			<Paper elevation={10} style={paperStyle}>
				<Grid align="center">
					<Avatar />
					<h2>Login</h2>
				</Grid>
				<TextField
					label="Email"
					placeholder="Enter email"
					fullWidth
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					style={{paddingBottom: '8px'}}
					onKeyPress={(e) => {
						if (e.which === 13) {
							login();
						}
					}}
				/>
				<TextField
					label="Password"
					placeholder="Enter password"
					type="password"
					fullWidth
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					onKeyPress={(e) => {
						if (e.which === 13) {
							login();
						}
					}}
				/>
				<FormControlLabel control={<Checkbox name="checkedB" color="primary" />} label="Remember me" />
				<Button type="submit" color="primary" variant="contained" style={buttonStyle} fullWidth onClick={login}>
					Login
				</Button>
				<div style={linksStyle}>
					<Typography>
						<Link href="#">Forgot password?</Link>
					</Typography>
					<Typography>
						{' '}
						Don't have an account?&emsp;
						<Link href="/register">Sign Up</Link>
					</Typography>
				</div>
			</Paper>
		</Grid>
	);
}

export default Login;
